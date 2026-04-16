namespace ChoreoCreator.Core.Models;

/// <summary>
/// Формирование танцоров в рамках сценария.
/// Содержит как геометрию (позиции), так и временные параметры клипа на timeline.
/// </summary>
public class Formation
{
    /// <summary>Минимальная длительность формирования: 1 секунда.</summary>
    public const int MIN_DURATION_MS = 1_000;

    /// <summary>Максимальная длительность формирования: 3 минуты.</summary>
    public const int MAX_DURATION_MS = 180_000;

    /// <summary>
    /// Создаёт формирование.
    /// </summary>
    /// <param name="id">Уникальный идентификатор формирования.</param>
    /// <param name="numberInScenario">Порядковый номер в сценарии.</param>
    /// <param name="startTimeMs">Время старта на общей шкале (мс), не может быть отрицательным.</param>
    /// <param name="durationMs">Общая длительность формирования (мс), ограничена 1с..3м.</param>
    /// <param name="animationDurationMs">Длительность анимационной части внутри формирования (мс), ограничена 0..durationMs.</param>
    /// <param name="name">Отображаемое имя формирования. При пустом значении назначается Formation-#.</param>
    /// <param name="description">Описание формирования.</param>
    public Formation(
        Guid id,
        int numberInScenario,
        int startTimeMs = 0,
        int durationMs = 10_000,
        int animationDurationMs = 5_000,
        string? name = null,
        string? description = null,
        bool isAutoName = true)
    {
        Id = id;
        NumberInScenario = numberInScenario;
        StartTimeMs = Math.Max(0, startTimeMs);
        DurationMs = Math.Clamp(durationMs, MIN_DURATION_MS, MAX_DURATION_MS);
        AnimationDurationMs = Math.Clamp(animationDurationMs, 0, DurationMs);
        Name = string.IsNullOrWhiteSpace(name) ? $"Formation-{numberInScenario}" : name.Trim();
        Description = description ?? string.Empty;
        IsAutoName = isAutoName || string.IsNullOrWhiteSpace(name);
    }

    /// <summary>Идентификатор формирования.</summary>
    public Guid Id { get; private set; }

    /// <summary>Порядковый номер формирования в сценарии.</summary>
    public int NumberInScenario { get; private set; }

    /// <summary>Время начала формирования на timeline (мс).</summary>
    public int StartTimeMs { get; private set; }

    /// <summary>Общая длительность формирования (мс).</summary>
    public int DurationMs { get; private set; }

    /// <summary>
    /// Длительность анимационной части внутри формирования (мс).
    /// После этого момента и до конца клипа состояние считается статичным.
    /// </summary>
    public int AnimationDurationMs { get; private set; }

    /// <summary>Название формирования.</summary>
    public string Name { get; private set; }

    /// <summary>Описание формирования.</summary>
    public string Description { get; private set; }

    /// <summary>Признак автогенерированного имени (можно безопасно переименовывать при реиндексации).</summary>
    public bool IsAutoName { get; private set; }

    private readonly List<DancerPosition> _dancerPositions = [];

    /// <summary>Позиции танцоров в рамках формирования.</summary>
    public IReadOnlyCollection<DancerPosition> DancerPositions => _dancerPositions;

    /// <summary>
    /// Добавляет позицию танцора к формированию.
    /// </summary>
    /// <param name="dancerPosition">Позиция танцора.</param>
    public void AddDancerPosition(DancerPosition dancerPosition)
    {
        _dancerPositions.Add(dancerPosition ?? throw new ArgumentNullException(nameof(dancerPosition)));
    }

    /// <summary>
    /// Обновляет временные параметры формирования с доменными ограничениями.
    /// </summary>
    /// <param name="startTimeMs">Новое время старта на timeline (мс), не меньше 0.</param>
    /// <param name="durationMs">Новая длительность формирования (мс), 1с..3м.</param>
    /// <param name="animationDurationMs">Новая длительность анимации (мс), 0..durationMs.</param>
    public void UpdateTimeline(int startTimeMs, int durationMs, int animationDurationMs)
    {
        StartTimeMs = Math.Max(0, startTimeMs);
        DurationMs = Math.Clamp(durationMs, MIN_DURATION_MS, MAX_DURATION_MS);
        AnimationDurationMs = Math.Clamp(animationDurationMs, 0, DurationMs);
    }

    /// <summary>
    /// Обновляет название и описание формирования.
    /// </summary>
    /// <param name="name">Название. Если пустое, выставляется дефолтное Formation-#.</param>
    /// <param name="description">Описание.</param>
    public void UpdateMeta(string? name, string? description, bool? isAutoName = null)
    {
        Name = string.IsNullOrWhiteSpace(name) ? $"Formation-{NumberInScenario}" : name.Trim();
        Description = description ?? string.Empty;
        IsAutoName = isAutoName ?? (string.IsNullOrWhiteSpace(name));
    }
}

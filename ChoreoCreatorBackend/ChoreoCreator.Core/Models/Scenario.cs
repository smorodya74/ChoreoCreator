namespace ChoreoCreator.Core.Models
{
    /// <summary>
    /// Сценарий хореографии.
    /// Хранит метаданные сценария, общую длительность timeline и последовательность формирований.
    /// </summary>
    public class Scenario
    {
        /// <summary>Максимальная длина названия сценария.</summary>
        public const int MAX_TITLE_LENGTH = 64;

        /// <summary>Максимальная длина описания сценария.</summary>
        public const int MAX_DESCRIPTION_LENGTH = 128;

        /// <summary>Минимальная общая длительность сценария: 10 секунд.</summary>
        public const int MIN_TIMELINE_DURATION_MS = 10_000;

        /// <summary>Максимальная общая длительность сценария: 20 минут.</summary>
        public const int MAX_TIMELINE_DURATION_MS = 1_200_000;

        /// <summary>
        /// Инициализирует сценарий.
        /// </summary>
        /// <param name="id">Идентификатор сценария.</param>
        /// <param name="title">Название сценария.</param>
        /// <param name="description">Описание сценария.</param>
        /// <param name="dancerCount">Количество танцоров.</param>
        /// <param name="userId">Идентификатор владельца.</param>
        /// <param name="isPublished">Флаг публикации.</param>
        /// <param name="totalDurationMs">Общая длительность timeline (мс), ограничена 10с..20м.</param>
        /// <param name="formations">Набор формирований.</param>
        public Scenario(
            Guid id,
            string title,
            string description,
            int dancerCount,
            Guid userId,
            bool isPublished,
            int totalDurationMs = MIN_TIMELINE_DURATION_MS,
            IEnumerable<Formation>? formations = null)
        {
            Id = id;
            Title = title;
            Description = description;
            DancerCount = dancerCount;
            UserId = userId;
            IsPublished = isPublished;
            TotalDurationMs = Math.Clamp(totalDurationMs, MIN_TIMELINE_DURATION_MS, MAX_TIMELINE_DURATION_MS);

            if (formations != null)
            {
                _formations.AddRange(formations);
            }
        }

        /// <summary>Идентификатор сценария.</summary>
        public Guid Id { get; }

        /// <summary>Название сценария.</summary>
        public string Title { get; private set; }

        /// <summary>Описание сценария.</summary>
        public string Description { get; private set; }

        /// <summary>Количество танцоров в сценарии.</summary>
        public int DancerCount { get; private set; }

        /// <summary>Идентификатор владельца сценария.</summary>
        public Guid UserId { get; }

        /// <summary>Признак публикации сценария.</summary>
        public bool IsPublished { get; private set; }

        /// <summary>Общая длительность timeline сценария (мс).</summary>
        public int TotalDurationMs { get; private set; }

        private readonly List<Formation> _formations = [];

        /// <summary>Формирования сценария.</summary>
        public IReadOnlyCollection<Formation> Formations => _formations;

        /// <summary>
        /// Валидирует входные данные и создаёт новый сценарий.
        /// </summary>
        /// <returns>Кортеж с созданным сценарием и строкой ошибки (пустая при успехе).</returns>
        public static (Scenario Scenario, string Error) Create(
            Guid id,
            string title,
            string description,
            int dancerCount,
            Guid userId,
            int totalDurationMs = MIN_TIMELINE_DURATION_MS)
        {
            var error = string.Empty;

            if (string.IsNullOrWhiteSpace(title) || title.Length > MAX_TITLE_LENGTH)
                throw new ArgumentException($"Название не может быть пустым или длиннее {MAX_TITLE_LENGTH} символов");

            description ??= string.Empty;

            if (description.Length > MAX_DESCRIPTION_LENGTH)
                throw new ArgumentException($"Описание не может быть длиннее {MAX_DESCRIPTION_LENGTH} символов");

            if (dancerCount < 1 || dancerCount > 16)
                throw new ArgumentException("Количество танцоров должно быть от 1 до 16");

            var scenario = new Scenario(id, title, description, dancerCount, userId, false, totalDurationMs);
            return (scenario, error);
        }

        /// <summary>Публикует сценарий.</summary>
        public void Publish() => IsPublished = true;

        /// <summary>
        /// Обновляет название сценария.
        /// </summary>
        public void UpdateTitle(string newTitle)
        {
            if (string.IsNullOrWhiteSpace(newTitle) || newTitle.Length > MAX_TITLE_LENGTH)
                throw new ArgumentException($"Название не может быть пустым или длиннее {MAX_TITLE_LENGTH} символов");

            Title = newTitle;
        }

        /// <summary>
        /// Обновляет описание сценария.
        /// </summary>
        public void UpdateDescription(string newDescription)
        {
            newDescription ??= string.Empty;

            if (newDescription.Length > MAX_DESCRIPTION_LENGTH)
                throw new ArgumentException($"Описание не может быть длиннее {MAX_DESCRIPTION_LENGTH} символов");

            Description = newDescription;
        }

        /// <summary>
        /// Обновляет количество танцоров.
        /// </summary>
        public void UpdateDancerCount(int count)
        {
            if (count < 1 || count > 16)
                throw new ArgumentException("Количество танцоров должно быть от 1 до 16");

            DancerCount = count;
        }

        /// <summary>
        /// Обновляет общую длительность timeline сценария.
        /// </summary>
        /// <param name="totalDurationMs">Новая длительность (мс), ограничена 10с..20м.</param>
        public void UpdateTotalDuration(int totalDurationMs)
        {
            TotalDurationMs = Math.Clamp(totalDurationMs, MIN_TIMELINE_DURATION_MS, MAX_TIMELINE_DURATION_MS);
        }

        /// <summary>
        /// Добавляет формирование в сценарий.
        /// </summary>
        public void AddFormation(Formation formation)
        {
            ArgumentNullException.ThrowIfNull(formation);
            _formations.Add(formation);
        }

        /// <summary>
        /// Экспортирует сценарий в PDF.
        /// </summary>
        /// <returns>Содержимое PDF в виде массива байт.</returns>
        public byte[] ExportToPdf()
        {
            throw new NotImplementedException("Реализация в Application слое");
        }
    }
}

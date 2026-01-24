using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions.Repositories;

/// <summary>
/// Репозиторий доступа к данным сценариев.
/// </summary>
public interface IScenariosRepository
{
    /// <summary>
    /// Возвращает все сценарии.
    /// </summary>
    Task<List<Scenario>> GetAllAsync();

    /// <summary>
    /// Возвращает сценарий по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор сценария.</param>
    /// <returns>Сценарий или <c>null</c>.</returns>
    Task<Scenario?> GetByIdAsync(Guid id);

    /// <summary>
    /// Возвращает сценарий пользователя.
    /// </summary>
    /// <param name="userId">Идентификатор пользователя.</param>
    /// <returns>Сценарий или <c>null</c>.</returns>
    Task<Scenario?> GetByUserIdAsync(Guid userId);

    /// <summary>
    /// Сохраняет сценарий в хранилище.
    /// </summary>
    /// <param name="scenario">Сценарий для сохранения.</param>
    Task SaveAsync(Scenario scenario);

    /// <summary>
    /// Удаляет сценарий по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор сценария.</param>
    /// <returns><c>true</c>, если сценарий удалён.</returns>
    Task<bool> DeleteAsync(Guid id);
}

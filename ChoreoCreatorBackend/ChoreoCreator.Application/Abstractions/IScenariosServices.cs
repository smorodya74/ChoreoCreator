using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions
{
    /// <summary>
    /// Сервис управления сценариями постановки.
    /// </summary>
    public interface IScenariosServices
    {
        /// <summary>
        /// Возвращает список всех сценариев.
        /// </summary>
        Task<List<Scenario>> GetAllScenarios();

        /// <summary>
        /// Возвращает сценарий по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор сценария.</param>
        /// <returns>Сценарий или <c>null</c>, если не найден.</returns>
        Task<Scenario?> GetScenarioById(Guid id);

        /// <summary>
        /// Возвращает сценарий пользователя.
        /// </summary>
        /// <param name="userId">Идентификатор пользователя.</param>
        /// <returns>Сценарий пользователя или <c>null</c>.</returns>
        Task<Scenario?> GetScenarioByUserId(Guid userId);

        /// <summary>
        /// Сохраняет новый сценарий.
        /// </summary>
        /// <param name="scenario">Сценарий для создания.</param>
        /// <returns>Идентификатор созданного сценария.</returns>
        Task<Guid> CreateScenario(Scenario scenario);

        /// <summary>
        /// Удаляет сценарий по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор сценария.</param>
        /// <returns><c>true</c>, если сценарий удалён.</returns>
        Task<bool> DeleteScenario(Guid id);

        /// <summary>
        /// Обновляет сценарий и его формирования.
        /// </summary>
        /// <param name="scenario">Обновлённые данные сценария.</param>
        /// <returns><c>true</c>, если сценарий найден и обновлён.</returns>
        Task<bool> UpdateScenario(Scenario scenario);
    }
}

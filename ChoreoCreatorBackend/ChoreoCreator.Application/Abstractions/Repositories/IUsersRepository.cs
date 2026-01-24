using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions.Repositories;

/// <summary>
/// Репозиторий доступа к данным пользователей.
/// </summary>
public interface IUsersRepository
{
    /// <summary>
    /// Создаёт пользователя в хранилище.
    /// </summary>
    /// <param name="user">Сущность пользователя.</param>
    /// <returns>Идентификатор созданного пользователя.</returns>
    Task<Guid> Create(User user);

    /// <summary>
    /// Удаляет пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns><c>true</c>, если пользователь удалён.</returns>
    Task<bool> Delete(Guid id);

    /// <summary>
    /// Проверяет наличие пользователя по email.
    /// </summary>
    /// <param name="email">Email пользователя.</param>
    Task<bool> ExistsByEmail(string email);

    /// <summary>
    /// Возвращает список всех пользователей.
    /// </summary>
    Task<List<User>> GetAll();

    /// <summary>
    /// Возвращает пользователя по email.
    /// </summary>
    /// <param name="email">Email пользователя.</param>
    /// <returns>Пользователь или <c>null</c>.</returns>
    Task<User?> GetByEmail(string email);

    /// <summary>
    /// Возвращает пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns>Пользователь или <c>null</c>.</returns>
    Task<User?> GetById(Guid id);

    /// <summary>
    /// Обновляет данные пользователя.
    /// </summary>
    /// <param name="user">Сущность пользователя.</param>
    Task Update(User user);
}

using ChoreoCreator.Core.Helpers;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Application.Abstractions;

/// <summary>
/// Сервис управления пользователями и их доступом.
/// </summary>
public interface IUsersService
{
    /// <summary>
    /// Возвращает пользователя по email.
    /// </summary>
    /// <param name="email">Email пользователя.</param>
    /// <returns>Пользователь или <c>null</c>.</returns>
    Task<User?> GetByEmail(string email);

    /// <summary>
    /// Проверяет корректность учетных данных пользователя.
    /// </summary>
    /// <param name="email">Email пользователя.</param>
    /// <param name="password">Пароль пользователя.</param>
    /// <returns>Пользователь или <c>null</c>, если проверка не пройдена.</returns>
    Task<User?> ValidateCredentials(string email, string password);

    /// <summary>
    /// Регистрирует нового пользователя.
    /// </summary>
    /// <param name="email">Email пользователя.</param>
    /// <param name="username">Имя пользователя.</param>
    /// <param name="password">Пароль пользователя.</param>
    /// <param name="ct">Токен отмены.</param>
    /// <returns>Результат регистрации или ошибка.</returns>
    Task<Result<UserId, string>> RegisterUser(string email, string username, string password, CancellationToken ct);

    /// <summary>
    /// Возвращает список всех пользователей.
    /// </summary>
    Task<List<User>> GetAllUsers();

    /// <summary>
    /// Изменяет статус блокировки пользователя.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="isBlocked">Новый статус блокировки.</param>
    /// <returns><c>true</c>, если пользователь найден и обновлён.</returns>
    Task<bool> ChangeBlockStatus(Guid id, bool isBlocked);

    /// <summary>
    /// Меняет пароль пользователя при корректном текущем пароле.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="currentPassword">Текущий пароль.</param>
    /// <param name="newPassword">Новый пароль.</param>
    /// <returns><c>true</c>, если пароль изменён.</returns>
    Task<bool> ChangePassword(Guid id, UserPassword currentPassword, UserPassword newPassword);

    /// <summary>
    /// Удаляет пользователя по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <returns><c>true</c>, если пользователь удалён.</returns>
    Task<bool> DeleteUser(Guid id);
}

using ChoreoCreator.Core.Helpers;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Application.Abstractions;

public interface IUsersService
{
    Task<User?> GetByEmail(string email);  // Получить пользователя по email
    Task<User?> ValidateCredentials(string email, string password);  // Проверка логина и пароля

    Task<Result<UserId, string>> RegisterUser(string email, string password, CancellationToken ct);
}

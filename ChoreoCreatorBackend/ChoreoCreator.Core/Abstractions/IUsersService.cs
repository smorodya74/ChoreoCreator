using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Core.Abstractions
{
    public interface IUsersService
    {
        Task<User?> GetByEmail(string email);  // Получить пользователя по email
        Task<User?> ValidateCredentials(string email, string password);  // Проверка логина и пароля
    }
}

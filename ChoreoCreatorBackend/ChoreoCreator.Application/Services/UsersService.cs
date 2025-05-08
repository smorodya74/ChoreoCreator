using ChoreoCreator.Core.Abstractions;
using ChoreoCreator.Core.Helpers;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.Services;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.Extensions.Logging;

namespace ChoreoCreator.Application.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepository;
        private readonly ILogger<UsersService> _logger;
        private readonly UserRegistrationService _userRegistrationService;

        public UsersService(
            IUsersRepository userRepository,
            ILogger<UsersService> logger,
            UserRegistrationService userRegistrationService)
        {
            _userRepository = userRepository;
            _logger = logger;
            this._userRegistrationService = userRegistrationService;
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _userRepository.GetByEmail(email);
        }

        public async Task<User?> ValidateCredentials(string email, string password)
        {
            var user = await GetByEmail(email);

            if (user == null)
            {
                return null;
            }

            // Проверяем пароль
            if (_passwordHasher.VerifyHashedPassword(user.PasswordHash, password)
                != PasswordVerificationResult.Success)
            {
                _logger.LogWarning($"Неверный логин или пароль {email}.");
                return null;
            }

            return user;
        }

        /// <inheritdoc />
        public async Task<Result<UserId, string>> RegisterUser(string email, string password, CancellationToken ct)
        {
            if (UserEmail.CanCreate(email) == false)
            {
                return "Неправильно указана почта, попробуйте ввести другую"; // Тут пользовательские ошибки на уровне представления
            }

            if (UserPassword.CanCreate(password) == false)
            {
                return $"неправильно указан пароль: максимальная длина {UserPassword.MaximumLength} минимальная {UserPassword.MinimumLength}";
            }

            var result = await this._userRegistrationService.Register(UserEmail.From(email), UserPassword.From(password), ct);
            if (result is { IsFailure: true })
            {
                // Ну тут ошибка должна быть не строкой скорее всего, это я сделал чтобы быстро написать. Нужно доменные ошибки формировать в ошибки представления
                // например если у тебя есть два приложения, админка и апи, в одном случае надо подробно рассказать, в другом нет
                return result.Error; 
            }

            var id = await this._userRepository.Create(result.Value);

            return UserId.From(id);
        }
    }
}

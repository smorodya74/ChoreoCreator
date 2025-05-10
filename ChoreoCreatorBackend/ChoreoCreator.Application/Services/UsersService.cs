using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Contracts;
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
        private readonly IUserPasswordHasher _passwordHasher;

        public UsersService(
            IUsersRepository userRepository,
            ILogger<UsersService> logger,
            UserRegistrationService userRegistrationService,
            IUserPasswordHasher passwordHasher)
        {
            _userRepository = userRepository;
            _logger = logger;
            _userRegistrationService = userRegistrationService;
            _passwordHasher = passwordHasher;
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _userRepository.GetByEmail(email);
        }

        public async Task<User?> ValidateCredentials(string email, string password)
        {
            var user = await GetByEmail(email);

            if (user == null)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(user.PasswordHash, UserPassword.From(password));
            if (result != PasswordVerificationResult.Success)
            {
                _logger.LogWarning("Неверный логин или пароль для {Email}", email);
                return null;
            }

            return user;
        }

        public async Task<Result<UserId, string>> RegisterUser(string email, string username, string password, CancellationToken ct)
        {
            if (!UserEmail.CanCreate(email))
            {
                return "Введите почту в формате example@mail.ru";
            }

            if (!UserPassword.CanCreate(password))
            {
                return $"Минимальная длина пароля {UserPassword.MinimumLength} символов, максимальная {UserPassword.MaximumLength}.";
            }

            var result = await _userRegistrationService.Register(UserEmail.From(email), Username.From(username), UserPassword.From(password), ct);
            if (result is { IsFailure: true })
            {
                return result.Error; 
            }

            var id = await _userRepository.Create(result.Value);

            return UserId.From(id);
        }
    }
}

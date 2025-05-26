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
        private readonly IUsersRepository _usersRepository;
        private readonly ILogger<UsersService> _logger;
        private readonly UserRegistrationService _userRegistrationService;
        private readonly IUserPasswordHasher _passwordHasher;

        public UsersService(
            IUsersRepository userRepository,
            ILogger<UsersService> logger,
            UserRegistrationService userRegistrationService,
            IUserPasswordHasher passwordHasher)
        {
            _usersRepository = userRepository;
            _logger = logger;
            _userRegistrationService = userRegistrationService;
            _passwordHasher = passwordHasher;
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _usersRepository.GetByEmail(email);
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

            var id = await _usersRepository.Create(result.Value);

            return UserId.From(id);
        }

        public async Task<List<User>> GetAllUsers()
        {
            var users = await _usersRepository.GetAll();
            return users;
        }

        public async Task<bool> ChangeBlockStatus(Guid userId, bool isBlocked)
        {
            var user = await _usersRepository.GetById(userId);
            if (user == null)
                return false;

            user.ChangeBlockStatus(isBlocked);
            await _usersRepository.Update(user);
            return true;
        }

        public async Task<bool> ChangePassword(Guid id, UserPassword currentPassword, UserPassword newPassword)
        {
            var user = await _usersRepository.GetById(id);
            if (user == null) return false;

            // Проверка текущего пароля
            var verifyResult = _passwordHasher.VerifyHashedPassword(user.PasswordHash, currentPassword);
            if (verifyResult == PasswordVerificationResult.Failed)
            {
                return false;
            }

            // Хешируем новый пароль и меняем
            var newHashed = _passwordHasher.HashPassword(newPassword);
            user.ChangePassword(newHashed);
            await _usersRepository.Update(user);
            return true;
        }

        public async Task<bool> DeleteUser(Guid id)
        {
            return await _usersRepository.Delete(id);
        }
    }
}

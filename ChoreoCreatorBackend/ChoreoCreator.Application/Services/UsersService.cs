using ChoreoCreator.Core.Abstractions;
using ChoreoCreator.Core.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Extensions.Logging;

namespace ChoreoCreator.Application.Services
{
    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _userRepository;
        private readonly ILogger<UsersService> _logger;
        private readonly IPasswordHasher _passwordHasher;

        public UsersService(IUsersRepository userRepository, ILogger<UsersService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
            _passwordHasher = new PasswordHasher();
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
    }
}

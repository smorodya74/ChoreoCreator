using ChoreoCreator.Core.Contracts;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.AspNetCore.Identity;
using PasswordVerificationResult = ChoreoCreator.Core.ValueObjects.PasswordVerificationResult;

namespace ChoreoCreator.Application.Services
{
    public class UserPasswordHasher : IUserPasswordHasher
    {
        private readonly PasswordHasher<UserPassword> _passwordHasher;

        public UserPasswordHasher()
        {
            _passwordHasher = new PasswordHasher<UserPassword>();
        }

        public HashUserPassword HashPassword(UserPassword password)
        {
            var hashedPassword = _passwordHasher.HashPassword(password, password.Value);
            return new HashUserPassword(hashedPassword);
        }

        public PasswordVerificationResult VerifyHashedPassword(HashUserPassword hashedPassword, UserPassword providedPassword)
        {
            // Используем наш собственный тип результата
            var verificationResult = _passwordHasher.VerifyHashedPassword(
                null, 
                hashedPassword.Value, 
                providedPassword.Value);

            // Преобразуем результат из Identity в наш собственный тип
            return verificationResult == Microsoft.AspNetCore.Identity.PasswordVerificationResult.Success
                ? PasswordVerificationResult.Success
                : PasswordVerificationResult.Failed;
        }
    }
}

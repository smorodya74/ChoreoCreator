using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Contracts
{
    public interface IUserPasswordHasher
    {
        HashUserPassword HashPassword(UserPassword password);
        PasswordVerificationResult VerifyHashedPassword(HashUserPassword hashedPassword, UserPassword providedPassword);
    }
}
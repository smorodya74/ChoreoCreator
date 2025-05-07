using ChoreoCreator.Core.Contracts;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Services;

/// <summary>
/// Служба предметной области, TODO: удалить комент после понимания
/// </summary>
public class UserRegistrationService
{
    private readonly IUserPasswordHasher _passwordHasher;
    private readonly IUserCollection _userCollection;

    public UserRegistrationService(IUserPasswordHasher passwordHasher, IUserCollection userCollection)
    {
        this._passwordHasher = passwordHasher;
        this._userCollection = userCollection;
    }

    public async Task<Result<User, string>> Register(UserEmail userEmail, UserPassword password, CancellationToken ct)
    {
        if (await this._userCollection.UserExistBy(userEmail, ct))
        {
            return "Пользователь с такой почтой уже существует";
        }

        var hashedPassword = this._passwordHasher.HashPassword(password);

        return User.Create(userEmail, hashedPassword);
    }

}
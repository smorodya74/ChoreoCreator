using ChoreoCreator.Core.Contracts;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Services;

public class UserRegistrationService
{
    private readonly IUserPasswordHasher _passwordHasher;
    private readonly IUserCollection _userCollection;

    public UserRegistrationService(IUserPasswordHasher passwordHasher, IUserCollection userCollection)
    {
        this._passwordHasher = passwordHasher;
        this._userCollection = userCollection;
    }

    public async Task<Result<User, string>> Register(UserEmail userEmail, Username username, UserPassword password, CancellationToken ct)
    {
        if (!Username.CanCreate(username.Value))
            return "Некорректный username: запрещены специальные символы и пустая строка";

        if (await _userCollection.UserExistBy(userEmail, ct))
        {
            return "Пользователь с такой почтой уже существует";
        }

        var hashedPassword = _passwordHasher.HashPassword(password);

        var user = User.Create(userEmail, username, hashedPassword);

        return user;
    }

}
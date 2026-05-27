using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.Services;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace ChoreoCreator.Tests;

public class UsersServiceTests
{
    private static User CreateUser(string email = "user@example.com", string username = "user_1", string hash = "hash")
    {
        return User.Create(UserEmail.From(email), Username.From(username), HashUserPassword.From(hash));
    }

    [Fact]
    public async Task GetByEmail_ReturnsUser()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser();
        await usersRepository.Create(user);
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.GetByEmail(user.Email.Value);

        Assert.NotNull(result);
        Assert.Equal(user.Email.Value, result!.Email.Value);
    }

    [Fact]
    public async Task ValidateCredentials_ReturnsNull_WhenUserNotFound()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.ValidateCredentials("unknown@example.com", "Password1!");

        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentials_ReturnsNull_WhenCredentialsEmpty()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.ValidateCredentials("", "");

        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentials_ReturnsNull_WhenPasswordInvalid()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser();
        await usersRepository.Create(user);
        var passwordHasher = new StubPasswordHasher { VerifyResult = PasswordVerificationResult.Failed };
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(passwordHasher, new StubUserCollection()),
            passwordHasher);

        var result = await service.ValidateCredentials(user.Email.Value, "Password1!");

        Assert.Null(result);
    }

    [Fact]
    public async Task ValidateCredentials_ReturnsUser_WhenPasswordValid()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser();
        await usersRepository.Create(user);
        var passwordHasher = new StubPasswordHasher { VerifyResult = PasswordVerificationResult.Success };
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(passwordHasher, new StubUserCollection()),
            passwordHasher);

        var result = await service.ValidateCredentials(user.Email.Value, "Password1!");

        Assert.NotNull(result);
        Assert.Equal(user.Id.Value, result!.Id.Value);
    }

    [Fact]
    public async Task ValidateCredentials_ReturnsUser_WhenEmailHasDifferentCase()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser("admin1@mail.ru");
        await usersRepository.Create(user);
        var passwordHasher = new StubPasswordHasher { VerifyResult = PasswordVerificationResult.Success };
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(passwordHasher, new StubUserCollection()),
            passwordHasher);

        var result = await service.ValidateCredentials("Admin1@mail.ru", "Password1!");

        Assert.NotNull(result);
        Assert.Equal(user.Id.Value, result!.Id.Value);
    }

    [Fact]
    public async Task RegisterUser_ReturnsError_WhenEmailInvalid()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.RegisterUser("bad-email", "user_1", "Password1!", CancellationToken.None);

        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task RegisterUser_ReturnsError_WhenPasswordInvalid()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.RegisterUser("user@example.com", "user_1", "short", CancellationToken.None);

        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task RegisterUser_ReturnsError_WhenUsernameInvalid()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.RegisterUser("user@example.com", "??", "Password1!", CancellationToken.None);

        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task RegisterUser_ReturnsError_WhenEmailAlreadyExists()
    {
        var usersRepository = new InMemoryUsersRepository();
        var userCollection = new StubUserCollection { Exists = true };
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), userCollection),
            new StubPasswordHasher());

        var result = await service.RegisterUser("user@example.com", "user_1", "Password1!", CancellationToken.None);

        Assert.True(result.IsFailure);
    }

    [Fact]
    public async Task RegisterUser_CreatesUser_WhenDataValid()
    {
        var usersRepository = new InMemoryUsersRepository();
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.RegisterUser("user@example.com", "user_1", "Password1!", CancellationToken.None);
        var allUsers = await usersRepository.GetAll();

        Assert.True(result.IsSuccess);
        Assert.Single(allUsers);
    }

    [Fact]
    public async Task RegisterUser_StoresEmailInLowerCase()
    {
        var usersRepository = new InMemoryUsersRepository();
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.RegisterUser("Admin1@mail.ru", "admin_1", "Password1!", CancellationToken.None);
        var allUsers = await usersRepository.GetAll();

        Assert.True(result.IsSuccess);
        Assert.Equal("admin1@mail.ru", allUsers.Single().Email.Value);
    }

    [Fact]
    public async Task GetAllUsers_ReturnsRepositoryValues()
    {
        var usersRepository = new InMemoryUsersRepository();
        await usersRepository.Create(CreateUser("one@example.com", "user_1"));
        await usersRepository.Create(CreateUser("two@example.com", "user_2"));
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.GetAllUsers();

        Assert.Equal(2, result.Count);
    }

    [Fact]
    public async Task ChangeBlockStatus_ReturnsFalse_WhenUserNotFound()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.ChangeBlockStatus(Guid.NewGuid(), true);

        Assert.False(result);
    }

    [Fact]
    public async Task ChangeBlockStatus_UpdatesUser_WhenExists()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser();
        await usersRepository.Create(user);
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.ChangeBlockStatus(user.Id.Value, true);
        var updated = await usersRepository.GetById(user.Id.Value);

        Assert.True(result);
        Assert.NotNull(updated);
        Assert.True(updated!.IsBlocked);
    }

    [Fact]
    public async Task ChangePassword_ReturnsFalse_WhenUserNotFound()
    {
        var service = new UsersService(
            new InMemoryUsersRepository(),
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var result = await service.ChangePassword(Guid.NewGuid(), UserPassword.From("Password1!"), UserPassword.From("Password2@"));

        Assert.False(result);
    }

    [Fact]
    public async Task ChangePassword_ReturnsFalse_WhenCurrentPasswordInvalid()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser();
        await usersRepository.Create(user);
        var passwordHasher = new StubPasswordHasher { VerifyResult = PasswordVerificationResult.Failed };
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(passwordHasher, new StubUserCollection()),
            passwordHasher);

        var result = await service.ChangePassword(user.Id.Value, UserPassword.From("Password1!"), UserPassword.From("Password2@"));

        Assert.False(result);
    }

    [Fact]
    public async Task ChangePassword_UpdatesPassword_WhenCurrentPasswordValid()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser(hash: "old-hash");
        await usersRepository.Create(user);
        var passwordHasher = new StubPasswordHasher
        {
            VerifyResult = PasswordVerificationResult.Success,
            HashResult = HashUserPassword.From("new-hash")
        };
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(passwordHasher, new StubUserCollection()),
            passwordHasher);

        var result = await service.ChangePassword(user.Id.Value, UserPassword.From("Password1!"), UserPassword.From("Password2@"));
        var updated = await usersRepository.GetById(user.Id.Value);

        Assert.True(result);
        Assert.NotNull(updated);
        Assert.Equal("new-hash", updated!.PasswordHash.Value);
    }

    [Fact]
    public async Task DeleteUser_ReturnsRepositoryResult()
    {
        var usersRepository = new InMemoryUsersRepository();
        var user = CreateUser();
        await usersRepository.Create(user);
        var service = new UsersService(
            usersRepository,
            NullLogger<UsersService>.Instance,
            new UserRegistrationService(new StubPasswordHasher(), new StubUserCollection()),
            new StubPasswordHasher());

        var deleted = await service.DeleteUser(user.Id.Value);
        var deletedMissing = await service.DeleteUser(user.Id.Value);

        Assert.True(deleted);
        Assert.False(deletedMissing);
    }
}

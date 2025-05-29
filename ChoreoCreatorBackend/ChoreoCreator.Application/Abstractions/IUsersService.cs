using ChoreoCreator.Core.Helpers;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Application.Abstractions;

public interface IUsersService
{
    Task<User?> GetByEmail(string email);

    Task<User?> ValidateCredentials(string email, string password);

    Task<Result<UserId, string>> RegisterUser(string email, string username, string password, CancellationToken ct);

    Task<List<User>> GetAllUsers();
    Task<bool> ChangeBlockStatus(Guid id, bool isBlocked);
    Task<bool> ChangePassword(Guid id, UserPassword currentPassword, UserPassword newPassword);
    Task<bool> DeleteUser(Guid id);
}

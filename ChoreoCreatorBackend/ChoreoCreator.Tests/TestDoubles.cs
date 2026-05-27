using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Contracts;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Tests;

internal sealed class InMemoryUsersRepository : IUsersRepository
{
    private readonly Dictionary<Guid, User> _store = new();

    public Task<Guid> Create(User user)
    {
        _store[user.Id.Value] = user;
        return Task.FromResult(user.Id.Value);
    }

    public Task<bool> Delete(Guid id)
    {
        return Task.FromResult(_store.Remove(id));
    }

    public Task<bool> ExistsByEmail(string email)
    {
        var normalizedEmail = UserEmail.Normalize(email);
        return Task.FromResult(_store.Values.Any(x => x.Email.Value == normalizedEmail));
    }

    public Task<List<User>> GetAll()
    {
        return Task.FromResult(_store.Values.ToList());
    }

    public Task<User?> GetByEmail(string email)
    {
        var normalizedEmail = UserEmail.Normalize(email);
        var user = _store.Values.FirstOrDefault(x => x.Email.Value == normalizedEmail);
        return Task.FromResult(user);
    }

    public Task<User?> GetById(Guid id)
    {
        _store.TryGetValue(id, out var user);
        return Task.FromResult(user);
    }

    public Task Update(User user)
    {
        _store[user.Id.Value] = user;
        return Task.CompletedTask;
    }
}

internal sealed class InMemoryScenariosRepository : IScenariosRepository
{
    private readonly Dictionary<Guid, Scenario> _store = new();

    public Scenario? LastSaved { get; private set; }

    public Task<List<Scenario>> GetAllAsync()
    {
        return Task.FromResult(_store.Values.ToList());
    }

    public Task<Scenario?> GetByIdAsync(Guid id)
    {
        _store.TryGetValue(id, out var scenario);
        return Task.FromResult(scenario);
    }

    public Task<Scenario?> GetByUserIdAsync(Guid userId)
    {
        var scenario = _store.Values.FirstOrDefault(x => x.UserId == userId);
        return Task.FromResult(scenario);
    }

    public Task SaveAsync(Scenario scenario)
    {
        _store[scenario.Id] = scenario;
        LastSaved = scenario;
        return Task.CompletedTask;
    }

    public Task<bool> DeleteAsync(Guid id)
    {
        return Task.FromResult(_store.Remove(id));
    }
}

internal sealed class StubPasswordHasher : IUserPasswordHasher
{
    public HashUserPassword HashResult { get; set; } = HashUserPassword.From("hash");
    public PasswordVerificationResult VerifyResult { get; set; } = PasswordVerificationResult.Success;

    public HashUserPassword HashPassword(UserPassword password)
    {
        return HashResult;
    }

    public PasswordVerificationResult VerifyHashedPassword(HashUserPassword hashedPassword, UserPassword providedPassword)
    {
        return VerifyResult;
    }
}

internal sealed class StubUserCollection : IUserCollection
{
    public bool Exists { get; set; }

    public Task<bool> UserExistBy(UserEmail userEmail, CancellationToken ct)
    {
        return Task.FromResult(Exists);
    }
}

using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Contracts;

/// <summary>
/// Имплементация на уровне инфраструктуры или application
/// </summary>
public interface IUserCollection
{
    Task<bool> UserExistBy(UserEmail userEmail, CancellationToken ct);
}
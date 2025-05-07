using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Contracts;

/// <summary>
/// Имплементация на уровне Application или инфраструктуры
/// </summary>
public interface IUserPasswordHasher
{
    HashUserPassword HashPassword(UserPassword password);
}
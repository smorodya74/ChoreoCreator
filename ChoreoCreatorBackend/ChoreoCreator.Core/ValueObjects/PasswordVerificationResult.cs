namespace ChoreoCreator.Core.ValueObjects;

/// <summary>
/// Результат проверки соответствия пароля и его хэша.
/// </summary>
public enum PasswordVerificationResult
{
    Failed = 0,
    Success = 1
}
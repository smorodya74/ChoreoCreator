namespace ChoreoCreator.API.Contracts.Auth;

/// <summary>
/// Данные для входа пользователя.
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// Email пользователя.
    /// </summary>
    public string Email { get; set; } = default!;

    /// <summary>
    /// Пароль пользователя.
    /// </summary>
    public string Password { get; set; } = default!;
}

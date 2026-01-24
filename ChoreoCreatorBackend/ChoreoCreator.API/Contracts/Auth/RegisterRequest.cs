namespace ChoreoCreator.API.Contracts.Auth;

/// <summary>
/// Данные для регистрации пользователя.
/// </summary>
public class RegisterRequest
{
    /// <summary>
    /// Email пользователя.
    /// </summary>
    public string Email { get; set; } = default!;

    /// <summary>
    /// Имя пользователя.
    /// </summary>
    public string Username { get; set; } = default!;

    /// <summary>
    /// Пароль пользователя.
    /// </summary>
    public string Password { get; set; } = default!;
}

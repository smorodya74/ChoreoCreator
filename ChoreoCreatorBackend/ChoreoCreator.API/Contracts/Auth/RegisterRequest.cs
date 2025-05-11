namespace ChoreoCreator.API.Contracts.Auth;

public class RegisterRequest
{
    public string Email { get; set; } = null!;
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}
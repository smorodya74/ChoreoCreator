namespace ChoreoCreator.API.Contracts.DTOs
{
    public class UserResponse
    {
        public Guid Id { get; set; }

        public string Username { get; set; } = default!;

        public string Email { get; set; } = default!;

        public string Role { get; set; } = default!;

        public bool IsBlocked { get; set; }
    }
}

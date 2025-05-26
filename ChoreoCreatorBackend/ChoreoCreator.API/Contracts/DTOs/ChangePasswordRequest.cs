namespace ChoreoCreator.API.Contracts.DTOs
{
    public class ChangePasswordRequest
    {
        public Guid UserId { get; set; }

        public string CurrentPassword { get; set; } = default!;

        public string NewPassword { get; set; } = default!;
    }
}
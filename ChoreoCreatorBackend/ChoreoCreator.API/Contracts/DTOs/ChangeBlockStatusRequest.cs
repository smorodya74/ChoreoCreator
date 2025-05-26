namespace ChoreoCreator.API.Contracts.DTOs
{
    public class ChangeBlockStatusRequest
    {
        public Guid UserId { get; set; }
        public bool IsBlocked { get; set; }
    }
}

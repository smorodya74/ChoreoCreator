namespace ChoreoCreator.DataAccess.Entities
{
    public class UserEntity
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
        public string Role { get; set; } = "User";

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<ScenarioEntity> Scenarios { get; set; } = new List<ScenarioEntity>();
    }
}

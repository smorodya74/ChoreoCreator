namespace ChoreoCreator.DataAccess.Entities
{
    public class UserEntity
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;

        public ICollection<ScenarioEntity> Scenarios { get; set; } = new List<ScenarioEntity>();
    }
}

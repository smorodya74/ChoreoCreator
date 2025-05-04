namespace ChoreoCreator.DataAccess.Entities
{
    public class ScenarioEntity
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int DancerCount { get; set; }

        public Guid UserId { get; set; }
        public UserEntity? User { get; set; } 


        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<FormationEntity> Formations { get; set; } = new List<FormationEntity>();
    }
}

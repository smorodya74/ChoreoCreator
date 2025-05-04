namespace ChoreoCreator.DataAccess.Entities
{
    public class ScenarioEntity
    {
        public Guid Id { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public int DancerCount { get; set; }

        public Guid UserId { get; set; }
        public UserEntity User { get; set; }


        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public ICollection<FormationEntity> Formations { get; set; } = new List<FormationEntity>();
        public ICollection<MarkerEntity> Markers { get; set; } = new List<MarkerEntity>();
    }
}

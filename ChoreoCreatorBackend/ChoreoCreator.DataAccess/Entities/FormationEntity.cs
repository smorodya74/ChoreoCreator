namespace ChoreoCreator.DataAccess.Entities
{
    public class FormationEntity
    {
        public Guid Id { get; set; }

        public Guid ScenarioId { get; set; }

        public ScenarioEntity? Scenario { get; set; }

        public int Order { get; set; }

        public ICollection<DancerPositionEntity> DancerPositions { get; set; } = new List<DancerPositionEntity>();
    }
}

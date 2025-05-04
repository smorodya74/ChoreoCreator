namespace ChoreoCreator.DataAccess.Entities
{
    public class MarkerEntity
    {
        public Guid Id { get; set; }

        public float TimeInSeconds { get; set; }

        public Guid ScenarioId { get; set; }
        public ScenarioEntity Scenario { get; set; } = default!;

        public Guid FormationId { get; set; }
        public FormationEntity Formation { get; set; } = default!;
    }
}

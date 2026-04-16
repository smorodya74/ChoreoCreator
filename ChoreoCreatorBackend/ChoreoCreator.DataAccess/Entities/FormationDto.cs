namespace ChoreoCreator.DataAccess.Entities
{
    public class FormationDto
    {
        public Guid Id { get; set; }
        public int NumberInScenario { get; set; }
        public int StartTimeMs { get; set; }
        public int DurationMs { get; set; }
        public int AnimationDurationMs { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsAutoName { get; set; } = true;

        public List<DancerPositionDto> DancerPositions { get; set; } = [];
    }
}

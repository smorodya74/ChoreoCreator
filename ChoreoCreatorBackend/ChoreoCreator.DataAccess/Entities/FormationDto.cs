namespace ChoreoCreator.DataAccess.Entities
{
    public class FormationDto
    {
        public Guid Id { get; set; }
        public int NumberInScenario { get; set; }

        public List<DancerPositionDto> DancerPositions { get; set; } = new();
    }
}
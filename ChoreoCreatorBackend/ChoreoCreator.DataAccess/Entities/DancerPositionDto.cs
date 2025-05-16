namespace ChoreoCreator.DataAccess.Entities
{
    public class DancerPositionDto
    {
        public int NumberInFormation { get; set; }
        public PositionDto Position { get; set; } = null!;
    }
}
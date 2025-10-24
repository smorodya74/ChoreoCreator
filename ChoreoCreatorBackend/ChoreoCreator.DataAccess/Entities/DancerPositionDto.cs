namespace ChoreoCreator.DataAccess.Entities
{
    public class DancerPositionDto
    {
        public Guid Id { get; set; }
        public int NumberInFormation { get; set; }
        public string DancerColor { get; set; } = "#ff00ee";
        public PositionDto Position { get; set; } = null!;
    }
}
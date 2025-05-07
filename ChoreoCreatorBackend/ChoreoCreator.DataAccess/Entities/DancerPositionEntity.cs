namespace ChoreoCreator.DataAccess.Entities
{
    public class DancerPositionEntity
    {
        public Guid Id { get; set; }

        public Guid FormationId { get; set; }
        public FormationEntity? Formation { get; set; }

        public int DancerNumber { get; set; }
        public float X { get; set; }
        public float Y { get; set; }
    }
}

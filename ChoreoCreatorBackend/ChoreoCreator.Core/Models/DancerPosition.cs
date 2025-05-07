namespace ChoreoCreator.Core.Models
{
    public class DancerPosition
    {
        public DancerPosition(Guid id, Guid formationId, int dancerNumber, float x, float y)
        {
            Id = id;
            FormationId = formationId;
            DancerNumber = dancerNumber;
            X = x;
            Y = y;
        }

        public Guid Id { get; }
        public Guid FormationId { get; }

        public int DancerNumber { get; private set; }

        public float X { get; private set; }
        public float Y { get; private set; }

        public static (DancerPosition DancerPosition, string Error) Create(Guid id, Guid formationId, int dancerNumber, float x, float y)
        {
            if (dancerNumber < 1 || dancerNumber > 16)
                return (null!, "Номер танцора должен быть от 1 до 16");

            var position = new DancerPosition(id, formationId, dancerNumber, x, y);
            return (position, string.Empty);
        }

        public void UpdatePosition(float x, float y)
        {
            X = x;
            Y = y;
        }

        public void RenameDancer(int newNumber)
        {
            if (newNumber < 1 || newNumber > 16)
                throw new ArgumentException("Номер танцора должен быть от 1 до 16", nameof(newNumber));

            DancerNumber = newNumber;
        }
    }
}

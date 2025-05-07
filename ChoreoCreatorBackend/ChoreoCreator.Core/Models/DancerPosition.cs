namespace ChoreoCreator.Core.Models
{
    public class DancerPosition
    {
        public DancerPosition(int dancerNumber, float x, float y)
        {
            if (dancerNumber < 1 || dancerNumber > 16)
                throw new ArgumentOutOfRangeException(nameof(dancerNumber), "Номер танцора должен быть от 1 до 16");

            DancerNumber = dancerNumber;
            X = x;
            Y = y;
        }

        public int DancerNumber { get; }
        public float X { get; private set; }
        public float Y { get; private set; }

        public void SetPosition(float x, float y)
        {
            X = x;
            Y = y;
        }
    }
}

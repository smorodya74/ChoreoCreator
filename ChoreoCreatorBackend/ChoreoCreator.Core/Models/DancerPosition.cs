namespace ChoreoCreator.Core.Models
{
    public class DancerPosition
    {
        public int DancerNumber { get; }  // от 1 до 16
        public float X { get; }           // координата на сцене
        public float Y { get; }           // координата на сцене

        public DancerPosition(int dancerNumber, float x, float y)
        {
            if (dancerNumber < 1 || dancerNumber > 16)
                throw new ArgumentOutOfRangeException(nameof(dancerNumber), "Dancer number must be between 1 and 16.");

            DancerNumber = dancerNumber;
            X = x;
            Y = y;
        }
    }
}

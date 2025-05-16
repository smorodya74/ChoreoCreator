using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Models;

public class DancerPosition
{
    public DancerPosition(int numberInFormation, Position position)
    {
        NumberInFormation = numberInFormation;
        Position = position;
    }

    public int NumberInFormation { get; }
    public Position Position { get; }
}

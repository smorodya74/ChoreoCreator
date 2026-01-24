using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Models;

public class DancerPosition
{
    public DancerPosition(Guid id, int numberInFormation, Position position)
    {
        Id = id;
        NumberInFormation = numberInFormation;
        Position = position;
    }
    public Guid Id { get; }
    public int NumberInFormation { get; }
    public Position Position { get; }
}

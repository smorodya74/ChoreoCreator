using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Models;

public class DancerPosition
{
    public DancerPosition(Guid id, int numberInFormation, string dancerColor, Position position)
    {
        Id = id;
        NumberInFormation = numberInFormation;
        DancerColor = dancerColor;
        Position = position;
    }
    public Guid Id { get; }
    public int NumberInFormation { get; }
    public string DancerColor { get; }
    public Position Position { get; }
}

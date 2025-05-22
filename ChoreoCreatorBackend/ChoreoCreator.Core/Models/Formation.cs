namespace ChoreoCreator.Core.Models;

public class Formation
{
    public Formation(Guid id, int numberInScenario)
    {
        Id = id;
        NumberInScenario = numberInScenario;
    }

    public Guid Id { get; private set; }
    public int NumberInScenario { get; private set; }

    private readonly List<DancerPosition> _dancerPositions = [];
    public IReadOnlyCollection<DancerPosition> DancerPositions => _dancerPositions;

    public void AddDancerPosition(DancerPosition dancerPosition)
    {
        _dancerPositions.Add(dancerPosition ?? throw new ArgumentNullException(nameof(dancerPosition)));
    }
}

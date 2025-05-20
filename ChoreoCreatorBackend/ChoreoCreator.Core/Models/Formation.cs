using ChoreoCreator.Core.ValueObjects;

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

    private readonly List<DancerPosition> _dancerPositions = new();
    public IReadOnlyCollection<DancerPosition> DancerPositions => _dancerPositions;

    public void AddDancerPosition(DancerPosition dancerPosition)
    {
        _dancerPositions.Add(dancerPosition ?? throw new ArgumentNullException(nameof(dancerPosition)));
    }

    public void RemoveDancerPosition(int numberInFormation)
    {
        var target = _dancerPositions.FirstOrDefault(dp => dp.NumberInFormation == numberInFormation);
        if (target != null)
            _dancerPositions.Remove(target);
    }

    public void UpdateDancerPosition(int numberInFormation, Position newPosition)
    {
        var index = _dancerPositions.FindIndex(dp => dp.NumberInFormation == numberInFormation);
        if (index == -1)
            throw new ArgumentException("Танцор не найден");

        _dancerPositions[index] = new DancerPosition(numberInFormation, newPosition);
    }
}

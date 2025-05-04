namespace ChoreoCreator.Core.Models
{
    public class Formation
    {
        public Guid Id { get; }
        public Guid ScenarioId { get; }

        private readonly List<DancerPosition> _dancerPositions = new();

        public IReadOnlyCollection<DancerPosition> DancerPositions => _dancerPositions.AsReadOnly();

        public Formation(Guid id, Guid scenarioId, IEnumerable<DancerPosition> dancerPositions)
        {
            if (dancerPositions == null || !dancerPositions.Any())
                throw new ArgumentException("Formation must include at least one dancer position.");

            Id = id;
            ScenarioId = scenarioId;
            _dancerPositions = new List<DancerPosition>(dancerPositions);
        }

        public void AddDancerPosition(DancerPosition position)
        {
            if (position == null) throw new ArgumentNullException(nameof(position));
            _dancerPositions.Add(position);
        }

        public void RemoveDancerByNumber(int dancerNumber)
        {
            var existing = _dancerPositions.FirstOrDefault(p => p.DancerNumber == dancerNumber);
            if (existing != null)
                _dancerPositions.Remove(existing);
        }
    }
}

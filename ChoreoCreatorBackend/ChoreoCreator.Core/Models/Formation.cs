namespace ChoreoCreator.Core.Models
{
    public class Formation
    {
        public Formation(Guid id, Guid scenarioId, int numberOnScenario)
        {
            Id = id;
            ScenarioId = scenarioId;
            NumberOnScenario = numberOnScenario;
        }

        public Guid Id { get; }
        public Guid ScenarioId { get; }
        public int NumberOnScenario { get; private set; }

        private readonly List<DancerPosition> _dancerPositions = [];

        public IReadOnlyCollection<DancerPosition> DancerPositions => _dancerPositions.AsReadOnly();

        public static (Formation Formation, string Error) Create(Guid id, Guid scenarioId, int numberOnScenario)
        {
            if (numberOnScenario < 1 || numberOnScenario > 16)
                return (null!, "Порядковый номер слайда не может быть меньше 1");

            var formation = new Formation(id, scenarioId, numberOnScenario);

            return (formation, string.Empty);
        }


        public void AddDancerPosition(DancerPosition position)
        {
            if (position == null)
                throw new ArgumentNullException(nameof(position));

            _dancerPositions.Add(position);
        }

        public void RemoveDancerByNumber(int dancerNumber)
        {
            var position = _dancerPositions.FirstOrDefault(p => p.DancerNumber == dancerNumber);

            if (position != null)
                _dancerPositions.Remove(position);
        }

        public void UpdateDancerPosition(int dancerNumber, float x, float y)
        {
            var position = _dancerPositions.FirstOrDefault(p => p.DancerNumber == dancerNumber);

            position?.UpdatePosition(x, y);
        }
    }
}

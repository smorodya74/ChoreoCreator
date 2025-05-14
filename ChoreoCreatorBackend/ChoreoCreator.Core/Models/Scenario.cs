namespace ChoreoCreator.Core.Models
{
    public class Scenario
    {
        public const int MAX_TITLE_LENGTH = 100;
        public const int MAX_DESCRIPTION_LENGTH = 250;

        public Scenario(Guid id, string title, string description, int dancerCount, Guid userId)
        {
            Id = id;
            Title = title;
            Description = description;
            DancerCount = dancerCount;
            UserId = userId;
        }

        public Guid Id { get; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int DancerCount { get; }
        public Guid UserId { get; }

        private readonly List<Formation> _formations = new();
        public IReadOnlyCollection<Formation> Formations => _formations.AsReadOnly();
                

        public static (Scenario Scenario, string Error) Create(Guid id, string title, string description, int dancerCount, Guid userId)
        {
            var error = string.Empty;

            if (string.IsNullOrEmpty(title) || title.Length > MAX_TITLE_LENGTH)
                return (null!, "Название не может быть пустым или длиннее 100 символов");
            
            if (description.Length > MAX_DESCRIPTION_LENGTH)
                return (null!, "Описание не может быть длиннее 250 символов");

            if (dancerCount < 1 || dancerCount > 16)
                return (null!, "Количество танцоров должно быть от 1 до 16");

            var scenario = new Scenario(id, title, description, dancerCount, userId);

            return (scenario, error);
        }

        public void Rename(string newTitle)
        {
            if (string.IsNullOrWhiteSpace(newTitle) || newTitle.Length > MAX_TITLE_LENGTH)
                throw new ArgumentException("Название не может быть пустым или длиннее 100 символов");

            Title = newTitle;
        }

        public void UpdateDescription(string newDescription)
        {
            if (newDescription != null && newDescription.Length > MAX_DESCRIPTION_LENGTH)
                throw new ArgumentException("Описание не может быть длиннее 250 символов");

            Description = newDescription ?? string.Empty;
        }

        public void AddFormation(Formation formation)
        {
            if (formation == null) throw new ArgumentNullException(nameof(formation));
            _formations.Add(formation);
        }

        public void RemoveFormation(Guid formationId)
        {
            var formation = _formations.FirstOrDefault(f => f.Id == formationId);
            if (formation != null)
            {
                _formations.Remove(formation);
            }
        }

        public byte[] ExportToPdf()
        {
            throw new NotImplementedException("Реализация в Application слое");
        }


    }
}

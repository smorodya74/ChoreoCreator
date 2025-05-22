namespace ChoreoCreator.Core.Models
{
    public class Scenario
    {
        public const int MAX_TITLE_LENGTH = 64;
        public const int MAX_DESCRIPTION_LENGTH = 128;

        public Scenario(
            Guid id,
            string title,
            string description,
            int dancerCount,
            Guid userId,
            bool isPublished,
            IEnumerable<Formation>? formations = null)
        {
            Id = id;
            Title = title;
            Description = description;
            DancerCount = dancerCount;
            UserId = userId;
            IsPublished = isPublished;

            if (formations != null)
            {
                _formations.AddRange(formations);
            }
        }

        public Guid Id { get; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int DancerCount { get; private set; }
        public Guid UserId { get; }
        public bool IsPublished { get; private set; }

        private readonly List<Formation> _formations = [];
        public IReadOnlyCollection<Formation> Formations => _formations;


        public static (Scenario Scenario, string Error) Create(
            Guid id,
            string title,
            string description,
            int dancerCount,
            Guid userId)
        {
            var error = string.Empty;

            if (string.IsNullOrWhiteSpace(title) || title.Length > MAX_TITLE_LENGTH)
                throw new ArgumentException($"Название не может быть пустым или длиннее {MAX_TITLE_LENGTH} символов");

            if (description.Length > MAX_DESCRIPTION_LENGTH)
                throw new ArgumentException($"Описание не может быть длиннее {MAX_DESCRIPTION_LENGTH} символов");

            if (dancerCount < 1 || dancerCount > 16)
                throw new ArgumentException("Количество танцоров должно быть от 1 до 16");

            var scenario = new Scenario(id, title, description, dancerCount, userId, false);
            return (scenario, error);
        }

        public void Publish() => 
            IsPublished = true;

        public void UpdateTitle(string newTitle)
        {
            if (string.IsNullOrWhiteSpace(newTitle) || newTitle.Length > MAX_TITLE_LENGTH)
                throw new ArgumentException($"Название не может быть пустым или длиннее {MAX_TITLE_LENGTH} символов");

            Title = newTitle;
        }

        public void UpdateDescription(string newDescription)
        {
            if (newDescription.Length > MAX_DESCRIPTION_LENGTH)
                throw new ArgumentException($"Описание не может быть длиннее {MAX_DESCRIPTION_LENGTH} символов");

            Description = newDescription ?? string.Empty;
        }

        public void UpdateDancerCount(int count)
        {
            DancerCount = count;
        }

        public void AddFormation(Formation formation)
        {
            ArgumentNullException.ThrowIfNull(formation);

            _formations.Add(formation);
        }

        public byte[] ExportToPdf()
        {
            throw new NotImplementedException("Реализация в Application слое");
        }
    }
}

using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace ChoreoCreator.Core.Models
{
    public class Scenario
    {
        public const int MAX_TITLE_LENGTH = 100;
        public const int MAX_DESCRIPTION_LENGTH = 250;

        public Scenario(Guid id, string title, string description, int dancerCount, Guid userId, DateTime createdAt, DateTime updatedAt)
        {
            // ВАЛИДАЦИЮ НА TITLE, DancerCount (1-16)

            Id = id;
            Title = title;
            Description = description;
            DancerCount = dancerCount;
            UserId = userId;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = CreatedAt;
        }

        public Guid Id { get; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int DancerCount { get; }
        public Guid UserId { get; }
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; private set; }

        private readonly List<Formation> _formations = new();
        public IReadOnlyCollection<Formation> Formations => _formations.AsReadOnly();
                

        public static (Scenario Scenario, string Error) Create(Guid id, string title, string description, int dancerCount, Guid userId, DateTime createdAt, DateTime updatedAt)
        {
            var error = string.Empty;

            if (string.IsNullOrEmpty(title) || title.Length > MAX_TITLE_LENGTH)
            {
                error = "Title can not be empty or be longer 100 symbols";
            }

            var scenario = new Scenario(id, title, description, dancerCount, userId, createdAt, updatedAt);

            return (scenario, error);
        }

        private void Touch()
        {
            UpdatedAt = DateTime.UtcNow;
        }

        public void Rename(string newTitle)
        {
            // Валидация на title

            Title = newTitle;
            Touch();
        }

        public void UpdateDescription(string newDescription)
        {
            Description = newDescription ?? string.Empty;
            Touch();
        }

        public void AddFormation(Formation formation)
        {
            if (formation == null) throw new ArgumentNullException(nameof(formation));
            _formations.Add(formation);
            Touch();
        }

        public void RemoveFormation(Guid formationId)
        {
            var formation = _formations.FirstOrDefault(f => f.Id == formationId);
            if (formation != null)
            {
                _formations.Remove(formation);
                Touch();
            }
        }


        public byte[] ExportToPdf()
        {
            // Это будет реализовано в Application/Infrastructure слоях
            // Здесь просто сигнатура
            throw new NotImplementedException("PDF export is implemented in application layer.");
        }
    }
}

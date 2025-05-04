using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

namespace ChoreoCreator.Core.Models
{
    public class Scenario
    {
        public Guid Id { get; }
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int DancerCount { get; }
        public Guid UserId { get; }
        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; private set; }

        private readonly List<Formation> _formations = new();
        private readonly List<Marker> _markers = new();

        public IReadOnlyCollection<Formation> Formations => _formations.AsReadOnly();
        public IReadOnlyCollection<Marker> Markers => _markers.AsReadOnly();

        public Scenario(Guid id, string title, string description, int dancerCount, Guid userId)
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

        public void AddMarker(Marker marker)
        {
            if (marker == null) throw new ArgumentNullException(nameof(marker));
            _markers.Add(marker);
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

        public void RemoveMarker(Guid markerId)
        {
            var marker = _markers.FirstOrDefault(m => m.Id == markerId);
            if (marker != null)
            {
                _markers.Remove(marker);
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChoreoCreator.Core.Models
{
    internal class Marker
    {
        public Guid Id { get; }
        public Guid ScenarioId { get; }
        public Guid FormationId { get; }
        public float TimeInSeconds { get; }

        public Marker(Guid id, Guid scenarioId, Guid formationId, float timeInSeconds)
        {
            if (timeInSeconds < 0)
                throw new ArgumentOutOfRangeException(nameof(timeInSeconds), "Time must be non-negative.");

            Id = id;
            ScenarioId = scenarioId;
            FormationId = formationId;
            TimeInSeconds = timeInSeconds;
        }
    }
}

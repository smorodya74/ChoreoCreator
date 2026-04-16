using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;
using ChoreoCreator.DataAccess.Entities;
using DancerPosition = ChoreoCreator.Core.Models.DancerPosition;
using Formation = ChoreoCreator.Core.Models.Formation;

namespace ChoreoCreator.DataAccess.Mapping
{
    public static class ScenarioMapper
    {
        public static ScenarioEntity ToEntity(this Scenario domain)
        {
            return new ScenarioEntity
            {
                Id = domain.Id,
                Title = domain.Title,
                Description = domain.Description,
                DancerCount = domain.DancerCount,
                IsPublished = domain.IsPublished,
                UserId = domain.UserId,
                TotalDurationMs = domain.TotalDurationMs,
                Formations = domain.Formations.Select(f => new FormationDto
                {
                    Id = f.Id,
                    NumberInScenario = f.NumberInScenario,
                    StartTimeMs = f.StartTimeMs,
                    DurationMs = f.DurationMs,
                    AnimationDurationMs = f.AnimationDurationMs,
                    Name = f.Name,
                    Description = f.Description,
                    IsAutoName = f.IsAutoName,
                    DancerPositions = f.DancerPositions.Select(d => new DancerPositionDto
                    {
                        Id = d.Id,
                        NumberInFormation = d.NumberInFormation,
                        Position = new PositionDto
                        {
                            X = d.Position.X,
                            Y = d.Position.Y
                        }
                    }).ToList()
                }).ToList()
            };
        }

        public static Scenario ToDomain(this ScenarioEntity entity)
        {
            var scenario = new Scenario(
                entity.Id,
                entity.Title,
                entity.Description,
                entity.DancerCount,
                entity.UserId,
                entity.IsPublished,
                entity.TotalDurationMs);

            var sortedFormations = entity.Formations.OrderBy(f => f.NumberInScenario).ToList();
            var cursorMs = 0;

            foreach (var f in sortedFormations)
            {
                var durationMs = f.DurationMs <= 0 ? 10_000 : f.DurationMs;
                var startTimeMs = f.StartTimeMs < 0 ? cursorMs : f.StartTimeMs;
                if (startTimeMs < cursorMs)
                {
                    startTimeMs = cursorMs;
                }

                var defaultName = $"Formation-{f.NumberInScenario}";
                var isFirst = f.NumberInScenario == 1;
                var formation = new Formation(
                    f.Id,
                    f.NumberInScenario,
                    startTimeMs,
                    durationMs,
                    isFirst ? 0 : (f.AnimationDurationMs <= 0 ? Math.Min(5_000, durationMs) : f.AnimationDurationMs),
                    string.IsNullOrWhiteSpace(f.Name) ? defaultName : f.Name,
                    f.Description ?? string.Empty,
                    f.IsAutoName);

                foreach (var d in f.DancerPositions)
                {
                    var pos = new Position(d.Position.X, d.Position.Y);
                    var dancerPosition = new DancerPosition(d.Id, d.NumberInFormation, pos);
                    formation.AddDancerPosition(dancerPosition);
                }

                scenario.AddFormation(formation);
                cursorMs = formation.StartTimeMs + formation.DurationMs;
            }

            if (cursorMs > scenario.TotalDurationMs)
            {
                scenario.UpdateTotalDuration(cursorMs);
            }

            return scenario;
        }
    }
}

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
                Formations = domain.Formations.Select(f => new FormationDto
                {
                    Id = f.Id,
                    NumberInScenario = f.NumberInScenario,
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
                entity.IsPublished);

            foreach (var f in entity.Formations)
            {
                var formation = new Formation(f.Id, f.NumberInScenario);

                foreach (var d in f.DancerPositions)
                {
                    var pos = new Position(d.Position.X, d.Position.Y);
                    var dancerPosition = new DancerPosition(d.Id, d.NumberInFormation, pos);
                    formation.AddDancerPosition(dancerPosition);
                }

                scenario.AddFormation(formation);
            }

            return scenario;
        }
    }
}

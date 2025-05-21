using ChoreoCreator.API.Contracts.DTOs;
using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Models;

namespace ChoreoCreator.API.Mappers;

public static class ScenarioMapper
{
    public static async Task<ScenarioResponse> ToResponseAsync(Scenario s, IUsersRepository userRepository)
    {
        var user = await userRepository.GetById(s.UserId);
        var username = user?.Username.ToString();

        return new ScenarioResponse(
            s.Id,
            s.Title,
            s.Description,
            s.DancerCount,
            s.IsPublished,
            username,
            s.Formations.Select(f => new FormationResponse(
                f.Id,
                f.NumberInScenario,
                f.DancerPositions.Select(d => new DancerPositionResponse(
                    d.NumberInFormation,
                    new PositionResponse(d.Position.X, d.Position.Y)
                )).ToList()
            )).ToList()
        );
    }
}

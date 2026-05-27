using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;
using Xunit;

namespace ChoreoCreator.Tests;

public class ScenariosServicesTests
{
    private static Formation CreateFormation(int number, int startMs, int durationMs)
    {
        var formation = new Formation(Guid.NewGuid(), number, startMs, durationMs, Math.Min(5_000, durationMs), $"Formation-{number}", "");
        formation.AddDancerPosition(new DancerPosition(Guid.NewGuid(), 1, new Position(0, 0)));
        return formation;
    }

    private static Scenario CreateScenario(Guid? id = null, Guid? userId = null, bool isPublished = false)
    {
        return new Scenario(
            id ?? Guid.NewGuid(),
            "Title",
            "Description",
            4,
            userId ?? Guid.NewGuid(),
            isPublished,
            20_000,
            new[] { CreateFormation(1, 0, 10_000) });
    }

    [Fact]
    public async Task GetMethods_ReturnRepositoryData()
    {
        var repository = new InMemoryScenariosRepository();
        var scenario = CreateScenario();
        await repository.SaveAsync(scenario);
        var service = new ScenariosServices(repository);

        var all = await service.GetAllScenarios();
        var byId = await service.GetScenarioById(scenario.Id);
        var byUser = await service.GetScenarioByUserId(scenario.UserId);

        Assert.Single(all);
        Assert.NotNull(byId);
        Assert.NotNull(byUser);
    }

    [Fact]
    public async Task CreateScenario_SavesAndReturnsId()
    {
        var repository = new InMemoryScenariosRepository();
        var service = new ScenariosServices(repository);
        var scenario = CreateScenario();

        var createdId = await service.CreateScenario(scenario);

        Assert.Equal(scenario.Id, createdId);
        Assert.Equal(scenario.Id, repository.LastSaved!.Id);
    }

    [Fact]
    public async Task UpdateScenario_ReturnsFalse_WhenScenarioNotFound()
    {
        var repository = new InMemoryScenariosRepository();
        var service = new ScenariosServices(repository);

        var result = await service.UpdateScenario(CreateScenario());

        Assert.False(result);
    }

    [Fact]
    public async Task UpdateScenario_UpdatesFieldsFormationsAndPublishState()
    {
        var repository = new InMemoryScenariosRepository();
        var scenarioId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var existing = CreateScenario(scenarioId, userId, false);
        await repository.SaveAsync(existing);
        var service = new ScenariosServices(repository);

        var updated = new Scenario(
            scenarioId,
            "Updated title",
            "Updated description",
            8,
            userId,
            true,
            30_000,
            new[]
            {
                CreateFormation(1, 0, 10_000),
                CreateFormation(2, 10_000, 10_000),
            });

        var result = await service.UpdateScenario(updated);
        var saved = await repository.GetByIdAsync(scenarioId);

        Assert.True(result);
        Assert.NotNull(saved);
        Assert.Equal("Updated title", saved!.Title);
        Assert.Equal("Updated description", saved.Description);
        Assert.Equal(8, saved.DancerCount);
        Assert.Equal(30_000, saved.TotalDurationMs);
        Assert.True(saved.IsPublished);
        Assert.Equal(2, saved.Formations.Count);
    }

    [Fact]
    public async Task DeleteScenario_ReturnsRepositoryResult()
    {
        var repository = new InMemoryScenariosRepository();
        var scenario = CreateScenario();
        await repository.SaveAsync(scenario);
        var service = new ScenariosServices(repository);

        var deleted = await service.DeleteScenario(scenario.Id);
        var deletedMissing = await service.DeleteScenario(scenario.Id);

        Assert.True(deleted);
        Assert.False(deletedMissing);
    }
}

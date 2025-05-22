using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Services
{
    public class ScenariosServices : IScenariosServices
    {
        private readonly IScenariosRepository _scenariosRepository;

        public ScenariosServices(IScenariosRepository scenariosRepository)
        {
            _scenariosRepository = scenariosRepository;
        }

        public async Task<List<Scenario>> GetAllScenarios()
        {
            return await _scenariosRepository.GetAllAsync();
        }

        public async Task<Scenario?> GetScenarioById(Guid id)
        {
            return await _scenariosRepository.GetByIdAsync(id);
        }

        public async Task<Scenario?> GetScenarioByUserId(Guid userId)
        {
            return await _scenariosRepository.GetByUserIdAsync(userId);
        }

        public async Task<Guid> CreateScenario(Scenario scenario)
        {
            await _scenariosRepository.SaveAsync(scenario);
            return scenario.Id;
        }

        public async Task<bool> UpdateScenario(Scenario scenario)
        {
            var existing = await _scenariosRepository.GetByIdAsync(scenario.Id);
            if (existing == null)
                return false;

            existing.UpdateTitle(scenario.Title);
            existing.UpdateDescription(scenario.Description);
            existing.UpdateDancerCount(scenario.DancerCount);

            typeof(Scenario)
                .GetField("_formations", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)?
                .SetValue(existing, new List<Formation>());

            foreach (var formation in scenario.Formations)
            {
                existing.AddFormation(formation);
            }

            if (scenario.IsPublished)
                existing.Publish();

            await _scenariosRepository.SaveAsync(existing);
            return true;
        }

        public async Task<bool> DeleteScenario(Guid id)
        {
            return await _scenariosRepository.DeleteAsync(id);
        }
    }
}

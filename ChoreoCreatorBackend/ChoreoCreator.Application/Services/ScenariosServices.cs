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
            return await _scenariosRepository.Get();
        }

        public async Task<Guid> CreateScenario(Scenario scenario)
        {
            return await _scenariosRepository.Create(scenario);
        }

        public async Task<Guid> UpdateScenario(Guid id, string title, string description, int dancerCount, Guid userId)
        {
            return await _scenariosRepository.Update(id, title, description, dancerCount, userId);
        }

        public async Task<Guid> DeleteScenario(Guid id)
        {
            return await _scenariosRepository.Delete(id);
        }
    }
}

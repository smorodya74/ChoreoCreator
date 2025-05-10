using ChoreoCreator.API.Constants;
using ChoreoCreator.API.Contracts;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace ChoreoCreator.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ScenariosController : ControllerBase
    {
        private readonly IScenariosServices _scenariosServices;

        public ScenariosController(IScenariosServices scenariosServices)
        {
            _scenariosServices = scenariosServices;
        }

        [HttpGet]
        public async Task<ActionResult<List<ScenariosResponse>>> GetScenarios()
        {
            var scenarios = await _scenariosServices.GetAllScenarios();

            var response = scenarios.Select(b => new ScenariosResponse(b.Id, b.Title, b.Description, b.DancerCount, b.UserId, b.CreatedAt, b.UpdatedAt));

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateScenario([FromBody] ScenariosRequest request)
        {
            var (scenario, error) = Scenario.Create(
                Guid.NewGuid(),
                request.Title,
                request.Description,
                request.DancerCount,
                FakeUsers.Id,
                request.CreatedAt,
                request.UpdatedAt);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var scenarioId = await _scenariosServices.CreateScenario(scenario);

            return Ok(scenarioId);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateScenario(Guid id, [FromBody] ScenariosRequest request)
        {
            var scenarioId = await _scenariosServices.UpdateScenario(id, request.Title, request.Description, request.DancerCount, request.UserId, request.CreatedAt, request.UpdatedAt);

            return Ok(scenarioId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteScenario(Guid id)
        {
            return Ok(await _scenariosServices.DeleteScenario(id));
        }
    }
}

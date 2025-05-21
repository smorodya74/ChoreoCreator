using ChoreoCreator.API.Contracts.DTOs;
using ChoreoCreator.API.Contracts.Scenario;
using ChoreoCreator.API.Extensions;
using ChoreoCreator.API.Mappers;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChoreoCreator.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScenariosController : ControllerBase
    {
        private readonly IScenariosServices _scenarioService;
        private readonly IUsersRepository _usersRepository;

        public ScenariosController(IScenariosServices scenariosService, IUsersRepository usersRepository)
        {
            _scenarioService = scenariosService;
            _usersRepository = usersRepository;
        }

        // GET: api/scenarios
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<ScenarioResponse>>> GetAll()
        {
            var scenarios = await _scenarioService.GetAllScenarios();

            var responseTasks = scenarios
                .Select(s => ScenarioMapper.ToResponseAsync(s, _usersRepository));

            var responses = await Task.WhenAll(responseTasks);

            return Ok(responses);
        }

        // GET: api/scenarios/{id}
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<ScenarioResponse>> GetById(Guid id)
        {
            var scenario = await _scenarioService.GetScenarioById(id);
            if (scenario == null)
                return NotFound();

            var response = await ScenarioMapper.ToResponseAsync(scenario, _usersRepository);
            return Ok(response);
        }

        // POST: api/scenarios
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ScenarioResponse>> CreateScenario([FromBody] CreateScenarioRequest request)
        {
            var userId = User.GetUserId();

            var (scenario, error) = Scenario.Create(
                Guid.NewGuid(),
                request.Title,
                request.Description,
                request.DancerCount,
                userId
            );

            if (!string.IsNullOrEmpty(error))
                return BadRequest(error);

            foreach (var formationDto in request.Formations)
            {
                var formation = new Formation(Guid.NewGuid(), formationDto.NumberInScenario);

                foreach (var dancerDto in formationDto.DancerPositions)
                {
                    var dancer = new DancerPosition(
                        dancerDto.NumberInFormation,
                        new Position(dancerDto.Position.X, dancerDto.Position.Y)
                    );

                    formation.AddDancerPosition(dancer);
                }

                scenario.AddFormation(formation);
            }

            if (request.IsPublished)
                scenario.Publish();

            await _scenarioService.CreateScenario(scenario);

            var response = await ScenarioMapper.ToResponseAsync(scenario, _usersRepository);
            return Ok(response);
        }

        // PUT: api/scenarios/{id}
        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] ScenarioUpdateRequest request)
        {
            var existing = await _scenarioService.GetScenarioById(id);
            if (existing == null)
                return NotFound();

            var userId = User.GetUserId();
            if (userId != existing.UserId)
                return Forbid();

            // Применяем изменения
            existing.UpdateTitle(request.Title);
            existing.UpdateDescription(request.Description ?? string.Empty);
            existing.UpdateDancerCount(request.DancerCount);

            // Перезаписываем формирования
            // Можно сначала очистить, потом добавить новые
            typeof(Scenario)
                .GetField("_formations", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!
                .SetValue(existing, new List<Formation>());

            foreach (var f in request.Formations)
            {
                var formation = new Formation(Guid.NewGuid(), f.NumberInScenario);
                foreach (var d in f.DancerPositions)
                {
                    var pos = new Position(d.Position.X, d.Position.Y);
                    formation.AddDancerPosition(new DancerPosition(d.NumberInFormation, pos));
                }
                existing.AddFormation(formation);
            }

            if (request.IsPublished)
                existing.Publish();

            await _scenarioService.UpdateScenario(existing);
            
            var response = await ScenarioMapper.ToResponseAsync(existing, _usersRepository);
            return Ok(response);
        }

        // DELETE: api/scenarios/{id}
        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _scenarioService.GetScenarioById(id);
            if (existing == null)
                return NotFound();

            var userId = User.GetUserId();
            if (userId != existing.UserId)
                return Forbid();

            await _scenarioService.DeleteScenario(id);
            return NoContent();
        }

        [HttpGet("mine")]
        [Authorize]
        public async Task<ActionResult<ScenarioResponse>> GetMyScenario()
        {
            var userId = User.GetUserId();

            var scenario = await _scenarioService.GetScenarioByUserId(userId);
            if (scenario == null)
                return NotFound();

            var response = await ScenarioMapper.ToResponseAsync(scenario, _usersRepository);
            return Ok(response);
        }
    }
}

using ChoreoCreator.API.Contracts.DTOs;
using ChoreoCreator.API.Contracts.Scenario;
using ChoreoCreator.API.Extensions;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Core.Models;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChoreoCreator.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScenariosController : ControllerBase
    {
        private readonly IScenariosServices _scenarioService;

        public ScenariosController(IScenariosServices scenariosService)
        {
            _scenarioService = scenariosService;
        }

        // GET: api/scenarios
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<ScenarioResponse>>> GetAll()
        {
            var scenarios = await _scenarioService.GetAllScenarios();
            var response = scenarios.Select(ToResponse).ToList();
            return Ok(response);
        }

        // GET: api/scenarios/{id}
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<ScenarioResponse>> GetById(Guid id)
        {
            var scenario = await _scenarioService.GetScenarioById(id);
            if (scenario == null)
                return NotFound();
            return Ok(ToResponse(scenario));
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

            return Ok(scenario);
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

            // К сожалению, DancerCount у нас нет публичного метода, можно через рефлексию или добавить UpdateDancerCount
            typeof(Scenario)
                .GetProperty(nameof(Scenario.DancerCount))!
                .SetValue(existing, request.DancerCount);

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
            return NoContent();
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

        private static ScenarioResponse ToResponse(Scenario s)
        {
            return new ScenarioResponse(
                s.Id,
                s.Title,
                s.Description,
                s.DancerCount,
                s.IsPublished,
                s.UserId.ToString(),
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
}

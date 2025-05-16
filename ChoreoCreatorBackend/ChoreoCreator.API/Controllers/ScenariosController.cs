using ChoreoCreator.API.Contracts.DTOs;
using ChoreoCreator.API.Contracts.Scenario;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Services;
using ChoreoCreator.Contracts.DTOs;
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
        public async Task<ActionResult<List<ScenariosResponse>>> GetAll()
        {
            var scenarios = await _scenarioService.GetAllScenarios();
            var response = scenarios.Select(ToResponse).ToList();
            return Ok(response);
        }

        // GET: api/scenarios/{id}
        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<ScenariosResponse>> GetById(Guid id)
        {
            var scenario = await _scenarioService.GetScenarioById(id);
            if (scenario == null)
                return NotFound();
            return Ok(ToResponse(scenario));
        }

        [HttpGet("test-auth")]
        [Authorize]
        public IActionResult TestAuth() => Ok("Token is valid");

        // POST: api/scenarios
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ScenarioDto>> CreateScenario(CreateScenarioDto dto)
        {
            var userId = User.GetUserId();

            var formations = dto.Formations.Select(f =>
            {
                var formation = new Formation(Guid.NewGuid(), f.NumberInScenario);
                foreach (var d in f.DancerPositions)
                {
                    formation.AddDancerPosition(new DancerPosition(
                        d.NumberInFormation,
                        new Position(d.Position.X, d.Position.Y)
                    ));
                }
                return formation;
            }).ToList();

            var domainScenario = Scenario.Create(
                dto.Title, dto.Description, dto.DancerCount, userId, formations);

            await _scenarioService.CreateScenario(domainScenario);

            return Ok(domainScenario.ToDto()); // этот ToDto можно вызвать уже из API-слоя
        }

        // PUT: api/scenarios/{id}
        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] ScenarioUpdateRequest request)
        {
            var existing = await _scenarioService.GetScenarioById(id);
            if (existing == null)
                return NotFound();

            var userId = GetUserIdFromClaims();
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

            var userId = GetUserIdFromClaims();
            if (userId != existing.UserId)
                return Forbid();

            await _scenarioService.DeleteScenario(id);
            return NoContent();
        }

        private static ScenariosResponse ToResponse(Scenario s)
        {
            return new ScenariosResponse(
                s.Id,
                s.Title,
                s.Description,
                s.DancerCount,
                s.UserId,
                s.IsPublished,
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

        private Guid GetUserIdFromClaims()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(claim, out var id) ? id : throw new UnauthorizedAccessException("Невалидный UserID");
        }
    }
}

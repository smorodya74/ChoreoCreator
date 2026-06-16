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
    /// <summary>
    /// API-контроллер управления сценариями хореографии.
    /// </summary>
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

        /// <summary>
        /// Возвращает список всех сценариев.
        /// </summary>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<ScenarioResponse>>> GetAll()
        {
            var scenarios = await _scenarioService.GetAllScenarios();
            var responses = new List<ScenarioResponse>();
            foreach (var s in scenarios)
            {
                responses.Add(await ScenarioMapper.ToResponseAsync(s, _usersRepository));
            }

            return Ok(responses);
        }

        /// <summary>
        /// Возвращает сценарий по идентификатору.
        /// </summary>
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

        /// <summary>
        /// Создаёт новый сценарий.
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ScenarioResponse>> CreateScenario([FromBody] CreateScenarioRequest request)
        {
            var userId = User.GetUserId();

            try
            {
                var (scenario, error) = Scenario.Create(
                    Guid.NewGuid(),
                    request.Title,
                    request.Description,
                    request.DancerCount,
                    userId,
                    request.TotalDurationMs
                );

                if (!string.IsNullOrEmpty(error))
                    return BadRequest(error);

                ApplyFormations(scenario, request.Formations);

                if (request.IsPublished)
                    scenario.Publish();

                await _scenarioService.CreateScenario(scenario);

                var response = await ScenarioMapper.ToResponseAsync(scenario, _usersRepository);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Обновляет существующий сценарий и его формирования.
        /// </summary>
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

            try
            {
                existing.UpdateTitle(request.Title);
                existing.UpdateDescription(request.Description ?? string.Empty);
                existing.UpdateDancerCount(request.DancerCount);
                existing.UpdateTotalDuration(request.TotalDurationMs);

                typeof(Scenario)
                    .GetField("_formations", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!
                    .SetValue(existing, new List<Formation>());

                ApplyFormations(existing, request.Formations);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }

            if (request.IsPublished && !existing.IsPublished)
            {
                existing.Publish();
            }

            await _scenarioService.UpdateScenario(existing);

            var response = await ScenarioMapper.ToResponseAsync(existing, _usersRepository);
            return Ok(response);
        }

        /// <summary>
        /// Удаляет сценарий.
        /// </summary>
        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = User.GetUserId();
            var userRole = (await _usersRepository.GetById(userId))?.Role;
            var scenario = await _scenarioService.GetScenarioById(id);

            if (scenario == null)
                return NotFound();

            if (userRole != "Admin" && userId != scenario.UserId)
                return Forbid();

            await _scenarioService.DeleteScenario(id);
            return NoContent();
        }

        /// <summary>Возвращает сценарий текущего пользователя.</summary>
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

        /// <summary>
        /// Нормализует входные формирования в непрерывную последовательность без разрывов
        /// и добавляет их в сценарий с соблюдением ограничений времени.
        /// </summary>
        private static void ApplyFormations(Scenario scenario, List<FormationRequest>? requests)
        {
            if (requests == null)
            {
                return;
            }

            var ordered = requests.OrderBy(f => f.NumberInScenario).ToList();
            var cursorMs = 0;

            foreach (var f in ordered)
            {
                if (f == null)
                {
                    throw new ArgumentException("Формирование не может быть null");
                }

                if (f.NumberInScenario < 1 || f.NumberInScenario > 16)
                {
                    throw new ArgumentException("Номер формирования должен быть от 1 до 16");
                }

                if (f.DancerPositions == null)
                {
                    throw new ArgumentException("Позиции танцоров должны быть переданы списком");
                }

                var durationMs = Math.Clamp(f.DurationMs <= 0 ? 10_000 : f.DurationMs, Formation.MIN_DURATION_MS, Formation.MAX_DURATION_MS);
                var startTimeMs = Math.Max(cursorMs, f.StartTimeMs);
                var animationDurationMs = f.NumberInScenario == 1 ? 0 : Math.Clamp(f.AnimationDurationMs, 0, durationMs);

                var formationId = f.Id == Guid.Empty ? Guid.NewGuid() : f.Id;
                var formation = new Formation(
                    formationId,
                    f.NumberInScenario,
                    startTimeMs,
                    durationMs,
                    animationDurationMs,
                    f.Name,
                    f.Description,
                    f.IsAutoName);

                foreach (var dancerDto in f.DancerPositions)
                {
                    if (dancerDto == null)
                    {
                        throw new ArgumentException("Позиция танцора не может быть null");
                    }

                    if (dancerDto.Position == null)
                    {
                        throw new ArgumentException("Координаты позиции танцора обязательны");
                    }

                    if (dancerDto.NumberInFormation < 1 || dancerDto.NumberInFormation > scenario.DancerCount)
                    {
                        throw new ArgumentException("Номер танцора должен быть от 1 до количества танцоров в сценарии");
                    }

                    var dancer = new DancerPosition(
                        dancerDto.Id == Guid.Empty ? Guid.NewGuid() : dancerDto.Id,
                        dancerDto.NumberInFormation,
                        new Position(dancerDto.Position.X, dancerDto.Position.Y));

                    formation.AddDancerPosition(dancer);
                }

                scenario.AddFormation(formation);
                cursorMs = startTimeMs + durationMs;
            }

            if (cursorMs > scenario.TotalDurationMs)
            {
                scenario.UpdateTotalDuration(cursorMs);
            }
        }
    }
}

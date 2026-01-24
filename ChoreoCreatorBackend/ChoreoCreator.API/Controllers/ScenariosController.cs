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
    /// Управление сценариями и их построением.
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

        // GET: api/scenarios
        /// <summary>
        /// Возвращает список всех сценариев.
        /// </summary>
        /// <response code="200">Список сценариев.</response>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<ScenarioResponse>>> GetAll()
        {
            var scenarios = await _scenarioService.GetAllScenarios();

            var responseTasks = scenarios
                .Select(s => ScenarioMapper.ToResponseAsync(s, _usersRepository));

            var responses = new List<ScenarioResponse>();
            foreach (var s in scenarios)
            {
                var response = await ScenarioMapper.ToResponseAsync(s, _usersRepository);
                responses.Add(response);
            }

            return Ok(responses);
        }

        // GET: api/scenarios/{id}
        /// <summary>
        /// Возвращает сценарий по идентификатору.
        /// </summary>
        /// <param name="id">Идентификатор сценария.</param>
        /// <response code="200">Сценарий найден.</response>
        /// <response code="404">Сценарий не найден.</response>
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
        /// <summary>
        /// Создаёт новый сценарий от имени текущего пользователя.
        /// </summary>
        /// <remarks>Требуется аутентификация. При <c>IsPublished=true</c> сценарий публикуется сразу.</remarks>
        /// <param name="request">Данные нового сценария.</param>
        /// <response code="200">Сценарий создан.</response>
        /// <response code="400">Некорректные данные сценария.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
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
                        dancerDto.Id,
                        dancerDto.NumberInFormation,
                        new Position(
                            dancerDto.Position.X, 
                            dancerDto.Position.Y)
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
        /// <summary>
        /// Обновляет сценарий и его формирования.
        /// </summary>
        /// <remarks>Требуется аутентификация. Обновлять может только владелец сценария.</remarks>
        /// <param name="id">Идентификатор сценария.</param>
        /// <param name="request">Новые данные сценария.</param>
        /// <response code="200">Сценарий обновлён.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
        /// <response code="403">Нет прав на изменение чужого сценария.</response>
        /// <response code="404">Сценарий не найден.</response>
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
            typeof(Scenario)
                .GetField("_formations", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!
                .SetValue(existing, new List<Formation>());

            foreach (var f in request.Formations)
            {
                var formation = new Formation(Guid.NewGuid(), f.NumberInScenario);
                foreach (var d in f.DancerPositions)
                {
                    var pos = new Position(d.Position.X, d.Position.Y);
                    formation.AddDancerPosition(new DancerPosition(d.Id, d.NumberInFormation, pos));
                }
                existing.AddFormation(formation);
            }

            if (request.IsPublished && !existing.IsPublished)
            {
                existing.Publish();
            }

            await _scenarioService.UpdateScenario(existing);
            
            var response = await ScenarioMapper.ToResponseAsync(existing, _usersRepository);
            return Ok(response);
        }

        // DELETE: api/scenarios/{id}
        /// <summary>
        /// Удаляет сценарий.
        /// </summary>
        /// <remarks>Требуется аутентификация. Удалять может владелец или администратор.</remarks>
        /// <param name="id">Идентификатор сценария.</param>
        /// <response code="204">Сценарий удалён.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
        /// <response code="403">Нет прав на удаление.</response>
        /// <response code="404">Сценарий не найден.</response>
        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            var scenario = await _scenarioService.GetScenarioById(id);
            var userId = User.GetUserId();
            var userRole = _usersRepository.GetById(userId).Result?.Role;
            
            if (scenario == null)
                return NotFound();

            if (userRole != "Admin" && userId != scenario.UserId)
                return Forbid();

            await _scenarioService.DeleteScenario(id);
            return NoContent();
        }

        /// <summary>
        /// Возвращает сценарий текущего пользователя.
        /// </summary>
        /// <remarks>Требуется аутентификация.</remarks>
        /// <response code="200">Сценарий пользователя найден.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
        /// <response code="404">Сценарий пользователя не найден.</response>
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

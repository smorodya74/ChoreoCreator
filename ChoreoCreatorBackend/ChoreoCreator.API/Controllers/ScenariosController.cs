using ChoreoCreator.API.Contracts;
using ChoreoCreator.Core.Abstractions;
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
    }
}

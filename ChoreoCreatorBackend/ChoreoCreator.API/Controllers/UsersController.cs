using ChoreoCreator.API.Contracts.DTOs;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChoreoCreator.API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<UserResponse>>> GetAllUsers()
        {
            var users = await _usersService.GetAllUsers();
            var response = users.Select(u => new UserResponse
            {
                Id = u.Id.Value,
                Email = u.Email.Value,
                Username = u.Username.Value,
                Role = u.Role,
                IsBlocked = u.IsBlocked
            }).ToList();

            return Ok(response);
        }

        [HttpPost("change-block-status")]
        public async Task<IActionResult> ChangeBlockStatus([FromBody] ChangeBlockStatusRequest request)
        {
            var result = await _usersService.ChangeBlockStatus(request.UserId, request.IsBlocked);
            return result ? Ok() : NotFound();
        }

        // DELETE: api/users/{id}
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _usersService.DeleteUser(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/users/change-password
        [HttpPost("change-password")]
        [Authorize] // доступен и обычным пользователям
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var currentPassword = new UserPassword(request.CurrentPassword);
            var newPassword = new UserPassword(request.NewPassword);

            var result = await _usersService.ChangePassword(request.UserId, currentPassword, newPassword);

            return result ? Ok() : BadRequest("Неверный текущий пароль");
        }
    }
}

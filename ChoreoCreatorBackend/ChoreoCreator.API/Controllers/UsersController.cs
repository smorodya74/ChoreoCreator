using ChoreoCreator.API.Contracts.DTOs;
using ChoreoCreator.API.Extensions;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Core.ValueObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChoreoCreator.API.Controllers
{
    /// <summary>
    /// Администрирование пользователей и управление паролями.
    /// </summary>
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
        /// <summary>
        /// Возвращает список всех пользователей.
        /// </summary>
        /// <remarks>Доступно только администраторам.</remarks>
        /// <response code="200">Список пользователей.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
        /// <response code="403">Нет прав администратора.</response>
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

        /// <summary>
        /// Изменяет статус блокировки пользователя.
        /// </summary>
        /// <param name="request">Данные пользователя и требуемый статус блокировки.</param>
        /// <response code="200">Статус блокировки обновлён.</response>
        /// <response code="404">Пользователь не найден.</response>
        [HttpPost("change-block-status")]
        public async Task<IActionResult> ChangeBlockStatus([FromBody] ChangeBlockStatusRequest request)
        {
            var result = await _usersService.ChangeBlockStatus(request.UserId, request.IsBlocked);
            return result ? Ok() : NotFound();
        }

        // DELETE: api/users/{id}
        /// <summary>
        /// Удаляет пользователя по идентификатору.
        /// </summary>
        /// <remarks>Доступно только администраторам.</remarks>
        /// <param name="id">Идентификатор пользователя.</param>
        /// <response code="200">Пользователь удалён.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
        /// <response code="403">Нет прав администратора.</response>
        /// <response code="404">Пользователь не найден.</response>
        [HttpDelete("{id:guid}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var result = await _usersService.DeleteUser(id);
            if (!result)
            {
                return NotFound();
            }

            return Ok();
        }

        // POST: api/users/change-password
        /// <summary>
        /// Меняет пароль текущего пользователя.
        /// </summary>
        /// <remarks>Требуется аутентификация.</remarks>
        /// <param name="request">Текущий и новый пароль.</param>
        /// <response code="200">Пароль изменён.</response>
        /// <response code="400">Текущий пароль неверный.</response>
        /// <response code="401">Пользователь не аутентифицирован.</response>
        [HttpPost("change-password")]
        [Authorize] // доступен и обычным пользователям
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var userId = User.GetUserId(); // получаем ID из токена

            var currentPassword = new UserPassword(request.CurrentPassword);
            var newPassword = new UserPassword(request.NewPassword);

            var result = await _usersService.ChangePassword(userId, currentPassword, newPassword);

            return result ? Ok() : BadRequest("Неверный текущий пароль");
        }
    }
}

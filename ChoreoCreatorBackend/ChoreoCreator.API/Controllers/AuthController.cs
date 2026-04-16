using ChoreoCreator.API.Contracts.Auth;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChoreoCreator.API.Controllers
{
    /// <summary>
    /// Аутентификация и управление сессионным JWT.
    /// </summary>
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUsersService _userService;
        private readonly IJwtTokenService _jwtTokenService;

        public AuthController(IUsersService userService, IJwtTokenService jwtTokenService)
        {
            _userService = userService;
            _jwtTokenService = jwtTokenService;
        }

        // POST: api/auth/register
        /// <summary>
        /// Регистрирует нового пользователя по email, имени пользователя и паролю.
        /// </summary>
        /// <param name="request">Данные для регистрации пользователя.</param>
        /// <param name="ct">Токен отмены запроса.</param>
        /// <response code="200">Пользователь зарегистрирован, возвращён идентификатор.</response>
        /// <response code="400">Некорректные данные или ошибка регистрации.</response>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
        {
            var result = await _userService.RegisterUser(request.Email, request.Username, request.Password, ct);

            if (result.IsFailure)
            {
                return BadRequest(new { error = result.Error });
            }

            var createdUser = await _userService.ValidateCredentials(request.Email, request.Password);
            if (createdUser != null)
            {
                var token = _jwtTokenService.GenerateToken(createdUser);
                AppendAuthCookie(token);
            }

            return Ok(new { userId = result.Value.Value });
        }

        // POST: api/auth/login
        /// <summary>
        /// Выполняет вход и устанавливает JWT в HttpOnly cookie.
        /// </summary>
        /// <param name="request">Учетные данные пользователя.</param>
        /// <response code="200">Вход выполнен, JWT сохранён в cookie.</response>
        /// <response code="401">Неверный логин или пароль.</response>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userService.ValidateCredentials(request.Email, request.Password);
            if (user == null)
                return Unauthorized("Неверный логин или пароль");

            var token = _jwtTokenService.GenerateToken(user);
            AppendAuthCookie(token);

            return Ok(new { Message = "Успешный вход" });
        }

        // POST: api/auth/logout
        /// <summary>
        /// Завершает сессию, удаляя JWT cookie.
        /// </summary>
        /// <response code="200">Cookie удалена.</response>
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { Message = "Выход выполнен" });
        }

        // POST: api/auth/me
        /// <summary>
        /// Возвращает данные текущего пользователя из токена.
        /// </summary>
        /// <remarks>Требуется аутентификация по JWT cookie.</remarks>
        /// <response code="200">Данные текущего пользователя.</response>
        /// <response code="401">Пользователь не аутентифицирован или данные токена недоступны.</response>
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var user = await _userService.GetByEmail(email);

            if (user == null)
                return Unauthorized();

            return Ok(new
            {
                username = user.Username.Value,
                email = user.Email.Value,
                role = user.Role,
                createdAt = user.CreatedAt
            });
        }

        private void AppendAuthCookie(string token)
        {
            var isHttps = HttpContext.Request.IsHttps;
            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = isHttps,
                SameSite = isHttps ? SameSiteMode.None : SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(60)
            });
        }
    }
}

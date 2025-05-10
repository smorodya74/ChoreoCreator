using ChoreoCreator.API.Contracts.Auth;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChoreoCreator.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUsersService _userService;       // Сервис для работы с пользователями
        private readonly IJwtTokenService _jwtTokenService;  // Сервис для работы с токенами

        public AuthController(IUsersService userService, IJwtTokenService jwtTokenService)
        {
            _userService = userService;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken ct)
        {
            var result = await _userService.RegisterUser(request.Email, request.Username, request.Password, ct);

            if (result.IsFailure)
            {
                return BadRequest(new { error = result.Error });
            }

            return Ok(new { userId = result.Value.Value });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Валидируем логин и пароль
            var user = await _userService.ValidateCredentials(request.Email, request.Password);
            if (user == null)
                return Unauthorized("Неверный логин или пароль");

            // Генерируем JWT
            var token = _jwtTokenService.GenerateToken(user);

            // Сохраняем токен в cookie с флагом HttpOnly
            Response.Cookies.Append("jwt_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,  // Для продакшн-среды
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddMinutes(60) // Время жизни токена
            });

            return Ok(new { Message = "Успешный вход" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt_token");  // Удаляем cookie при выходе
            return Ok(new { Message = "Выход выполнен" });
        }
    }
}

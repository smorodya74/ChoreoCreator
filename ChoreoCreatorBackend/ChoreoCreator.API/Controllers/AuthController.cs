using ChoreoCreator.API.Contracts.Auth;
using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ChoreoCreator.API.Controllers
{
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
            var user = await _userService.ValidateCredentials(request.Email, request.Password);
            if (user == null)
                return Unauthorized("Неверный логин или пароль");

            var token = _jwtTokenService.GenerateToken(user);

            Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(60)
            });

            return Ok(new { Message = "Успешный вход" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");
            return Ok(new { Message = "Выход выполнен" });
        }

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
                username = user.Username,
                email = user.Email.Value,
                role = user.Role
            });
        }
    }
}

using ChoreoCreator.Core.Settings;
using ChoreoCreator.Core.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ChoreoCreator.Application.Services
{
    /// <summary>
    /// Сервис генерации JWT для пользователей.
    /// </summary>
    public interface IJwtTokenService
    {
        /// <summary>
        /// Создаёт подписанный JWT для пользователя.
        /// </summary>
        /// <param name="user">Пользователь, для которого создаётся токен.</param>
        /// <returns>JWT в виде строки.</returns>
        string GenerateToken(User user);
    }

    /// <summary>
    /// Реализация генерации JWT на основе настроек приложения.
    /// </summary>
    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtSettings _settings;

        /// <summary>
        /// Инициализирует сервис токенов с параметрами JWT.
        /// </summary>
        /// <param name="options">Параметры JWT.</param>
        public JwtTokenService(IOptions<JwtSettings> options)
        {
            _settings = options.Value;
        }

        /// <summary>
        /// Создаёт подписанный JWT для пользователя.
        /// </summary>
        /// <param name="user">Пользователь, для которого создаётся токен.</param>
        /// <returns>JWT в виде строки.</returns>
        public string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.Value.ToString()),
                new Claim(ClaimTypes.Email, user.Email.Value),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_settings.ExpiresInMinutes),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

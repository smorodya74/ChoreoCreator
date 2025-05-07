namespace ChoreoCreator.Application.Settings
{
    public class JwtSettings
    {
        public string SecretKey { get; set; } = string.Empty;  // Ключ для подписи токенов
        public string Issuer { get; set; } = string.Empty;      // Кто выпускает токен
        public string Audience { get; set; } = string.Empty;    // Кто является аудиторией
        public int ExpiresInMinutes { get; set; } = 60;         // Время жизни токена
    }
}

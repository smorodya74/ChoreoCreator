namespace ChoreoCreator.Core.Settings
{
    /// <summary>
    /// Параметры JWT для аутентификации.
    /// </summary>
    public class JwtSettings
    {
        /// <summary>
        /// Секретный ключ для подписи токенов.
        /// </summary>
        public string SecretKey { get; set; } = string.Empty;

        /// <summary>
        /// Издатель токена (issuer).
        /// </summary>
        public string Issuer { get; set; } = string.Empty;

        /// <summary>
        /// Аудитория токена (audience).
        /// </summary>
        public string Audience { get; set; } = string.Empty;

        /// <summary>
        /// Время жизни токена в минутах.
        /// </summary>
        public int ExpiresInMinutes { get; set; } = 60;
    }
}

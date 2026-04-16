namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Публичные данные пользователя для административного списка.
    /// </summary>
    public class UserResponse
    {
        /// <summary>
        /// Идентификатор пользователя.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Отображаемое имя пользователя.
        /// </summary>
        public string Username { get; set; } = default!;

        /// <summary>
        /// Email пользователя.
        /// </summary>
        public string Email { get; set; } = default!;

        /// <summary>
        /// Роль пользователя в системе.
        /// </summary>
        public string Role { get; set; } = default!;

        /// <summary>
        /// Флаг блокировки пользователя.
        /// </summary>
        public bool IsBlocked { get; set; }

        /// <summary>
        /// Дата регистрации пользователя (UTC).
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }
}

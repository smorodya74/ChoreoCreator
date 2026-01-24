namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Данные для смены пароля пользователя.
    /// </summary>
    public class ChangePasswordRequest
    {
        /// <summary>
        /// Текущий пароль пользователя.
        /// </summary>
        public string CurrentPassword { get; set; } = default!;

        /// <summary>
        /// Новый пароль пользователя.
        /// </summary>
        public string NewPassword { get; set; } = default!;
    }
}

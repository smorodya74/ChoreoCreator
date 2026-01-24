namespace ChoreoCreator.API.Contracts.DTOs
{
    /// <summary>
    /// Данные для изменения статуса блокировки пользователя.
    /// </summary>
    public class ChangeBlockStatusRequest
    {
        /// <summary>
        /// Идентификатор пользователя.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Требуемый статус блокировки.
        /// </summary>
        public bool IsBlocked { get; set; }
    }
}

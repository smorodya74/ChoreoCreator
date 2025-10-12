namespace ChoreoCreator.Core.Exceptions
{
    public class BadRequestForLoginException : Exception
    {
        /// <summary>
        /// Исключение, которое выбрасывается, когда данные от учетной записи отсутствуют в системе
        /// </summary>
        public BadRequestForLoginException()
            : base("Неверный логин/email или пароль")
        { 
        }
    }
}

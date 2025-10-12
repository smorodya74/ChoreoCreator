namespace ChoreoCreator.Core.Exceptions
{
    /// <summary>
    /// Исключение, которое выбрасывается, когда в системе уже есть пользователь с таким Email
    /// </summary>
    public sealed class EmailAlreadyExistsException : Exception
    {
        public EmailAlreadyExistsException(string email)
            : base($"Пользователь с email: {email} уже существует в системе.")
        {
            Email = email;
        }

        public string Email { get; }
    }
}

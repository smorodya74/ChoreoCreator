namespace ChoreoCreator.Core.Exceptions
{
    public sealed class UsernameAlreadyExistsException : Exception
    {
        /// <summary>
        /// Исключение, которое выбрасывается, когда в системе уже есть пользователь с таким Username
        /// </summary>
        public UsernameAlreadyExistsException(string username) 
            : base($"Пользователь с username: {username} уже существует в системе.")
        {
            Username = username;
        }

        public string Username { get; }
    }
}

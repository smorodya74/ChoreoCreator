namespace ChoreoCreator.Core.Exceptions
{
    /// <summary>
    /// Исключение, которое выбрасывается, когда в системе уже есть пользователь с таким Query (email, username)
    /// </summary>
    public sealed class UserAlreadyExistsException : Exception
    {
        public UserAlreadyExistsException(string query)
            : base($"Пользователь с {query} уже существует в системе.")
        {
            Query = query;
        }

        public string Query { get; }
    }
}

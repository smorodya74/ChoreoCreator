namespace ChoreoCreator.Core.Exceptions
{
    public sealed class NotFoundException : Exception
    {
        /// <summary>
        /// Исключение, которое выбрасывается, когда в системе отсутствует запись по атрибуту
        /// </summary>
        public NotFoundException(string query)
            : base($"{query} не найден в системе.")
        {
            Query = query;
        }

        public string Query { get; }
    }
}

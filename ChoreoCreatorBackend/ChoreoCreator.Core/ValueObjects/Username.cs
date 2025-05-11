using System.Text.RegularExpressions;

namespace ChoreoCreator.Core.ValueObjects
{
    public class Username : ValueObject
    {
        private static readonly Regex ValidPattern = new(@"^[a-zA-Z0-9_-]{3,30}$");

        public string Value { get; }

        private Username(string value)
        {
            Value = value;
        }

        public static Username From(string value)
        {
            Ensure.That(CanCreate(value), "Недопустимый формат имени пользователя");
            return new Username(value);
        }

        public static bool CanCreate(string value)
        {
            return !string.IsNullOrWhiteSpace(value) && ValidPattern.IsMatch(value);
        }

        protected override IEnumerable<object?> GetEqualityComponents()
        {
            yield return Value;
        }

        public override string ToString() => Value;
    }
}

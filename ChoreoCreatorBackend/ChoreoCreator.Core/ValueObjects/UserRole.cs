namespace ChoreoCreator.Core.ValueObjects
{
    public class UserRole : ValueObject
    {
        public static readonly string[] ValidRoles = { "Choreographer", "Admin" };

        public string Value { get; }

        private UserRole(string value)
        {
            if (!ValidRoles.Contains(value))
                throw new ArgumentException("Недопустимая роль");

            Value = value;
        }

        public static UserRole From(string role) => new(role);

        protected override IEnumerable<object?> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}

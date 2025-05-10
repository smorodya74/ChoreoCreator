namespace ChoreoCreator.Core.ValueObjects;

public class UserPassword : ValueObject
{
    public const int MinimumLength = 8;
    public const int MaximumLength = 100;
    
    public string Value { get; }

    private UserPassword(string value)
    {
        Value = value;
    }

    public static bool CanCreate(string value)
    {
        if (string.IsNullOrEmpty(value))
            return false;

        if (value.Length < MinimumLength || value.Length > MaximumLength)
            return false;

        bool hasUpper = value.Any(char.IsUpper);
        bool hasDigit = value.Any(char.IsDigit);
        bool hasSpecial = value.Any(ch => !char.IsLetterOrDigit(ch));

        return hasUpper && hasDigit && hasSpecial;
    }
    
    public static UserPassword From(string value)
    {
        Ensure.That(CanCreate(value), "Неправильный формат пароля");

        return new UserPassword(value);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
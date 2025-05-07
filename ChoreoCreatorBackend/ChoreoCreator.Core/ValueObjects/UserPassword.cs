namespace ChoreoCreator.Core.ValueObjects;

public class UserPassword : ValueObject
{
    public const int MinimumLength = 8;
    public const int MaximumLength = 100;
    
    public string Value { get; set; }

    private UserPassword(string value)
    {
        Value = value;
    }

    public static bool CanCreate(string value)
    {
        if (string.IsNullOrEmpty(value))
        {
            return false;
        }
        
        if (value.Length < MinimumLength)
        {
            return false;
        }

        if (value.Length > MaximumLength)
        {
            return false;
        }

        return true;
    }
    
    public static UserPassword From(string value)
    {
        Ensure.That(CanCreate(value), "Неправильный формат пароля");

        return new UserPassword(value);
    }

    /// <inheritdoc />
    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}


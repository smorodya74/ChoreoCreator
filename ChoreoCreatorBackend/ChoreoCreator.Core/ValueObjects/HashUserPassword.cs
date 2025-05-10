namespace ChoreoCreator.Core.ValueObjects;

public class HashUserPassword : ValueObject
{
    public string Value { get; }

    private HashUserPassword(string value)
    {
        Value = value;
    }

    public static HashUserPassword From(string value)
    {
        Ensure.IsNotNullOrEmpty(value, nameof(value));

        return new HashUserPassword(value);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}


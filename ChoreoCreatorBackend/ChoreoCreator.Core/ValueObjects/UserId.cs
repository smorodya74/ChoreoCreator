namespace ChoreoCreator.Core.ValueObjects;

public class UserId : ValueObject
{
    public Guid Value { get; set; }

    private UserId(Guid value)
    {
        Value = value;
    }

    public static UserId From(Guid value)
    {
        if (value == default)
        {
            throw new ArgumentException("Дефолтное значение параметра", nameof(value));
        }

        return new UserId(value);
    }

    public static UserId Generate()
    {
        return From(Guid.NewGuid());
    }

    /// <inheritdoc />
    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}


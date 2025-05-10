using System.Net.Mail;

namespace ChoreoCreator.Core.ValueObjects;

public sealed class UserEmail : ValueObject
{
    public string Value { get; }

    private UserEmail(string value)
    {
        Value = value;
    }

    public static UserEmail From(string value)
    {
        Ensure.IsNotNullOrEmpty(value, nameof(value));

        if (!MailAddress.TryCreate(value, out _))
            throw new ArgumentException("Неправильный формат почты", nameof(value));

        return new UserEmail(value);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
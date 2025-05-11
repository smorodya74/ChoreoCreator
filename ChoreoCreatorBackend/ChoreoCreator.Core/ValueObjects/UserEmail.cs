using ChoreoCreator.Core.ValueObjects;
using System.Net.Mail;

public sealed class UserEmail : ValueObject
{
    public string Value { get; }

    private UserEmail(string value)
    {
        Value = value;
    }

    public static bool CanCreate(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        return MailAddress.TryCreate(value, out _);
    }

    public static UserEmail From(string value)
    {
        if (!CanCreate(value))
            throw new ArgumentException("Неправильный формат почты", nameof(value));

        return new UserEmail(value);
    }

    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return Value;
    }
}
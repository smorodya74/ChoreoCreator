using System.Net.Mail;

namespace ChoreoCreator.Core.ValueObjects;

public class UserEmail : ValueObject
{
    public string Value { get; set; }

    private UserEmail(string value)
    {
        this.Value = value;
    }

    public static UserEmail From(string value)
    {
        Ensure.That(CanCreate(value), "Неправльный формат почты");

        return new UserEmail(value);
    }

    public static bool CanCreate(string value)
    {
        return MailAddress.TryCreate(value, out var _); // тут можно сделать регулярное выражение
    }

    /// <inheritdoc />
    protected override IEnumerable<object?> GetEqualityComponents()
    {
        yield return this.Value;
    }
}


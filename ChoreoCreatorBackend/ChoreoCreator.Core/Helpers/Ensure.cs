namespace ChoreoCreator.Core.Helpers;

public static class Ensure
{
    /// <exception cref="ArgumentOutOfRangeException" />
    public static void IsNonNegative(double value, string paramName)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(paramName, value, "Value cannot be negative.");
        }
    }

    /// <exception cref="ArgumentException" />
    public static void That(bool assertion, string message)
    {
        if (!assertion)
        {
            throw new ArgumentException(message);
        }
    }

    /// <exception cref="ArgumentNullException" />
    public static void IsNotNull(object? value, string paramName)
    {
        if (value is null)
        {
            throw new ArgumentNullException(paramName);
        }
    }
    
    /// <exception cref="ArgumentException" />
    /// <exception cref="ArgumentNullException" />
    public static void IsNotNullOrEmpty(string? value, string paramName)
    {
        IsNotNull(value, paramName);

        if (value!.Length == 0)
        {
            throw new ArgumentException("Value cannot be empty.", paramName);
        }
    }
    
    /// <exception cref="ArgumentOutOfRangeException" />
    public static void IsNonNegative(short value, string paramName)
    {
        if (value < 0)
        {
            throw new ArgumentOutOfRangeException(paramName, value, "Value cannot be negative.");
        }
    }
}
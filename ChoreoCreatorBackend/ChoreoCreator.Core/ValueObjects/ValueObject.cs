using System.Collections;

namespace ChoreoCreator.Core.ValueObjects;

public abstract class ValueObject
{
    protected abstract IEnumerable<object?> GetEqualityComponents();

    public override bool Equals(object? obj)
    {
        if (obj == null)
        {
            return false;
        }

        if (this.GetType() != obj.GetType())
        {
            return false;
        }

        var valueObject = (ValueObject)obj;

        return this.GetEqualityComponents().SequenceEqual(valueObject.GetEqualityComponents());
    }

    public override int GetHashCode()
        => this.GetEqualityComponents()
            .Aggregate(
                1,
                (current, obj) =>
                {
                    unchecked
                    {
                        return current * 397 + ComputeHashCode(obj);
                    }
                });

    public static bool operator ==(ValueObject? a, ValueObject? b)
    {
        if (ReferenceEquals(a, null) && ReferenceEquals(b, null))
        {
            return true;
        }

        if (ReferenceEquals(a, null) || ReferenceEquals(b, null))
        {
            return false;
        }

        return a.Equals(b);
    }

    public static bool operator !=(ValueObject? a, ValueObject? b) => !(a == b);

    private static int ComputeHashCode(object? obj)
    {
        unchecked
        {
            if (obj == null)
            {
                return 0;
            }

            if (obj is IEnumerable enumerable)
            {
                var hash = 19;
                foreach (var value in enumerable)
                {
                    hash *= 31 + value?.GetHashCode() ?? 0;
                }

                return hash;
            }

            return obj.GetHashCode();
        }
    }
}
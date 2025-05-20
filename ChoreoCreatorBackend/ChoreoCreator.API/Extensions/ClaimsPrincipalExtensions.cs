using System.Security.Claims;

namespace ChoreoCreator.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        if (user == null)
            throw new ArgumentNullException(nameof(user));

        var userIdString = user.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdString))
            throw new Exception("UserId claim не найден или пустой");

        if (!Guid.TryParse(userIdString, out var userId))
        {
            throw new Exception($"UserId claim невалидный: '{userIdString}'");
        }

        return userId;
    }
}
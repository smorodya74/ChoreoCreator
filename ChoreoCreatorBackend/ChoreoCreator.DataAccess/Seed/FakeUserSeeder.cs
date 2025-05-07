using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess.Seed
{
    public static class FakeUserSeeder
    {
        //public static async Task SeedAsync(ChoreoCreatorDbContext dbContext)
        //{
        //    var fakeUserId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        //    var exists = await dbContext.Users.AnyAsync(u => u.Id == fakeUserId);
        //    if (!exists)
        //    {
        //        dbContext.Users.Add(new UserEntity
        //        {
        //            Id = fakeUserId,
        //            Email = "fakeuser@example.com",
        //            Username = "FakeUser",
        //            PasswordHash = ("FAKE_HASH") // Пока можно заглушку
        //        });

        //        await dbContext.SaveChangesAsync();
        //    }
        //}
    }
}

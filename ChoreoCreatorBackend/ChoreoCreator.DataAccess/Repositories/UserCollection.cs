using ChoreoCreator.Core.Contracts;
using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess.Repositories
{
    public class UserCollection : IUserCollection
    {
        private readonly ChoreoCreatorDbContext _dbContext;

        public UserCollection(ChoreoCreatorDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> UserExistBy(UserEmail email, CancellationToken ct)
        {
            return await _dbContext.Users.AnyAsync(u => u.Email == email.Value, ct);
        }

        public async Task AddUserAsync(User user, CancellationToken ct)
        {
            var userEntity = new UserEntity
            {
                Email = user.Email.Value,
                Username = user.Username.Value,
                PasswordHash = user.PasswordHash.Value,
            };

            await _dbContext.Users.AddAsync(userEntity, ct);
            await _dbContext.SaveChangesAsync(ct);
        }
    }
}

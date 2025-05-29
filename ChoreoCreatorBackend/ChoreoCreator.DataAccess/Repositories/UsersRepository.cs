using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Core.Models;
using ChoreoCreator.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChoreoCreator.DataAccess.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly ChoreoCreatorDbContext _context;

        public UsersRepository(ChoreoCreatorDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetById(Guid id)
        {
            var userEntity = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);
            if (userEntity is null)
                return null;

            var (user, error) = User.CreateDB(
                userEntity.Id,
                userEntity.Email,
                userEntity.Username,
                userEntity.PasswordHash,
                userEntity.Role,
                userEntity.IsBlocked
            );

            return user;
        }

        public async Task<User?> GetByEmail(string email)
        {
            var userEntity = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);

            if (userEntity == null)
                return null;

            var (user, error) = User.CreateDB(
                userEntity.Id,
                userEntity.Email,
                userEntity.Username,
                userEntity.PasswordHash,
                userEntity.Role,
                userEntity.IsBlocked
            );

            return user;
        }

        public async Task<List<User>> GetAll()
        {
            var userEntities = await _context.Users
                .AsNoTracking()
                .ToListAsync();

            var users = new List<User>();

            foreach (var userEntity in userEntities )
            {
                var (user, error) = User.CreateDB(
                    userEntity.Id,
                    userEntity.Email,
                    userEntity.Username,
                    userEntity.PasswordHash,
                    userEntity.Role,
                    userEntity.IsBlocked
                );

                if (user != null)
                {
                    users.Add(user);
                }
                else { }
            }
            return users;
        }

        public async Task<bool> ExistsByEmail(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<Guid> Create(User user)
        {
            var userEntity = new UserEntity
            {
                Id = user.Id.Value,
                Email = user.Email.Value,
                Username = user.Username.Value,
                PasswordHash = user.PasswordHash.Value,
                Role = user.Role,
                IsBlocked = user.IsBlocked
            };

            await _context.Users.AddAsync(userEntity);
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task Update(User user)
        {
            await _context.Users
                .Where(u => u.Id == user.Id.Value)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Email, u => user.Email.Value)
                    .SetProperty(u => u.Username, u => user.Username.Value)
                    .SetProperty(u => u.PasswordHash, u => user.PasswordHash.Value)
                    .SetProperty(u => u.Role, u => user.Role)
                    .SetProperty(u => u.IsBlocked, u => user.IsBlocked));
        }

        public async Task<bool> Delete(Guid id)
        {
            var entity = await _context.Users.FindAsync(id);
            if (entity == null)
                return false;

            _context.Users.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

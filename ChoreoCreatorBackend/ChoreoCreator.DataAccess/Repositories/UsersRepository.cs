using ChoreoCreator.Core.Abstractions;
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

            return userEntity == null
                ? null
                : User.Create(userEntity.Id, userEntity.Email, userEntity.Username, userEntity.PasswordHash, userEntity.Role, userEntity.CreatedAt, userEntity.UpdatedAt).user;
        }

        public async Task<User?> GetByEmail(string email)
        {
            var userEntity = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);

            return userEntity == null
                ? null
                : User.Create(userEntity.Id, userEntity.Email, userEntity.Username, userEntity.PasswordHash, userEntity.Role, userEntity.CreatedAt, userEntity.UpdatedAt).user;
        }

        public async Task<List<User>> GetAll()
        {
            var userEntities = await _context.Users.AsNoTracking().ToListAsync();

            return userEntities.Select(e =>
                User.Create(e.Id, e.Email, e.Username, e.PasswordHash, e.Role, e.CreatedAt, e.UpdatedAt).user).ToList();
        }

        public async Task<bool> ExistsByEmail(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<Guid> Create(User user)
        {
            var userEntity = new UserEntity
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                PasswordHash = user.PasswordHash,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt
            };

            await _context.Users.AddAsync(userEntity);
            await _context.SaveChangesAsync();

            return userEntity.Id;
        }

        public async Task Update(User user)
        {
            await _context.Users
                .Where(u => u.Id == user.Id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Email, u => user.Email)
                    .SetProperty(u => u.Username, u => user.Username)
                    .SetProperty(u => u.PasswordHash, u => user.PasswordHash)
                    .SetProperty(u => u.Role, u => user.Role)
                    .SetProperty(u => u.UpdatedAt, u => DateTime.UtcNow));
        }

        public async Task Delete(Guid id)
        {
            await _context.Users
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();
        }
    }
}

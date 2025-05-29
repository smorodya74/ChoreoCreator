using ChoreoCreator.Core.Models;

namespace ChoreoCreator.Application.Abstractions.Repositories;

public interface IUsersRepository
{
    Task<Guid> Create(User user);
    Task<bool> Delete(Guid id);
    Task<bool> ExistsByEmail(string email);
    Task<List<User>> GetAll();
    Task<User?> GetByEmail(string email);
    Task<User?> GetById(Guid id);
    Task Update(User user);
}
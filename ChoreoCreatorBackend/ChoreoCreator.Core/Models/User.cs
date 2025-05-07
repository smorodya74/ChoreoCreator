//using Microsoft.AspNet.Identity;

namespace ChoreoCreator.Core.Models
{
    public class User
    {
        public User(Guid id, string email, string username, string passwordHash, string role, DateTime createdAt, DateTime updatedAt)
        {
            Id = id;
            Email = email;
            Username = username;
            PasswordHash = passwordHash;
            Role = role;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }

        public Guid Id { get; }
        public string Email { get; private set; }
        public string Username { get; private set; }
        public string PasswordHash { get; private set; }
        public string Role { get; private set; }

        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; private set; }

        public static (User user, string error) Create(
            Guid id, 
            string email, 
            string username, 
            string passwordHash, 
            string role, 
            DateTime createdAt, 
            DateTime updatedAt)
        {
            if (string.IsNullOrWhiteSpace(password))
                return (null!, "Пароль не может быть пустым");

            if (string.IsNullOrWhiteSpace(role))
                return (null!, "Роль не указана");

            var passwordHashString = passwordHasher.HashPassword(password);
            var user = new User(id, email, username, passwordHash, role, createdAt, updatedAt);
            return (user, string.Empty);
        }

        public void Rename(string newUsername)
        {
            Username = newUsername;
            Touch();
        }

        public void ChangeEmail(string newEmail)
        {
            Email = newEmail;
            Touch();
        }

        public void ChangePassword(string newPassword, IPasswordHasher passwordHasher)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
                throw new ArgumentException("Пароль не может быть пустым");

            PasswordHash = passwordHasher.HashPassword(newPassword);
            Touch();
        }

        public bool VerifyPassword(string password, IPasswordHasher passwordHasher)
        {
            var result = passwordHasher.VerifyHashedPassword(PasswordHash, password);
            return result == PasswordVerificationResult.Success;
        }

        public void ChangeRole(string newRole)
        {
            if (string.IsNullOrWhiteSpace(newRole))
                throw new ArgumentException("Роль не указана");

            Role = newRole;
            Touch();
        }

        private void Touch()
        {
            UpdatedAt = DateTime.UtcNow;
        }
    }
}

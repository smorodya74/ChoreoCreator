//using Microsoft.AspNet.Identity;

using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Models
{
    public class User
    {
        public User(UserId id, UserEmail email, string username, HashUserPassword passwordHash, string role, DateTime createdAt, DateTime updatedAt)
        {
            Id = id;
            Email = email;
            Username = username;
            PasswordHash = passwordHash;
            Role = role;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
        }

        public UserId Id { get; }
        public UserEmail Email { get; private set; }
        public string Username { get; private set; }
        public HashUserPassword PasswordHash { get; private set; }
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

        public static User Create(UserEmail userEmail, HashUserPassword userPassword) // Для создания может быть больше полей, просто это для примера как надо
        {
            Ensure.IsNotNull(userEmail, nameof(userEmail));
            Ensure.IsNotNull(userPassword, nameof(userPassword));

            return new User(
                UserId.Generate(), // Не помню термин, но можно использовать GUID который формируется с текущим временем, тогда мы можем в одном ИД хранить время создания и как бы сам ИД.
                userEmail,
                "Дефолт, тут будет ValueObject",
                userPassword,
                "Дефолт",
                DateTime.UtcNow, // Так делать не рекомендуют, но я ничего критичного в этом не вижу)
                DateTime.UtcNow
            );
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

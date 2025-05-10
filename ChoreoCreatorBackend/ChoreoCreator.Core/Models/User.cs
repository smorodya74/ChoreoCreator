using ChoreoCreator.Core.ValueObjects;

namespace ChoreoCreator.Core.Models
{
    public class User
    {
        private User(
            UserId id, 
            UserEmail email, 
            Username username, 
            HashUserPassword passwordHash, 
            string role,
            DateTime createdAt, 
            DateTime updatedAt)
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
        public Username Username { get; private set; }
        public HashUserPassword PasswordHash { get; private set; }
        public string Role { get; private set; }

        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; private set; }

        public static User Create(UserEmail userEmail, Username username, HashUserPassword userPassword)
        {
            Ensure.IsNotNull(userEmail, nameof(userEmail));
            Ensure.IsNotNull(userPassword, nameof(userPassword));
            Ensure.IsNotNull(username, nameof(username));

            return new User(
                UserId.Generate(),
                userEmail,
                username,
                userPassword,
                "Choreographer",
                DateTime.UtcNow,
                DateTime.UtcNow
            );
        }

        public void Rename(Username newUsername)
        {
            Username = newUsername;
            Touch();
        }

        public void ChangeEmail(UserEmail newEmail)
        {
            Email = newEmail;
            Touch();
        }

        public void ChangePassword(HashUserPassword newHashedPassword)
        {
            Ensure.IsNotNull(newHashedPassword, nameof(newHashedPassword));
            PasswordHash = newHashedPassword;
            Touch();
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

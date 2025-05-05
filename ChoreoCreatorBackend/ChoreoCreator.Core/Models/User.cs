namespace ChoreoCreator.Core.Models
{
    public class User
    {
        public const int MAX_USERNAME_LENGTH = 50;
        public const int MAX_EMAIL_LENGTH = 100;

        public User(Guid id, string email, string username, byte[] passwordHash, string role, DateTime createdAt, DateTime updatedAt)
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
        public byte[] PasswordHash { get; private set; }
        public string Role { get; private set; }

        public DateTime CreatedAt { get; }
        public DateTime UpdatedAt { get; private set; }

        public static (User user, string error) Create(Guid id, string email, string username, byte[] passwordHash, string role, DateTime createdAt, DateTime updatedAt)
        {
            if (string.IsNullOrWhiteSpace(email) || email.Length > MAX_EMAIL_LENGTH)
                return (null!, "Некорректный email");

            if (string.IsNullOrWhiteSpace(username) || username.Length > MAX_USERNAME_LENGTH)
                return (null!, "Некорректное имя пользователя");

            if (passwordHash == null || passwordHash.Length == 0)
                return (null!, "Пароль не может быть пустым");

            if (string.IsNullOrWhiteSpace(role))
                return (null!, "Роль не указана");

            var user = new User(id, email, username, passwordHash, role, createdAt, updatedAt);
            return (user, string.Empty);
        }

        public void Rename(string newUsername)
        {
            if (string.IsNullOrWhiteSpace(newUsername) || newUsername.Length > MAX_USERNAME_LENGTH)
                throw new ArgumentException("Некорректное имя пользователя");

            Username = newUsername;
            Touch();
        }

        public void ChangeEmail(string newEmail)
        {
            if (string.IsNullOrWhiteSpace(newEmail) || newEmail.Length > MAX_EMAIL_LENGTH)
                throw new ArgumentException("Некорректный email");

            Email = newEmail;
            Touch();
        }

        public void ChangePassword(byte[] newPasswordHash)
        {
            if (newPasswordHash == null || newPasswordHash.Length == 0)
                throw new ArgumentException("Пароль не может быть пустым");

            PasswordHash = newPasswordHash;
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

namespace ChoreoCreator.Core.Models
{
    public class User
    {
        public Guid Id { get; }
        public string Email { get; }
        public string Username { get; }

        public User(Guid id, string email, string username)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required.");
            if (string.IsNullOrWhiteSpace(username)) throw new ArgumentException("Username is required.");
                
            Id = id;
            Email = email;
            Username = username;
        }
    }
}

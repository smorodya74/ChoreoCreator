using System.ComponentModel.DataAnnotations.Schema;

namespace ChoreoCreator.DataAccess.Entities
{
    [Table("t_Users")]
    public class UserEntity
    {
        public Guid Id { get; set; }

        public string Email { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string ?PasswordHash { get; set; }
        public string Role { get; set; } = "Choreographer";
        public bool IsBlocked { get; set; } = false;
    }
}

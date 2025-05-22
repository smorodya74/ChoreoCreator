using ChoreoCreator.Core.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChoreoCreator.DataAccess.Entities
{
    [Table("t_Scenarios")]
    public class ScenarioEntity
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(Scenario.MAX_TITLE_LENGTH)]
        public string Title { get; set; } = null!;

        [MaxLength(Scenario.MAX_DESCRIPTION_LENGTH)]
        public string Description { get; set; } = string.Empty;

        public int DancerCount { get; set; }

        public bool IsPublished { get; set; }

        public Guid UserId { get; set; }

        public UserEntity User { get; set; }

        [Column(TypeName = "jsonb")]
        public string FormationsJson { get; set; } = "[]";

        [NotMapped]
        public List<FormationDto> Formations
        {
            get => string.IsNullOrEmpty(FormationsJson)
                ? new List<FormationDto>()
                : System.Text.Json.JsonSerializer.Deserialize<List<FormationDto>>(FormationsJson)
                  ?? new List<FormationDto>();

            set => FormationsJson = System.Text.Json.JsonSerializer.Serialize(value);
        }
    }
}

using Microsoft.AspNetCore.Identity;

namespace Bakis.Data.Models
{
    public class User : IdentityUser
    {
        [PersonalData]
        public string? Name { get; set; }

        [PersonalData]
        public string? Surname { get; set; }
        [PersonalData]
        public DateTime? BirthDate { get; set; }
        [PersonalData]
        public int? Age { get; set; }

        public string Email { get; set; }
        public string? Position { get; set; } = null;
        public string? CompanyName { get; set; } = null;
        public virtual ICollection<ExamAttempt> ExamAttempts { get; set; }
    }
}
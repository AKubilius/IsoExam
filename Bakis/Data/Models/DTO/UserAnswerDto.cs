namespace Bakis.Data.Models.DTO
{
    public class UserAnswerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime? BirthDate { get; set; }
        public int? Age { get; set; }
        public string Email { get; set; }
        public string? Position { get; set; }
        public string? CompanyName { get; set; }
        public ICollection<ExamAttemptDto> ExamAttempts { get; set; }
    }

}

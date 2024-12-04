namespace Bakis.Data.Models.DTO
{
    public class ExamSubssionDto
    {
        public int UserId { get; set; }
        public List<UserAnswerDto> Answers { get; set; }
    }

}

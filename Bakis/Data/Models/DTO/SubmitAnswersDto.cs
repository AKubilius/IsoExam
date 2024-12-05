namespace Bakis.Data.Models.DTO
{
    public class SubmitAnswersDto
    {
        public string? UserId { get; set; } = null;// User ID of the person submitting the answers
        public List<AnswerDto> Answers { get; set; }
    }

    public class AnswerDto
    {
        public int QuestionId { get; set; }
        public string PolicyDefined { get; set; }
        public string ControlImplemented { get; set; }
        public string ControlAutomated { get; set; }
        public string ControlReported { get; set; }
    }

    public class ExamAttemptDto
    {
        public int Id { get; set; }
        public DateTime AttemptedAt { get; set; }
        public TimeSpan TimeTaken { get; set; }
        public int Score { get; set; }
        public string Status { get; set; }
        public ICollection<AnswerDto> Answers { get; set; }
    }

    public class ExportRequest
    {
        public int Risk { get; set; }
        public Dictionary<string, bool> CheckedControls { get; set; }
    }

}

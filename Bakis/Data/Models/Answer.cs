using Bakis.Data.Models;

public class Answer
{
    public int Id { get; set; }
    public int QuestionId { get; set; } // Foreign key to Question
    public string UserId { get; set; } // Foreign key to User
    public int ExamAttemptId { get; set; } // Foreign key to ExamAttempt

    public string PolicyDefined { get; set; }
    public string ControlImplemented { get; set; }
    public string ControlAutomated { get; set; }
    public string ControlReported { get; set; }

    // Navigation properties
    public Question Question { get; set; }
    public User User { get; set; } // Navigation property to User
    public ExamAttempt ExamAttempt { get; set; } // Navigation property to ExamAttempt
}
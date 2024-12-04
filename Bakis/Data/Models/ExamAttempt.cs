using System.Text.Json.Serialization;
using Bakis.Data.Models;

public class ExamAttempt
{
    public int Id { get; set; }
    public string UserId { get; set; } // Foreign key to User
    public DateTime AttemptedAt { get; set; }
    public TimeSpan TimeTaken { get; set; }
    public int Score { get; set; }
    public string Status { get; set; }

    // Navigation properties
    [JsonIgnore]
    public User User { get; set; } // Navigation property to User
    public ICollection<Answer> Answers { get; set; } = new List<Answer>(); // Navigation property for Answers
}
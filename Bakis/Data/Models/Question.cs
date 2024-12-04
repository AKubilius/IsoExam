namespace Bakis.Data.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string? Title { get; set; } = null;
        public string Detail { get; set; }
        public string NistCategory { get; set; }
        public int Group { get; set; }
        public string ImplementationGroups { get; set; }
        public string SensorBaseline { get; set; }
        public bool? IsBlocked { get; set; } = false;

        // Navigation property for related answers
        public ICollection<Answer> Answers { get; set; }
    }

}

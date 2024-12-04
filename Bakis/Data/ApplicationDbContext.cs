using Bakis.Data.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Bakis.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public DbSet<ExamAttempt> ExamAttempts { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the relationship between Answer and Question
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.Question)
                .WithMany(q => q.Answers)
                .HasForeignKey(a => a.QuestionId)
                .OnDelete(DeleteBehavior.Restrict); // Disable cascading delete

            // Configure the relationship between Answer and ExamAttempt
            modelBuilder.Entity<Answer>()
                .HasOne(a => a.ExamAttempt)
                .WithMany(e => e.Answers)
                .HasForeignKey(a => a.ExamAttemptId)
                .OnDelete(DeleteBehavior.Restrict); // Disable cascading delete

            // Configure the relationship between ExamAttempt and User
            modelBuilder.Entity<ExamAttempt>()
                .HasOne(e => e.User)
                .WithMany(u => u.ExamAttempts)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Disable cascading delete

            base.OnModelCreating(modelBuilder);
        }



        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                .AddJsonFile("appsettings.json")
                .Build();

            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
    }
}
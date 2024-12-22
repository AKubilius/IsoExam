using Xunit;
using Bakis.Controllers;
using Bakis.Data;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;

namespace Bakis.Tests
{
    public class QuestionControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            return new ApplicationDbContext(options);
        }

        private IAuthorizationService CreateStubAuthorizationService()
        {
            return new Mock<IAuthorizationService>().Object;
        }

        [Fact]
        public async Task GetQuestions_ValidData_ReturnsQuestionsList()
        {
            // Arrange
            using var dbContext = GetInMemoryDbContext();
            dbContext.Questions.AddRange(
                new Question
                {
                    Id = 1,
                    Title = "Question 1",
                    Detail = "What is your name?",
                    NistCategory = "Category A",
                    Group = 1,
                    ImplementationGroups = "Group A",
                    SensorBaseline = "Baseline 1",
                    IsBlocked = false
                },
                new Question
                {
                    Id = 2,
                    Title = "Question 2",
                    Detail = "What is your favorite color?",
                    NistCategory = "Category B",
                    Group = 2,
                    ImplementationGroups = "Group B",
                    SensorBaseline = "Baseline 2",
                    IsBlocked = true
                },
                new Question
                {
                    Id = 3,
                    Title = "Question 3",
                    Detail = "What is the capital of France?",
                    NistCategory = "Category C",
                    Group = 3,
                    ImplementationGroups = "Group C",
                    SensorBaseline = "Baseline 3",
                    IsBlocked = false
                }
            );
            await dbContext.SaveChangesAsync();

            var controller = new QuestionController(dbContext, CreateStubAuthorizationService());

            // Act
            var result = await controller.GetQuestions();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var questions = Assert.IsType<List<Question>>(okResult.Value);

            Assert.Equal(3, questions.Count);

            Assert.Contains(questions, q => q.Title == "Question 1" && q.Detail == "What is your name?");
            Assert.Contains(questions, q => q.Title == "Question 2" && q.IsBlocked == true);
            Assert.Contains(questions, q => q.Title == "Question 3" && q.NistCategory == "Category C");
        }
    }
}

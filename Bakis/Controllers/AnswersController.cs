using System.Security.Claims;
using Bakis.Data;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public AnswersController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;
            _authorizationService = authorizationService;
        } 
        private string getCurrentUserId()
        {
            return User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> SubmitExam([FromBody] SubmitAnswersDto dto)
        {
            var userId = getCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in the token.");
            }

            if (dto == null || dto.Answers == null || !dto.Answers.Any())
            {
                return BadRequest("Invalid or missing answers.");
            }

            // Validate UserId from DTO matches the authenticated user's ID
            if (!string.IsNullOrEmpty(dto.UserId) && dto.UserId != userId)
            {
                return BadRequest("User ID mismatch.");
            }

            // Create a new ExamAttempt
            var examAttempt = new ExamAttempt
            {
                UserId = userId,
                AttemptedAt = DateTime.UtcNow,
                TimeTaken = TimeSpan.Zero, // Set the actual time taken if you are tracking it
                Score = 0, // Calculate and set the score if necessary
                Status = "Completed" // You can change this based on your business logic
            };

            // Add the ExamAttempt to the database
            _databaseContext.ExamAttempts.Add(examAttempt);
            await _databaseContext.SaveChangesAsync(); // Save to get the generated ExamAttemptId

            // Create and save Answer entities linked to the ExamAttempt
            var answers = dto.Answers.Select(answer => new Answer
            {
                QuestionId = answer.QuestionId,
                UserId = userId,
                ExamAttemptId = examAttempt.Id, // Link to the newly created ExamAttempt
                PolicyDefined = answer.PolicyDefined,
                ControlImplemented = answer.ControlImplemented,
                ControlAutomated = answer.ControlAutomated,
                ControlReported = answer.ControlReported
            }).ToList();

            _databaseContext.Answers.AddRange(answers);
            await _databaseContext.SaveChangesAsync();

            return Ok("Exam submitted successfully.");
        }
    }
}

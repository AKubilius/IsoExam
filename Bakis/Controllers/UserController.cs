using System.Runtime.InteropServices;
using Bakis.Auth.Model;
using Bakis.Data;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public UserController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;
            _authorizationService = authorizationService;
        }

        private string getCurrentUserId()
        {
            return User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUserAsync()
        {
            string userId = getCurrentUserId();
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User not authenticated");
            }

            var user = await _databaseContext.Users
     .Include(u => u.ExamAttempts) // Include ExamAttempts
         .ThenInclude(e => e.Answers) // Include Answers for ExamAttempts
     .FirstOrDefaultAsync(u => u.Id == userId);



            if (user == null)
            {
                return NotFound("User not found");
            }

            // Map to DTO
            var userDto = new UserAnswerDto
            {
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                BirthDate = user.BirthDate,
                Age = user.Age,
                Email = user.Email,
                Position = user.Position,
                CompanyName = user.CompanyName,
                ExamAttempts = user.ExamAttempts.Select(e => new ExamAttemptDto
                {
                    Id = e.Id,
                    AttemptedAt = e.AttemptedAt,
                    TimeTaken = e.TimeTaken,
                    Score = e.Score,
                    Status = e.Status,
                    Answers = e.Answers.Select(a => new AnswerDto
                    {
                        QuestionId = a.Id,
                        PolicyDefined = a.PolicyDefined,
                        ControlImplemented = a.ControlImplemented,
                        ControlAutomated = a.ControlAutomated,
                        ControlReported = a.ControlReported
                        }).ToList()
                }).ToList()
            };
            return Ok(userDto);
        }


        // GET api/<UserController>/5
        [HttpGet("user-list")]
        public async Task<List<User>> GetUsers()
        {
            return await _databaseContext.Users.ToListAsync();
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<User> UpdateUserAsync(User updatedUser)
        {
            var existingUser = await _databaseContext.Users.FindAsync(updatedUser.Id);
            if (existingUser == null)
                throw new KeyNotFoundException("User not found");

            existingUser.Name = updatedUser.Name;
            existingUser.Surname = updatedUser.Surname;
            existingUser.BirthDate = updatedUser.BirthDate;
            existingUser.Age = updatedUser.Age;
            existingUser.Email = updatedUser.Email;
            existingUser.Position = updatedUser.Position;
            existingUser.CompanyName = updatedUser.CompanyName;

            _databaseContext.Users.Update(existingUser);
            await _databaseContext.SaveChangesAsync();
            return existingUser;
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _databaseContext.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            _databaseContext.Users.Remove(user);
            await _databaseContext.SaveChangesAsync();
            return NoContent();
        }
    }
}

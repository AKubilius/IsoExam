using Bakis.Data;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public QuestionController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;
            _authorizationService = authorizationService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Question>>> GetQuestions()
        {
            // Sample questions based on the image you provided
            var questions = new List<Question> {};
            questions = _databaseContext.Questions.ToList();

            return Ok(questions);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> EditQuestion(int id, [FromBody] QuestionDTO updatedQuestion)
        {
            // Fetch the existing question from the database
            var question = await _databaseContext.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound(new { message = "Question not found." });
            }

            // Update the fields
            question.Detail = updatedQuestion.Detail;
            question.Group = updatedQuestion.Group;

            try
            {
                // Save changes to the database
                _databaseContext.Questions.Update(question);
                await _databaseContext.SaveChangesAsync();
                return Ok(new { message = "Question updated successfully." });
            }
            catch (Exception ex)
            {
                // Handle any errors
                return StatusCode(500, new { message = "An error occurred while updating the question.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteQuestion(int id)
        {
            // Fetch the question from the database
            var question = await _databaseContext.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound(new { message = "Question not found." });
            }

            try
            {
                // Remove the question from the database
                _databaseContext.Questions.Remove(question);
                await _databaseContext.SaveChangesAsync();
                return Ok(new { message = "Question deleted successfully." });
            }
            catch (Exception ex)
            {
                // Handle any errors
                return StatusCode(500, new { message = "An error occurred while deleting the question.", error = ex.Message });
            }
        }



    }
}

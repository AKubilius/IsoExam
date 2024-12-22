using Microsoft.AspNetCore.Mvc;
using Bakis.Services;
using Bakis.Data.Models;
using Microsoft.AspNetCore.Identity;
using DocumentFormat.OpenXml.Spreadsheet;
using Bakis.Data;
using Microsoft.AspNetCore.Authorization;
using DocumentFormat.OpenXml.InkML;

namespace Bakis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ApplicationDbContext _databaseContext;
        public ContactController(IEmailService emailService, ApplicationDbContext context)
        {
            _emailService = emailService;
            _databaseContext = context;
        }




        private string getCurrentUserId()
        {
            return User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] ContactRequest request)
        {
            if (request.Email == "")
            {
                var userId = getCurrentUserId();
                var user = await _databaseContext.Users.FindAsync(userId);
                request.Email = user.Email;
            }

            try
            {
                // Fixed recipient (admin)
                var recipientEmail = "viliuunas@gmail.com"; // Use environment variable for production
                var subject = "New Message from User";
                var messageBody = $"<p><strong>From:</strong> {request.Email}</p><p>{request.Message}</p>";

                // Send email to admin
                await _emailService.SendEmailAsync(recipientEmail, subject, messageBody);

                return Ok(new { success = true, message = "Message sent successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "An error occurred while sending the message.", details = ex.Message });
            }
        }

    }

    public class ContactRequest
    {
        public string Email { get; set; }
        public string Message { get; set; }
    }
}

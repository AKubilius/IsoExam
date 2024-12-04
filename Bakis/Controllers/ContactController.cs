using Microsoft.AspNetCore.Mvc;
using Bakis.Services;

namespace Bakis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] ContactRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest("Email and message are required.");
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

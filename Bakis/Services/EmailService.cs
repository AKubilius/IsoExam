using System.Net.Mail;
using System.Net;
using Bakis.Data.Models;

namespace Bakis.Services
{
    public class EmailService : IEmailService
    {

        public async Task SendEmailAsync(string to, string subject, string message)
        {
            try
            {
                using var client = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    Credentials = new NetworkCredential("isoexamdonotreply@gmail.com", "vtkw aiml atxe xvvc"),
                    EnableSsl = true
                };
                var emailMessage = new MailMessage("isoexamdonotreply@gmail.com", to, subject, message)
                {
                    IsBodyHtml = true
                };
                await client.SendMailAsync(emailMessage);
            }
            catch (Exception ex)
            {
                // Log the error (use a proper logging library like Serilog in production)
                Console.WriteLine($"Error sending email: {ex.Message}");
                throw new Exception("Failed to send email", ex);
            }
        }
    }
}

using Bakis.Data;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml;
using Mammoth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using Bakis.Data.Models;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;

[Route("api/[controller]")]
[ApiController]
public class UploadController : ControllerBase
{
    private readonly ApplicationDbContext _databaseContext;
    private readonly IAuthorizationService _authorizationService;

    public UploadController(ApplicationDbContext context, IAuthorizationService authorizationService)
    {
        _databaseContext = context;
        _authorizationService = authorizationService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty or not provided.");

        try
        {
            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                stream.Position = 0;

                // Use DocumentConverter with the updated API
                var converter = new DocumentConverter();
                var result = converter.ConvertToHtml(stream); // This method now returns HTML

                var extractedText = result.Value; // Extracted HTML content from the .docx file

                // If plain text is needed, you can strip HTML tags, or use a different approach
                var plainText = HtmlToPlainText(extractedText);

                // Return the plain text as JSON
                return Ok(new { text = plainText });
            }
        }
        catch
        {
            return StatusCode(500, "An error occurred while processing the file.");
        }
    }

    // Helper method to strip HTML tags if plain text is needed
    private string HtmlToPlainText(string html)
    {
        return System.Text.RegularExpressions.Regex.Replace(html, "<.*?>", string.Empty);
    }


[HttpGet("export")]
[Authorize]
public async Task<IActionResult> ExportAnswersToWord()
{
    // Retrieve the User ID from the claims
    var userId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
    if (string.IsNullOrEmpty(userId))
    {
        return Unauthorized("User ID not found in the token.");
    }

    // Retrieve the user information from the database
    var user = await _databaseContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
    if (user == null)
    {
        return NotFound("User not found.");
    }

    // Retrieve the answers for the user
    var answers = await _databaseContext.Answers
                                .Where(a => a.UserId == userId)
                                .ToListAsync();

    if (!answers.Any())
    {
        return NotFound("No answers found for this user.");
    }

    using (var memoryStream = new MemoryStream())
    {
        // Create a WordprocessingDocument
        using (var wordDocument = WordprocessingDocument.Create(
            memoryStream,
            DocumentFormat.OpenXml.WordprocessingDocumentType.Document,
            true))
        {
            // Add a main document part
            var mainPart = wordDocument.AddMainDocumentPart();
            mainPart.Document = new Document();
            var body = mainPart.Document.AppendChild(new Body());

            // Add user information at the top of the document
            AddParagraph(body, "User Information", isBold: true, fontSize: 14);
            AddParagraph(body, $"Name: {user.Name} {user.Surname}");
            AddParagraph(body, $"Email: {user.Email}");
            AddParagraph(body, $"Position: {user.Position ?? "N/A"}");
            AddParagraph(body, $"Company: {user.CompanyName ?? "N/A"}");
            AddParagraph(body, ""); // Add a blank line

            //// Insert the report title
            //AddParagraph(body, "User Answers Report", isBold: true, fontSize: 16);

            //// Add answers to the document
            //foreach (var answer in answers)
            //{
            //    AddParagraph(body, $"Question ID: {answer.QuestionId}");
            //    AddParagraph(body, $"Policy Defined: {answer.PolicyDefined ?? "N/A"}");
            //    AddParagraph(body, $"Control Implemented: {answer.ControlImplemented ?? "N/A"}");
            //    AddParagraph(body, $"Control Automated: {answer.ControlAutomated ?? "N/A"}");
            //    AddParagraph(body, $"Control Reported: {answer.ControlReported ?? "N/A"}");
            //    AddParagraph(body, "-------------------------------------");
            //}

            // Save the document
            mainPart.Document.Save();
        }

        memoryStream.Seek(0, SeekOrigin.Begin);

        return File(memoryStream.ToArray(),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "UserAnswersReport.docx");
    }
}


private void AddParagraph(Body body, string text, bool isBold = false, int fontSize = 12)
    {
        var runProperties = new RunProperties();

        // Apply bold formatting if specified
        if (isBold)
        {
            runProperties.AppendChild(new Bold());
        }

        // Set font size
        runProperties.AppendChild(new FontSize { Val = (fontSize * 2).ToString() });

        // Create the Run and Text
        var run = new Run();
        run.AppendChild(runProperties);
        run.AppendChild(new Text(text) { Space = SpaceProcessingModeValues.Preserve });

        // Create the Paragraph and add the Run
        var paragraph = new Paragraph();
        paragraph.AppendChild(run);

        // Add the Paragraph to the Body
        body.AppendChild(paragraph);
    }


}

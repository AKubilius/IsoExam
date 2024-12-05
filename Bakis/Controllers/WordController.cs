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
using Bakis.Data.Models.DTO;

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

    private string getCurrentUserId()
    {
        return User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
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


    [HttpPost("export")]
    public async Task<IActionResult> ExportAnswersToWord([FromBody] ExportRequest exportRequest)
    {
        var risk = exportRequest.Risk;
        var checkedControls = exportRequest.CheckedControls;

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

                // Insert the report title
                AddParagraph(body, "CIS kontrolių atitiktis", isBold: true, fontSize: 16);
                AddParagraph(body, $"Iš viso įgyvendinta:{risk}%", isBold: true, fontSize: 16);

                // Add the checked controls with true values
                AddParagraph(body, "Įgyvendinti:", isBold: true, fontSize: 14);
                foreach (var control in checkedControls.Where(c => c.Value))
                {
                    AddParagraph(body, $"- {control.Key}");
                }

                // Add the checked controls with false values
                AddParagraph(body, "Neįgyvendinti:", isBold: true, fontSize: 14);
                foreach (var control in checkedControls.Where(c => !c.Value))
                {
                    AddParagraph(body, $"- {control.Key}");
                }

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

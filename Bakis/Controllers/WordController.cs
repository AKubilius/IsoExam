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
using Bakis.Data.Models.DTO;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using Document = QuestPDF.Fluent.Document;


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

[HttpPost("export")]
public async Task<IActionResult> ExportAnswersToPdf([FromBody] ExportRequest exportRequest)
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

    var pdfStream = new MemoryStream();
    Document.Create(container =>
    {
        container.Page(page =>
        {
            page.Margin(50); // Add margins around the page
            page.Content().Column(column =>
            {
                // Header Section
                column.Item().Text("Vartotojo informacija")
                    .FontSize(20)
                    .Bold()
                    .AlignCenter();

                column.Item().Element(container =>
                {
                    container.PaddingTop(10).AlignCenter().Text($"Vardas: {user.Name ?? "Nenurodyta"}")
                        .FontSize(14);
                });

                column.Item().Element(container =>
                {
                    container.AlignCenter().Text($"Paštas: {user.Email ?? "Nenurodyta"}")
                        .FontSize(14);
                });

                column.Item().Element(container =>
                {
                    container.AlignCenter().Text($"Pozicija: {user.Position ?? "Nenurodyta"}")
                        .FontSize(14);
                });

                column.Item().Element(container =>
                {
                    container.AlignCenter().Text($"Kompanija: {user.CompanyName ?? "Nenurodyta"}")
                        .FontSize(14);
                });

                // Spacer
                column.Item().Element(container =>
                {
                    container.PaddingTop(10).Text("\n");
                });

                // Main Section Header
                column.Item().Element(container =>
                {
                    container.PaddingTop(10).AlignCenter().Text("CIS kontrolų atitiktis: " + $"{risk}%")
                        .FontSize(18)
                        .Bold();
                });

                // Spacer
                column.Item().Element(container =>
                {
                    container.PaddingTop(10).Text("\n");
                });

                // Implemented Controls Section
                column.Item().Element(container =>
                {
                    container.PaddingTop(20).Text("Parengti dokumentai:")
                        .FontSize(16)
                        .Bold();
                });

                foreach (var control in checkedControls.Where(c => c.Value))
                {
                    column.Item().Text($"- {control.Key}")
                        .FontSize(14);
                }

                // Spacer
                column.Item().Text("\n");

                // Not Implemented Controls Section
                column.Item().Element(container =>
                {
                    container.PaddingTop(20).Text("Neparengti dokumentai")
                        .FontSize(16)
                        .Bold();
                });

                foreach (var control in checkedControls.Where(c => !c.Value))
                {
                    column.Item().Text($"- {control.Key}")
                        .FontSize(14);
                }
            });
        });
    }).GeneratePdf(pdfStream);

    pdfStream.Seek(0, SeekOrigin.Begin);

    return File(pdfStream.ToArray(), "application/pdf", "UserAnswersReport.pdf");
}




}

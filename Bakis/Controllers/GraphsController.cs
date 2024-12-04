using Bakis.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Bakis.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraphsController : ControllerBase
    {

        private readonly ApplicationDbContext _databaseContext;
        private readonly IAuthorizationService _authorizationService;
        public GraphsController(ApplicationDbContext context, IAuthorizationService authorizationService)
        {
            _databaseContext = context;
            _authorizationService = authorizationService;
        }

        // GET: api/Graphs/Companies
        [HttpGet("Companies")]
        public async Task<ActionResult<Dictionary<string, int>>> GetCompanies()
        {
            // Group by CompanyName and get count of each unique value
            var companies = await _databaseContext.Users
                .GroupBy(user => user.CompanyName)
                .Select(group => new { CompanyName = group.Key, Count = group.Count() })
                .ToDictionaryAsync(g => g.CompanyName ?? "Unknown", g => g.Count); // Handle null values

            if (companies.Count == 0)
                return BadRequest("No companies found.");

            return Ok(companies);
        }

        // GET: api/Graphs/Positions
        [HttpGet("Positions")]
        public async Task<ActionResult<Dictionary<string, int>>> GetPositions()
        {
            // Group by Position and get count of each unique value
            var positions = await _databaseContext.Users
                .GroupBy(user => user.Position)
                .Select(group => new { Position = group.Key, Count = group.Count() })
                .ToDictionaryAsync(g => g.Position ?? "Unknown", g => g.Count); // Handle null values

            if (positions.Count == 0)
                return BadRequest("No positions found.");

            return Ok(positions);
        }

    }
}

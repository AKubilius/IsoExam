using Xunit;
using Bakis.Controllers;
using Bakis.Data;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.DependencyInjection;

namespace Bakis.Tests
{
    public class AnswersControllerTests
    {
        private DbContextOptions<ApplicationDbContext> _options;

        public AnswersControllerTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AnswersDatabase")
                .Options;
        }

        private ApplicationDbContext GetInMemoryDbContext()
        {
            var serviceProvider = new ServiceCollection()
                .AddEntityFrameworkInMemoryDatabase()
                .BuildServiceProvider();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase("TestDatabase")
                .UseInternalServiceProvider(serviceProvider);

            return new ApplicationDbContext(optionsBuilder.Options);
        }

        private IAuthorizationService CreateStubAuthorizationService()
        {
            var stubAuthorizationService = new Mock<IAuthorizationService>();
            stubAuthorizationService.Setup(service => service.AuthorizeAsync(
                    It.IsAny<ClaimsPrincipal>(), It.IsAny<object>(), It.IsAny<IEnumerable<IAuthorizationRequirement>>()))
                .ReturnsAsync(AuthorizationResult.Success);

            return stubAuthorizationService.Object;
        }

        [Fact]
        public async Task SubmitExam_UserNotAuthenticated_ReturnsUnauthorized()
        {
            // Arrange
            using (var dbContext = GetInMemoryDbContext())
            {
                var authorizationService = CreateStubAuthorizationService();
                var controller = new AnswersController(dbContext, authorizationService);

                controller.ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext()
                };

                var dto = new SubmitAnswersDto
                {
                    Answers = new List<AnswerDto>()
                };

                // Act
                var result = await controller.SubmitExam(dto);

                // Assert
                Assert.IsType<UnauthorizedObjectResult>(result);
            }
        }

        [Fact]
        public async Task SubmitExam_NullDto_ReturnsBadRequest()
        {
            // Arrange
            using (var dbContext = GetInMemoryDbContext())
            {
                var authorizationService = CreateStubAuthorizationService();
                var controller = new AnswersController(dbContext, authorizationService);

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, "1"),
                };
                var identity = new ClaimsIdentity(claims);
                var claimsPrincipal = new ClaimsPrincipal(identity);

                controller.ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = claimsPrincipal }
                };

                // Act
                var result = await controller.SubmitExam(null);

                // Assert
                Assert.IsType<BadRequestObjectResult>(result);
            }
        }

        [Fact]
        public async Task SubmitExam_EmptyAnswers_ReturnsBadRequest()
        {
            // Arrange
            using (var dbContext = GetInMemoryDbContext())
            {
                var authorizationService = CreateStubAuthorizationService();
                var controller = new AnswersController(dbContext, authorizationService);

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, "1"),
                };
                var identity = new ClaimsIdentity(claims);
                var claimsPrincipal = new ClaimsPrincipal(identity);

                controller.ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = claimsPrincipal }
                };

                var dto = new SubmitAnswersDto
                {
                    Answers = new List<AnswerDto>()
                };

                // Act
                var result = await controller.SubmitExam(dto);

                // Assert
                Assert.IsType<BadRequestObjectResult>(result);
            }
        }

        [Fact]
        public async Task SubmitExam_ValidRequest_ReturnsOk()
        {
            // Arrange
            using (var dbContext = GetInMemoryDbContext())
            {
                var authorizationService = CreateStubAuthorizationService();
                var controller = new AnswersController(dbContext, authorizationService);

                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, "1"),
                };
                var identity = new ClaimsIdentity(claims);
                var claimsPrincipal = new ClaimsPrincipal(identity);

                controller.ControllerContext = new ControllerContext
                {
                    HttpContext = new DefaultHttpContext { User = claimsPrincipal }
                };

                var dto = new SubmitAnswersDto
                {
                    Answers = new List<AnswerDto>
                    {
                        new AnswerDto
                        {
                            QuestionId = 1,
                            PolicyDefined = "Policy defined",
                            ControlImplemented = "Implemented",
                            ControlAutomated = "Automated",
                            ControlReported = "Reported"
                        }
                    }
                };

                // Act
                var result = await controller.SubmitExam(dto);

                // Assert
                Assert.IsType<OkObjectResult>(result);
            }
        }
    }
}

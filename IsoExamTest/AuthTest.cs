using Xunit;
using Moq;
using Bakis.Controllers;
using Bakis.Auth;
using Bakis.Auth.Model;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using Bakis.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Bakis.Tests
{
    public class AuthControllerTests
    {
        private Mock<UserManager<User>> GetMockUserManager()
        {
            var store = new Mock<IUserStore<User>>();
            return new Mock<UserManager<User>>(store.Object, null, null, null, null, null, null, null, null);
        }

        private Mock<IJwtTokenService> GetMockJwtTokenService()
        {
            return new Mock<IJwtTokenService>();
        }

        private Mock<IEmailService> GetMockEmailService()
        {
            return new Mock<IEmailService>();
        }

        [Fact]

        public async Task Register_ValidUser_ReturnsCreatedUser()
        {
            // Arrange
            var mockUserManager = GetMockUserManager();
            var mockJwtTokenService = GetMockJwtTokenService();
            var mockEmailService = GetMockEmailService();

            mockUserManager
     .Setup(um => um.FindByNameAsync(It.IsAny<string>()))
     .ReturnsAsync((User)null); // Simulates no user found

            mockUserManager
                .Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success); // Simulates successful user creation

            mockUserManager
                .Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .Returns(Task.FromResult(IdentityResult.Success)); // Simulates successful user update

            var controller = new AuthController(mockEmailService.Object, mockUserManager.Object, mockJwtTokenService.Object);
            var registerDto = new RegisterUserDto(
                UserName: "testuser",
                Email: "testuser@example.com",
                Password: "Password123!",
                Position: "Developer",
                CompanyName: "TestCorp"
            );

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var userDto = Assert.IsType<UserDto>(createdResult.Value);

            Assert.Equal(registerDto.UserName, userDto.UserName);
            Assert.Equal(registerDto.Email, userDto.Email);
        }


        [Fact]
        public async Task Login_ValidUser_SendsTwoFactorCode()
        {
            // Arrange
            var mockUserManager = GetMockUserManager();
            var mockJwtTokenService = GetMockJwtTokenService();
            var mockEmailService = GetMockEmailService();

            var user = new User { UserName = "testuser", Email = "testuser@example.com" };
            mockUserManager.Setup(um => um.FindByNameAsync(It.IsAny<string>())).ReturnsAsync(user);
            mockUserManager.Setup(um => um.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(true);
            mockUserManager.Setup(um => um.UpdateAsync(It.IsAny<User>())).ReturnsAsync(IdentityResult.Success);

            var controller = new AuthController(mockEmailService.Object, mockUserManager.Object, mockJwtTokenService.Object);
            var loginDto = new LoginDto(UserName: "testuser", Password: "Password123!");

            // Act
            var result = await controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Verification code sent", okResult.Value?.ToString());



            mockEmailService.Verify(es => es.SendEmailAsync(
                user.Email,
                "Your Login Verification Code",
                It.Is<string>(msg => msg.Contains("Your verification code is:"))),
                Times.Once);
        }
    }
}

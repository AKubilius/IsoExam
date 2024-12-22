using Xunit;
using Moq;
using Bakis.Controllers;
using Bakis.Data;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Bakis.Tests
{
    public class UserControllerTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique database name for each test
                .Options;

            return new ApplicationDbContext(options);
        }


        private IAuthorizationService CreateStubAuthorizationService()
        {
            return new Mock<IAuthorizationService>().Object;
        }

        private ClaimsPrincipal CreateFakeUser(string userId)
        {
            var claims = new List<Claim> { new Claim("sub", userId) };
            var identity = new ClaimsIdentity(claims, "TestAuthType");
            return new ClaimsPrincipal(identity);
        }

        [Fact]
        public async Task GetCurrentUserAsync_AuthenticatedUser_ReturnsUser()
        {
            // Arrange
            var userId = "1";
            using var dbContext = GetInMemoryDbContext();
            dbContext.Users.Add(new User
            {
                Id = userId,
                Name = "John",
                Surname = "Doe",
                Email = "john.doe@example.com",
                Position = "Developer",
                CompanyName = "TechCorp",
                BirthDate = new DateTime(1990, 1, 1),
                Age = 33
            });
            await dbContext.SaveChangesAsync();

            var controller = new UserController(dbContext, CreateStubAuthorizationService());
            controller.ControllerContext.HttpContext = new DefaultHttpContext
            {
                User = CreateFakeUser(userId)
            };

            // Act
            var result = await controller.GetCurrentUserAsync();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var user = Assert.IsType<User>(okResult.Value);

            Assert.Equal(userId, user.Id);
            Assert.Equal("John", user.Name);
            Assert.Equal("Doe", user.Surname);
            Assert.Equal("john.doe@example.com", user.Email);
            Assert.Equal("Developer", user.Position);
            Assert.Equal("TechCorp", user.CompanyName);
            Assert.Equal(new DateTime(1990, 1, 1), user.BirthDate);
            Assert.Equal(33, user.Age);
        }

        [Fact]
        public async Task GetUsers_ReturnsUserList()
        {
            // Arrange
            using var dbContext = GetInMemoryDbContext();
            dbContext.Users.AddRange(
                new User { Id = "1", Name = "John", Surname = "Doe", Email = "john.doe@example.com" },
                new User { Id = "2", Name = "Jane", Surname = "Smith", Email = "jane.smith@example.com" }
            );
            await dbContext.SaveChangesAsync();

            var controller = new UserController(dbContext, CreateStubAuthorizationService());

            // Act
            var result = await controller.GetUsers();

            // Assert
            Assert.Equal(2, result.Count);
            Assert.Contains(result, u => u.Email == "john.doe@example.com" && u.Name == "John");
            Assert.Contains(result, u => u.Email == "jane.smith@example.com" && u.Name == "Jane");
        }

        [Fact]
        public async Task UpdateUserAsync_UserExists_UpdatesAndReturnsUser()
        {
            // Arrange
            var userId = "1";
            using var dbContext = GetInMemoryDbContext();
            dbContext.Users.Add(new User
            {
                Id = userId,
                Name = "John",
                Surname = "Doe",
                Email = "john.doe@example.com",
                Position = "Developer",
                CompanyName = "TechCorp"
            });
            await dbContext.SaveChangesAsync();

            var controller = new UserController(dbContext, CreateStubAuthorizationService());

            var updatedUser = new UserProfileDto
            {
                Id = userId,
                Name = "John Updated",
                Surname = "Doe Updated",
                Email = "updated.john@example.com",
                Position = "Senior Developer",
                CompanyName = "UpdatedCorp"
            };

            // Act
            var result = await controller.UpdateUserAsync(updatedUser);

            // Assert
            Assert.Equal("John Updated", result.Name);
            Assert.Equal("Doe Updated", result.Surname);
            Assert.Equal("updated.john@example.com", result.Email);
            Assert.Equal("Senior Developer", result.Position);
            Assert.Equal("UpdatedCorp", result.CompanyName);
        }

        [Fact]
        public async Task Delete_UserExists_DeletesUser()
        {
            // Arrange
            var userId = "1";
            using var dbContext = GetInMemoryDbContext();
            dbContext.Users.Add(new User
            {
                Id = userId,
                Name = "John",
                Surname = "Doe",
                Email = "john.doe@example.com" 
            });
            await dbContext.SaveChangesAsync();

            var controller = new UserController(dbContext, CreateStubAuthorizationService());

            // Act
            var result = await controller.Delete(userId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Null(await dbContext.Users.FindAsync(userId));
        }


        [Fact]
        public async Task Delete_UserDoesNotExist_ThrowsKeyNotFoundException()
        {
            // Arrange
            using var dbContext = GetInMemoryDbContext();
            var controller = new UserController(dbContext, CreateStubAuthorizationService());

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => controller.Delete("1"));
        }
    }
}

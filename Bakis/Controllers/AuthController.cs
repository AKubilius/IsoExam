using Bakis.Auth;
using Bakis.Auth.Model;
using Bakis.Data.Models;
using Bakis.Data.Models.DTO;
using Bakis.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Claims;
using System.Web;

namespace Bakis.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IEmailService _emailService;
        public AuthController(IEmailService emailService, UserManager<User> userManager, IJwtTokenService jwtTokenService)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _emailService = emailService;
        }


        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerUserDto)
        {
            var user = await _userManager.FindByNameAsync(registerUserDto.UserName);
            if (user != null)
                return BadRequest("UserName is Taken");

            var newUser = new User
            {
                Email = registerUserDto.Email,
                Name = registerUserDto.UserName,
                UserName = registerUserDto.UserName,
                Position = registerUserDto.Position,
                CompanyName = registerUserDto.CompanyName,
            };
            var createUserResult = await _userManager.CreateAsync(newUser, registerUserDto.Password);
            if (!createUserResult.Succeeded)
                return BadRequest("Could not create a user.");

            await _userManager.AddToRoleAsync(newUser, Roles.User);

            return CreatedAtAction(nameof(Register), new UserDto(newUser.Id, newUser.UserName, newUser.Email));
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByNameAsync(loginDto.UserName);
            if (user == null)
                return BadRequest("User name or password is invalid.");

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid)
                return BadRequest("User name or password is invalid.");

            // Generate 2FA Code
            var twoFactorCode = GenerateTwoFactorCode();
            user.TwoFactorCode = twoFactorCode; // Assuming your user model has a TwoFactorCode property
            user.TwoFactorExpiry = DateTime.UtcNow.AddMinutes(5); // Assuming your user model has a TwoFactorExpiry property
            await _userManager.UpdateAsync(user);

            // Send the 2FA code to the user's email
            await _emailService.SendEmailAsync(user.Email, "Your Login Verification Code", $"Your verification code is: {twoFactorCode}");

            return Ok(new { Message = "Verification code sent to your email. Please verify to complete login." });
        }

        [HttpPost]
        [Route("verify-2fa")]
        public async Task<ActionResult> VerifyTwoFactorCode(TwoFactorDto twoFactorDto)
        {
            var user = await _userManager.FindByNameAsync(twoFactorDto.UserName);
            if (user == null)
                return BadRequest("Invalid user.");

            // Check if the code matches and is not expired
            if (user.TwoFactorCode != twoFactorDto.Code || user.TwoFactorExpiry < DateTime.UtcNow)
                return BadRequest("Invalid or expired verification code.");

            // Clear the TwoFactorCode and expiry to prevent reuse
            user.TwoFactorCode = null;
            user.TwoFactorExpiry = null;
            await _userManager.UpdateAsync(user);

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id)
    };
            var userIdentity = new ClaimsIdentity(claims, "login");
            var principal = new ClaimsPrincipal(userIdentity);

            await HttpContext.SignInAsync(principal);

            var roles = await _userManager.GetRolesAsync(user);
            bool isAdmin = false;
            foreach (var role in roles)
                if (role == "Admin")
                    isAdmin = true;

            var accessToken = _jwtTokenService.CreateAccessToken(user.UserName, user.Id, roles);

            return Ok(new SuccessfulLoginDto(accessToken, twoFactorDto.UserName, isAdmin));
        }

        private string GenerateTwoFactorCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // Generates a 6-digit code
        }

        
    }
}

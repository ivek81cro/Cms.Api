using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Cms.Api.Models.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Cms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly IConfiguration _config;
    private readonly ILogger<AuthController> _logger;

    public AuthController(
        UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        IConfiguration config,
        ILogger<AuthController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _config = config;
        _logger = logger;
    }

    // POST: /api/auth/register
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // provjera postoji li već korisnik s tim mailom
        var existing = await _userManager.FindByEmailAsync(request.Email);
        if (existing != null)
        {
            return BadRequest(new { error = "Korisnik s tom adresom e-pošte već postoji." });
        }

        var user = new IdentityUser
        {
            UserName = request.Email,
            Email = request.Email,
            EmailConfirmed = true // Automatski potvrdi email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }

            return ValidationProblem(ModelState);
        }

        _logger.LogInformation("New user registered: {Email}", user.Email);

        var tokenString = GenerateJwtToken(user, out var expiresAt);

        return Ok(new AuthResponse
        {
            Token = tokenString,
            Email = user.Email ?? string.Empty,
            ExpiresAt = expiresAt
        });
    }

    // POST: /api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            _logger.LogWarning("Login attempt for non-existent user: {Email}", request.Email);
            return Unauthorized(new { error = "Neispravni podaci za prijavu." });
        }

        _logger.LogInformation("User found: {Email}, EmailConfirmed: {EmailConfirmed}", 
            user.Email, user.EmailConfirmed);

        // Provjera lozinke
        var passwordCheck = await _userManager.CheckPasswordAsync(user, request.Password);
        _logger.LogInformation("Password check result for {Email}: {PasswordCheck}", user.Email, passwordCheck);

        if (!passwordCheck)
        {
            _logger.LogWarning("Invalid password for user: {Email}", request.Email);
            return Unauthorized(new { error = "Neispravni podaci za prijavu." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(
            user, request.Password, lockoutOnFailure: false);

        _logger.LogInformation("SignIn result for {Email} - Succeeded: {Succeeded}, IsLockedOut: {IsLockedOut}, IsNotAllowed: {IsNotAllowed}", 
            user.Email, result.Succeeded, result.IsLockedOut, result.IsNotAllowed);

        if (!result.Succeeded)
        {
            if (result.IsNotAllowed)
            {
                _logger.LogWarning("Sign in not allowed for user: {Email}", request.Email);
                return Unauthorized(new { error = "Prijava nije dozvoljena. Email nije potvrđen." });
            }
            
            return Unauthorized(new { error = "Neispravni podaci za prijavu." });
        }

        _logger.LogInformation("User {Email} logged in successfully", user.Email);

        var tokenString = GenerateJwtToken(user, out var expiresAt);

        return Ok(new AuthResponse
        {
            Token = tokenString,
            Email = user.Email ?? string.Empty,
            ExpiresAt = expiresAt
        });
    }

    private string GenerateJwtToken(IdentityUser user, out DateTime expires)
    {
        var jwtSection = _config.GetSection("Jwt");

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSection["Key"]!));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        // Rok trajanja tokena
        expires = DateTime.UtcNow.AddMinutes(
            double.Parse(jwtSection["ExpiresMinutes"]!));

        var token = new JwtSecurityToken(
            issuer: jwtSection["Issuer"],
            audience: jwtSection["Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

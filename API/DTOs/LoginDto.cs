using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDto
{
    public string Email { get; set; } = default!;
    public string Password { get; set; } = default!;
    public bool RememberMe { get; set; }
}
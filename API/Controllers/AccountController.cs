using System;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized(new ApiResponse(401, "ورود نامعتبر"));
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, true);
            if(result.IsLockedOut) return Unauthorized(new ApiResponse(401, "اکانت به مدت پنج دقیقه مسدود شد"));
            if (!result.Succeeded) return Unauthorized(new ApiResponse(401, "ورود نامعتبر"));
            var userDto = MapAppUserToUserDto(user);
            return Ok(userDto);
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "این ایمیل رزرو شده است" } });
            }

            var appUser = MapRegisterDtoToAppUser(registerDto);
            var result = await _userManager.CreateAsync(appUser, registerDto.Password);
            if (!result.Succeeded) return BadRequest(new ApiValidationErrorResponse());
            var userDto = MapAppUserToUserDto(appUser);
            return userDto;
        }

        [HttpGet("emailexists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        public UserDto MapAppUserToUserDto(AppUser appUser)
        {
            return new UserDto
            {
                Email = appUser.Email,
                Token = _tokenService.CreateToken(appUser),
                DisplayName = appUser.DisplayName
            };
        }

        public AppUser MapRegisterDtoToAppUser(RegisterDto registerDto)
        {
            return new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email,
            };
        }

    }
}

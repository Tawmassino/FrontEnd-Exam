using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ToDo.Api.DTOs;

namespace ToDo.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        /// <summary>
        /// Login existing user
        /// </summary>
        /// <param name="username"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<User>> Login(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound(new ErrorResponse("User not found"));
            }

            if (await _userManager.CheckPasswordAsync(user, password))
            {
                return new User(user);
            }
            else
            {
                return BadRequest(new ErrorResponse("Wrong password"));
            }
        }

        /// <summary>
        /// Register new user
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> Register(UserForRegistration user)
        {
            if (await _userManager.FindByNameAsync(user.UserName) != null)
            {
                return BadRequest(new ErrorResponse($"User already exists with user name {user.UserName}"));
            }

            if (await _userManager.FindByEmailAsync(user.Email) != null)
            {
                return BadRequest(new ErrorResponse($"User already exists with email {user.Email}"));
            }

            var userIdentity = new IdentityUser(user.UserName);
            userIdentity.Email = user.Email;

            var rez = await _userManager.CreateAsync(userIdentity, user.Password);

            if (!rez.Succeeded)
            {
                return BadRequest(new ErrorResponse(string.Join(';', rez.Errors)));
            }
            else
            {
                return Ok();
            }
        }
    }
}

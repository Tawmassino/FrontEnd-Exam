using Microsoft.AspNetCore.Identity;

namespace ToDo.Api.DTOs
{
    public class User : UserForRegistration
    {
        public string? Id { get; set; }

        public User()
        {
        }

        public User(IdentityUser identity): base(identity)
        {
            Id = identity.Id;
        }
    }
}

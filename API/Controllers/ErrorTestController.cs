using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ErrorTestController : ControllerBase
    {
        [HttpGet("exception")]
        public ActionResult GetInternalExceptionError()
        {
            throw new ArgumentException("testing exception error");
        }
    }
}
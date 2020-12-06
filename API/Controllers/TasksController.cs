using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<List<TaskDto>>> GetTasks(string isCompleted, string filter)
        {
            var userId = GetUserIdFromClaims();
            var tasks = await _taskService.GetTasks(userId, isCompleted, filter);
            var tasksDto = new List<TaskDto>();
            foreach (var task in tasks)
            {
                var taskDto = task.MapToTaskDto();
                tasksDto.Add(taskDto);
            }

            return Ok(tasksDto);
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskDto>> GetTask(int id)
        {
            var userId = GetUserIdFromClaims();
            var task = await _taskService.GetTask(userId, id);
            if (task == null)
            {
                return NotFound();
            }

            var taskDto = task.MapToTaskDto();
            return Ok(taskDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<TaskDto>> CreateTask(TaskToCreateDto taskToCreateDto)
        {
            var userId = GetUserIdFromClaims();
            var task = taskToCreateDto.MapToAppTask(userId);
            await _taskService.CreateTask(task);
            var taskDto = task.MapToTaskDto();
            return Ok(taskDto);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<TaskDto>> UpdateTask(int id, TaskToUpdateDto taskToUpdateDto)
        {
            var userId = GetUserIdFromClaims();
            var task = await _taskService.GetTask(userId, id);
            if (task == null)
            {
                return NotFound();
            }

            task = taskToUpdateDto.MapToAppTask(task);
            await _taskService.SaveChanges();
            var taskDto = task.MapToTaskDto();
            return Ok(taskDto);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTask(int id)
        {
            var userId = GetUserIdFromClaims();
            var task = await _taskService.GetTask(userId, id);
            if (task == null)
            {
                return NotFound();
            }

            await _taskService.DeleteTask(task);
            await _taskService.SaveChanges();
            return Ok();
        }

        private string GetUserIdFromClaims()
        {
            ClaimsIdentity claimsIdentity = User.Identity as ClaimsIdentity;
            return claimsIdentity.Claims.FirstOrDefault(x => x.Type == "nameid")?.Value.ToString();
        }
    }
}
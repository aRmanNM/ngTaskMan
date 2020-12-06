using API.Dtos;
using API.Entities;

namespace API.Helpers
{
    public static class Mapper
    {
        public static TaskDto MapToTaskDto(this AppTask appTask)
        {
            return new TaskDto
            {
                Id = appTask.Id,
                Title = appTask.Title,
                Description = appTask.Description,
                IsCompleted = appTask.IsCompleted
            };
        }

        public static AppTask MapToAppTask(this TaskToCreateDto taskToCreateDto, string userId)
        {
            return new AppTask {
                Title = taskToCreateDto.Title,
                Description = taskToCreateDto.Description,
                CreatedAt = taskToCreateDto.CreatedAt,
                IsCompleted = false,
                AppUserId = userId
            };
        }

        public static AppTask MapToAppTask(this TaskToUpdateDto taskToUpdateDto, AppTask task)
        {
            task.Title = taskToUpdateDto.Title;
            task.Description = taskToUpdateDto.Description;
            task.IsCompleted = taskToUpdateDto.IsCompleted;

            return task;
        }
    }
}
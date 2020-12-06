using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;
        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateTask(AppTask task)
        {
            await _context.Tasks.AddAsync(task);
            return await SaveChanges();
        }

        public async Task<int> DeleteTask(AppTask task)
        {
            _context.Remove(task);
            return await SaveChanges();
        }

        public async Task<AppTask> GetTask(string userId, int id)
        {
            return await _context.Tasks
                .Where(t => t.AppUserId == userId).FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<AppTask[]> GetTasks(string userId, string isCompleted, string filter)
        {
            var query = _context.Tasks.Where(t => t.AppUserId == userId);

            query = isCompleted?.ToLower() switch
            {
                "true" => query.Where(t => t.IsCompleted == true),
                "false" => query.Where(t => t.IsCompleted == false),
                _ => query
            };

            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(t => t.Title.Contains(filter));
            }

            return await query.OrderByDescending(t => t.CreatedAt).ToArrayAsync();
        }

        public async Task<int> SaveChanges()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
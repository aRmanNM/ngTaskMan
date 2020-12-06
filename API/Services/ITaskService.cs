using System.Threading.Tasks;
using API.Entities;

namespace API.Services
{
    public interface ITaskService
    {
        Task<AppTask[]> GetTasks(string userId, string isCompleted, string filter);
        Task<AppTask> GetTask(string userId, int id);
        Task<int> CreateTask(AppTask task);
        Task<int> DeleteTask(AppTask task);
        Task<int> SaveChanges();
    }
}
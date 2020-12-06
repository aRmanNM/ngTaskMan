namespace API.Entities
{
    public class TaskStep
    {
        public int Id { get; set; }
        public int TaskId { get; set; }
        public string Title { get; set; }
        public bool IsCompleted { get; set; }
    }
}
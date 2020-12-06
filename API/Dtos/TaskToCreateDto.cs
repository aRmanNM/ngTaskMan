using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Dtos
{
    public class TaskToCreateDto
    {
        public TaskToCreateDto()
        {
            CreatedAt = DateTime.Now;
        }

        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}

namespace Cms.Api.Models
{
    public class Gallery
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? Description { get; set; }

        public List<ImageFile> Images { get; set; } = new();
    }
}

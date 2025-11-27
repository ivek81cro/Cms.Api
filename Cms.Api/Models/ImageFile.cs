namespace Cms.Api.Models
{
    public class ImageFile
    {
        public int Id { get; set; }
        public int GalleryId { get; set; }
        public Gallery Gallery { get; set; } = null!;
        public string FileName { get; set; } = "";
        public string RelativePath { get; set; } = "";
        public int SortOrder { get; set; }
    }
}

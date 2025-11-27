namespace Cms.Api.Models;

public class Article
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Excerpt { get; set; } = "";
    public string ContentHtml { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PublishedAt { get; set; }
    public bool IsPublished { get; set; }

    public int? GalleryId { get; set; }
    public Gallery? Gallery { get; set; }
}


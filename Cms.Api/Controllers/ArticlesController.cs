using Cms.Api.Data;
using Cms.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly AppDbContext _db;

    public ArticlesController(AppDbContext db)
    {
        _db = db;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Article>>> GetAll()
    {
        var articles = await _db.Articles
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

        return Ok(articles);
    }

    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Article>> GetById(int id)
    {
        var article = await _db.Articles
            .Include(a => a.Gallery)
            .ThenInclude(g => g.Images)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (article == null) return NotFound();
        return Ok(article);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Article>> Create([FromBody] Article article)
    {
        article.CreatedAt = DateTime.UtcNow;

        if (article.IsPublished && article.PublishedAt == null)
        {
            article.PublishedAt = DateTime.UtcNow;
        }

        _db.Articles.Add(article);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = article.Id }, article);
    }

    [Authorize]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Article updated)
    {
        var existing = await _db.Articles.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = updated.Title;
        existing.Slug = updated.Slug;
        existing.Excerpt = updated.Excerpt;
        existing.ContentHtml = updated.ContentHtml;

        existing.IsPublished = updated.IsPublished;
        if (updated.IsPublished && existing.PublishedAt == null)
        {
            existing.PublishedAt = DateTime.UtcNow;
        }
        else if (!updated.IsPublished)
        {
            existing.PublishedAt = null;
        }

        existing.GalleryId = updated.GalleryId;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var article = await _db.Articles.FindAsync(id);
        if (article == null) return NotFound();

        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

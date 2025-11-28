using Cms.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Cms.Api.Data;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Gallery> Galleries => Set<Gallery>();
    public DbSet<ImageFile> Images => Set<ImageFile>();
}
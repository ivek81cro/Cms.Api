using Cms.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Servisi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. CORS – najjednostavnije: dozvoli frontend localhost:5173
builder.Services.AddCors();

var app = builder.Build();

// 3. CORS middleware – MORA biti prije MapControllers
app.UseCors(policy =>
    policy
        .WithOrigins("http://localhost:5173") // Vite dev server
        .AllowAnyHeader()
        .AllowAnyMethod()
);

// Swagger i ostalo
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Ako ne koristiš auth, možeš i izostaviti UseAuthorization
// app.UseAuthorization();

app.MapControllers();

app.Run();

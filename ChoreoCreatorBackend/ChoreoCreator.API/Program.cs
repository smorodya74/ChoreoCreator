using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Abstractions;
using ChoreoCreator.DataAccess;
using ChoreoCreator.DataAccess.Repositories;
using ChoreoCreator.DataAccess.Seed;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ChoreoCreatorDbContext>(
    options => 
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(ChoreoCreatorDbContext)));
    });

builder.Services.AddScoped<IScenariosServices, ScenariosServices>();
builder.Services.AddScoped<IScenariosRepository, ScenariosRepository>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();


//using (var scope = app.Services.CreateScope())
//{
//    var db = scope.ServiceProvider.GetRequiredService<ChoreoCreatorDbContext>();

//    db.Database.Migrate();

//    await FakeUserSeeder.SeedAsync(db);
//}

app.Run();

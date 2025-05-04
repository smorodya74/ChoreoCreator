using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Abstractions;
using ChoreoCreator.DataAccess;
using ChoreoCreator.DataAccess.Repositories;
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

app.Run();

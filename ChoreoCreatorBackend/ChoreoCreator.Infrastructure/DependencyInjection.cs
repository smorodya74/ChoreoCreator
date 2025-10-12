using ChoreoCreator.Application.Abstractions;
using ChoreoCreator.Application.Abstractions.Repositories;
using ChoreoCreator.Application.Services;
using ChoreoCreator.Core.Contracts;
using ChoreoCreator.Core.Services;
using ChoreoCreator.DataAccess;
using ChoreoCreator.DataAccess.Repositories;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ChoreoCreator.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddProjectServices(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<ChoreoCreatorDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString(nameof(ChoreoCreatorDbContext))));

        // Application & Domain services
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<UserRegistrationService>();
        services.AddScoped<IUsersRepository, UsersRepository>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IUserPasswordHasher, UserPasswordHasher>();
        services.AddScoped<IUserCollection, UserCollection>();
        services.AddScoped<IScenariosServices, ScenariosServices>();
        services.AddScoped<IScenariosRepository, ScenariosRepository>();

        // MediatR (CQRS)
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<UsersService>());

        // FluentValidation
        services.AddValidatorsFromAssemblyContaining<UsersService>();

        return services;
    }
}
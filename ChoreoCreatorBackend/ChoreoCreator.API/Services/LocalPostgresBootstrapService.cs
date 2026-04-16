using ChoreoCreator.DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ChoreoCreator.API.Services;

public class LocalPostgresBootstrapService : IHostedService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<LocalPostgresBootstrapService> _logger;

    public LocalPostgresBootstrapService(
        IServiceProvider serviceProvider,
        IWebHostEnvironment environment,
        ILogger<LocalPostgresBootstrapService> logger)
    {
        _serviceProvider = serviceProvider;
        _environment = environment;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (!_environment.IsDevelopment() || IsRunningInContainer())
        {
            return;
        }

        if (await CanConnectAsync(cancellationToken))
        {
            return;
        }

        _logger.LogInformation("Postgres is not available locally. Trying to start docker compose service 'postgres'.");

        var started = await TryStartDockerComposePostgresAsync(cancellationToken);
        if (!started)
        {
            return;
        }

        for (var i = 1; i <= 15; i++)
        {
            if (await CanConnectAsync(cancellationToken))
            {
                _logger.LogInformation("Postgres became available after docker compose startup.");
                return;
            }

            await Task.Delay(TimeSpan.FromSeconds(2), cancellationToken);
        }

        _logger.LogWarning("Postgres is still unavailable after docker compose startup attempt.");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task<bool> CanConnectAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ChoreoCreatorDbContext>();
            return await dbContext.Database.CanConnectAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogDebug(ex, "Unable to connect to Postgres.");
            return false;
        }
    }

    private async Task<bool> TryStartDockerComposePostgresAsync(CancellationToken cancellationToken)
    {
        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "docker",
                Arguments = "compose up -d postgres",
                WorkingDirectory = _environment.ContentRootPath,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(startInfo);
            if (process is null)
            {
                _logger.LogWarning("Failed to start docker compose process.");
                return false;
            }

            var stdOut = await process.StandardOutput.ReadToEndAsync(cancellationToken);
            var stdErr = await process.StandardError.ReadToEndAsync(cancellationToken);

            await process.WaitForExitAsync(cancellationToken);

            if (process.ExitCode != 0)
            {
                _logger.LogWarning("docker compose exited with code {ExitCode}. stderr: {StdErr}", process.ExitCode, stdErr);
                return false;
            }

            if (!string.IsNullOrWhiteSpace(stdOut))
            {
                _logger.LogInformation("docker compose output: {StdOut}", stdOut.Trim());
            }

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to run docker compose for postgres startup.");
            return false;
        }
    }

    private static bool IsRunningInContainer()
    {
        var value = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER");
        return string.Equals(value, "true", StringComparison.OrdinalIgnoreCase);
    }
}
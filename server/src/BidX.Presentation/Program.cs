using BidX.DataAccess;
using BidX.DataAccess.Entites;
using BidX.Presentation.Utils;
using BidX.Presentation.Hubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

// Load environment variables from webapi.env file
LoadEnvironmentVariables();

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddAndConfigureApiControllers()
    .AddAndConfigureSwagger()
    .AddAndConfigureDBContext()
    .AddAndConfigureIdentity()
    .AddAndConfigureJwtAuthentication()
    .AddAndConfigureSignalR()
    .AddAndConfigureMediatR()
    .AddAndConfigureQuartz()
    .AddAndConfigureCors(builder.Configuration)
    .AddApplicationServices();

// https://nblumhardt.com/2024/04/serilog-net8-0-minimal
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();


var app = builder.Build();

// Apply Migrations that hasn't been applied and seed roles and admin users
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var appDbContext = services.GetRequiredService<AppDbContext>();
        await appDbContext.Database.MigrateAsync();

        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<int>>>();
        await roleManager.SeedRoles();

        var userManager = services.GetRequiredService<UserManager<User>>();
        await userManager.SeedAdminAccounts();

        await appDbContext.SeedCities();
        await appDbContext.SeedCategories();
    }
    catch (Exception ex)
    {
        Log.Error(ex.ToString());
    }
}

app.UseExceptionHandler(o => { }); // i added o=>{} due to a bug in .NET8 see this issue for more info ttps://github.com/dotnet/aspnetcore/issues/51888

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowFrontendDomain");

app.UseAuthentication(); // Validates the Token came at the request's Authorization header then decode it and assign it to HttpContext.User

app.UseAuthorization();

app.MapControllers();

app.MapHub<Hub>("/hub");

app.Run();

static void LoadEnvironmentVariables()
{
    // Try different paths to find the webapi.env file
    var possiblePaths = new[]
    {
        Path.Combine(Directory.GetCurrentDirectory(), "..", "webapi.env"),
        Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "webapi.env"),
        Path.Combine(Directory.GetCurrentDirectory(), "webapi.env"),
        @"D:\My Project\sim-card-auction-website\server\webapi.env"
    };

    string? envFilePath = null;
    foreach (var path in possiblePaths)
    {
        if (File.Exists(path))
        {
            envFilePath = path;
            break;
        }
    }

    if (envFilePath != null)
    {
        foreach (var line in File.ReadAllLines(envFilePath))
        {
            if (string.IsNullOrWhiteSpace(line) || line.StartsWith("#"))
                continue;

            var parts = line.Split('=', 2);
            if (parts.Length == 2)
            {
                var key = parts[0].Trim();
                var value = parts[1].Trim();
                Environment.SetEnvironmentVariable(key, value);
            }
        }
    }
}

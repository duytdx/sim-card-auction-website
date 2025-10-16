using BidX.DataAccess.Entites;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BidX.DataAccess;

public static class AppDbInitializer
{
    public static async Task SeedRoles(this RoleManager<IdentityRole<int>> roleManager)
    {
        if (!await roleManager.Roles.AnyAsync())
        {
            await roleManager.CreateAsync(new IdentityRole<int>("Admin"));
            await roleManager.CreateAsync(new IdentityRole<int>("User"));
        }
    }

    public static async Task SeedAdminAccounts(this UserManager<User> userManager)
    {
        var email = Environment.GetEnvironmentVariable("BIDX_ADMIN_EMAIL");
        var password = Environment.GetEnvironmentVariable("BIDX_ADMIN_PASSWORD");

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return; // Skip seeding if admin credentials are not configured
        }

        if (await userManager.FindByEmailAsync(email) == null)
        {
            var admin = new User
            {
                FirstName = "BidX",
                LastName = "Admin",
                UserName = email,
                Email = email
            };
            await userManager.CreateAsync(admin, password!);
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
    public static async Task SeedCities(this AppDbContext appDbContext)
    {
        if (!await appDbContext.Cities.AnyAsync())
        {
            // List of Egyptian governorates
            var egyptianGovernorates = new List<City>{
                new() { Name = "Cairo" },
                new() { Name = "Alexandria" },
                new() { Name = "Giza" },
                new() { Name = "Qalyubia" },
                new() { Name = "Port Said" },
                new() { Name = "Suez" },
                new() { Name = "Dakahlia" },
                new() { Name = "Sharkia" },
                new() { Name = "Kafr El Sheikh" },
                new() { Name = "Gharbia" },
                new() { Name = "Monufia" },
                new() { Name = "Beheira" },
                new() { Name = "Ismailia" },
                new() { Name = "Giza" },
                new() { Name = "Beni Suef" },
                new() { Name = "Faiyum" },
                new() { Name = "Minya" },
                new() { Name = "Asyut" },
                new() { Name = "Sohag" },
                new() { Name = "Qena" },
                new() { Name = "Aswan" },
                new() { Name = "Luxor" },
                new() { Name = "Red Sea" },
                new() { Name = "New Valley" },
                new() { Name = "Matrouh" },
                new() { Name = "North Sinai" },
                new() { Name = "South Sinai" }
            };

            await appDbContext.Cities.AddRangeAsync(egyptianGovernorates);

            await appDbContext.SaveChangesAsync();
        }
    }

    public static async Task SeedCategories(this AppDbContext appDbContext)
    {
        var desiredCategories = new List<Category>()
        {
            new() { Name = "Sim Tu Quy", IconUrl = "/icons/sim-tu-quy.svg", IsDeleted = false },
            new() { Name = "Sim Loc Phat", IconUrl = "/icons/sim-loc-phat.svg", IsDeleted = false },
            new() { Name = "Sim Gia Re", IconUrl = "/icons/sim-gia-re.svg", IsDeleted = false },
            new() { Name = "Sim Taxi", IconUrl = "/icons/sim-taxi.svg", IsDeleted = false },
            new() { Name = "Sim Nam Sinh", IconUrl = "/icons/sim-nam-sinh.svg", IsDeleted = false },
            new() { Name = "Sim VIP", IconUrl = "/icons/sim-classic.svg", IsDeleted = false }
        };

        var existingCategories = await appDbContext.Categories
            .OrderBy(c => c.Id)
            .ToListAsync();

        for (var index = 0; index < desiredCategories.Count; index++)
        {
            var desired = desiredCategories[index];

            if (index < existingCategories.Count)
            {
                var current = existingCategories[index];
                current.Name = desired.Name;
                current.IconUrl = desired.IconUrl;
                current.IsDeleted = false;
            }
            else
            {
                appDbContext.Categories.Add(new Category
                {
                    Name = desired.Name,
                    IconUrl = desired.IconUrl,
                    IsDeleted = false
                });
            }
        }

        for (var index = desiredCategories.Count; index < existingCategories.Count; index++)
        {
            existingCategories[index].IsDeleted = true;
        }

        await appDbContext.SaveChangesAsync();
    }
}

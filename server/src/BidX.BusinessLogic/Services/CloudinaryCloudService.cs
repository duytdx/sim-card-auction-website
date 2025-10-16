using System.IO;
using System.Net;
using System.Xml.Linq;
using BidX.BusinessLogic.DTOs.CloudDTOs;
using BidX.BusinessLogic.DTOs.CommonDTOs;
using BidX.BusinessLogic.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FileTypeChecker.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace BidX.BusinessLogic.Services;

public class CloudinaryCloudService : ICloudService
{
    private const string ThumbnailCropMode = "fill";
    private const string ProductImageCropMode = "fit";
    private const string LocalUploadsFolderName = "uploads";
    private const string LocalIconsFolderName = "icons";
    private const string LocalImagesFolderName = "images";

    private readonly (int Width, int Height) thumbnailSize;
    private readonly (int Width, int Height) productImageSize;
    private readonly int maxIconSizeAllowed;
    private readonly int maxImageSizeAllowed;
    private readonly Cloudinary? cloudinary;
    private readonly bool isConfigured;
    private readonly string? localIconsPath;
    private readonly string? localImagesPath;
    private readonly ILogger<CloudinaryCloudService> logger;
    private readonly string? webRootPath;

    public CloudinaryCloudService(ILogger<CloudinaryCloudService> logger, IConfiguration configuration, IHostEnvironment hostEnvironment)
    {
        this.logger = logger;
        webRootPath = Path.Combine(hostEnvironment.ContentRootPath, "wwwroot");

        var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUDNAME");
        var apiKey = Environment.GetEnvironmentVariable("CLOUDINARY_APIKEY");
        var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_APISECRET");

        if (string.IsNullOrWhiteSpace(cloudName) || string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(apiSecret))
        {
            isConfigured = false;
            var uploadsRoot = Path.Combine(webRootPath ?? Directory.GetCurrentDirectory(), LocalUploadsFolderName);
            localIconsPath = Path.Combine(uploadsRoot, LocalIconsFolderName);
            localImagesPath = Path.Combine(uploadsRoot, LocalImagesFolderName);
            Directory.CreateDirectory(localIconsPath);
            Directory.CreateDirectory(localImagesPath);
            this.logger.LogWarning("Cloudinary credentials are not configured. Falling back to local storage at {UploadsRoot}.", uploadsRoot);
        }
        else
        {
            cloudinary = new Cloudinary(new Account(cloudName, apiKey, apiSecret));
            cloudinary.Api.Secure = true;
            isConfigured = true;
        }

        if (!int.TryParse(configuration["images:MaxIconSizeAllowed"], out maxIconSizeAllowed))
            maxIconSizeAllowed = 256 * 1024; //256 KB

        if (!int.TryParse(configuration["images:MaxImageSizeAllowed"], out maxImageSizeAllowed))
            maxImageSizeAllowed = 1 * 1024 * 1024; //1 MB

        if (!int.TryParse(configuration["images:ThumbnailWidth"], out thumbnailSize.Width) || !int.TryParse(configuration["images:ThumbnailHeight"], out thumbnailSize.Height))
        {
            thumbnailSize.Width = 200; //200 PX
            thumbnailSize.Height = 200; //200 PX
        }

        if (!int.TryParse(configuration["images:ProductImageWidth"], out productImageSize.Width) || !int.TryParse(configuration["images:ProductImageHeight"], out productImageSize.Height))
        {
            productImageSize.Width = 800; //800 PX
            productImageSize.Height = 800; //800 PX
        }
    }

    public async Task<Result<UploadResponse>> UploadSvgIcon(Stream icon)
    {
        var validationResult = ValidateIcon(icon);

        if (!validationResult.Succeeded)
            return Result<UploadResponse>.Failure(validationResult.Error!);

        if (!isConfigured)
        {
            var localResponse = await SaveToLocal(icon, localIconsPath!, ".svg");
            return Result<UploadResponse>.Success(localResponse);
        }

        var response = await UploadIcon(icon);

        return Result<UploadResponse>.Success(response);
    }

    public async Task<Result<UploadResponse>> UploadThumbnail(Stream image)
    {
        var validationResult = ValidateImage(image);

        if (!validationResult.Succeeded)
            return Result<UploadResponse>.Failure(validationResult.Error!);

        if (!isConfigured)
        {
            var extension = GetImageExtension(image);
            var localResponse = await SaveToLocal(image, localImagesPath!, extension);
            return Result<UploadResponse>.Success(localResponse);
        }

        var response = await UploadImage(image, thumbnailSize, ThumbnailCropMode);

        return Result<UploadResponse>.Success(response);
    }

    public async Task<Result<UploadResponse[]>> UploadImages(IEnumerable<Stream> images)
    {
        foreach (var image in images)
        {
            var validationResult = ValidateImage(image);
            if (!validationResult.Succeeded)
                return Result<UploadResponse[]>.Failure(validationResult.Error!);
        }

        if (!isConfigured)
        {
            var responses = new List<UploadResponse>();
            foreach (var image in images)
            {
                var extension = GetImageExtension(image);
                var localResponse = await SaveToLocal(image, localImagesPath!, extension);
                responses.Add(localResponse);
            }

            return Result<UploadResponse[]>.Success(responses.ToArray());
        }

        var uploadTasks = images.Select(image => UploadImage(image, productImageSize, ProductImageCropMode));

        var response = await Task.WhenAll(uploadTasks);

        return Result<UploadResponse[]>.Success(response);
    }


    private async Task<UploadResponse> UploadIcon(Stream icon)
    {
        if (cloudinary is null)
            throw new InvalidOperationException("Cloudinary is not configured.");

        var imageId = Guid.NewGuid();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(imageId.ToString(), icon),
            PublicId = imageId.ToString()
        };

        var uploadResult = await cloudinary.UploadAsync(uploadParams);
        if (uploadResult.StatusCode != HttpStatusCode.OK)
            throw new Exception($"Upload failed for an svg icon: {uploadResult.Error.Message}");

        var response = new UploadResponse
        {
            FileId = imageId,
            FileUrl = uploadResult.SecureUrl.ToString(),
        };

        return response;
    }

    private async Task<UploadResponse> UploadImage(Stream image, (int Width, int Height) imageSize, string cropMode)
    {
        if (cloudinary is null)
            throw new InvalidOperationException("Cloudinary is not configured.");

        var imageId = Guid.NewGuid();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(imageId.ToString(), image),
            PublicId = imageId.ToString(),
            Transformation = new Transformation().Width(imageSize.Width).Height(imageSize.Height).Crop(cropMode).Quality("auto"),
            Format = "jpg"
        };

        var uploadResult = await cloudinary.UploadAsync(uploadParams);
        if (uploadResult.StatusCode != HttpStatusCode.OK)
            throw new Exception($"Upload failed for an image: {uploadResult.Error.Message}");

        var response = new UploadResponse
        {
            FileId = imageId,
            FileUrl = uploadResult.SecureUrl.ToString(),
        };

        return response;
    }

    private Result ValidateIcon(Stream icon)
    {
        if (icon.Length > maxIconSizeAllowed || icon.Length <= 0)
            return Result.Failure(ErrorCode.UPLOADED_FILE_INVALID, [$"The icon size must not exceed {maxIconSizeAllowed / 1024} KB."]);

        if (!IsSvgFile(icon))
            return Result.Failure(ErrorCode.UPLOADED_FILE_INVALID, ["The only icon format supported is SVG."]);

        return Result.Success();
    }

    private Result ValidateImage(Stream image)
    {
        if (image.Length > maxImageSizeAllowed || image.Length <= 0)
            return Result.Failure(ErrorCode.UPLOADED_FILE_INVALID, [$"There is an image exceeds the maximum size limit of {maxImageSizeAllowed / 1024} KB."]);

        if (!IsImageFile(image))
            return Result.Failure(ErrorCode.UPLOADED_FILE_INVALID, ["There is an image in an invalid format."]);

        return Result.Success();
    }

    private static bool IsSvgFile(Stream stream)
    {
        try
        {
            stream.Position = 0;
            var doc = XDocument.Load(stream); // Try to load the stream as XML
            stream.Position = 0; // Reset stream position again for further processing if needed

            // Ensure it contains <svg> root element
            return doc.Root?.Name.LocalName == "svg";
        }
        catch
        {
            // If loading as XML fails, it's not a valid SVG
            stream.Position = 0;
            return false;
        }
    }

    private static bool IsImageFile(Stream stream)
    {
        stream.Position = 0;

        var isImage = stream.IsImage();

        // Reset stream position again for further processing otherwise cloudinary will response with "invalid image type." error
        stream.Position = 0;

        return isImage;
    }

    private static string GetImageExtension(Stream stream)
    {
        stream.Position = 0;
        Span<byte> header = stackalloc byte[8];
        var bytesRead = stream.Read(header);
        stream.Position = 0;

        if (bytesRead >= 3 && header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF)
            return ".jpg";

        if (bytesRead >= 8 && header[0] == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47 && header[4] == 0x0D && header[5] == 0x0A && header[6] == 0x1A && header[7] == 0x0A)
            return ".png";

        if (bytesRead >= 3 && header[0] == 0x47 && header[1] == 0x49 && header[2] == 0x46)
            return ".gif";

        return ".jpg";
    }

    private async Task<UploadResponse> SaveToLocal(Stream source, string targetDirectory, string extension)
    {
        var fileId = Guid.NewGuid();
        var fileName = fileId + extension;
        var destinationPath = Path.Combine(targetDirectory, fileName);

        source.Position = 0;
        await using (var fileStream = File.Create(destinationPath))
        {
            await source.CopyToAsync(fileStream);
        }
        source.Position = 0;

        var relativeUrl = $"/{LocalUploadsFolderName}/{Path.GetFileName(targetDirectory)}/{fileName}".Replace("\\", "/");

        return new UploadResponse
        {
            FileId = fileId,
            FileUrl = relativeUrl,
        };
    }
}

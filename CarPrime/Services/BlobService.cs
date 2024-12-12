using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using CarPrime.Configurations;
using Microsoft.Extensions.Options;

namespace CarPrime.Services;

public class BlobService(IOptions<BlobSettings> settings) : IBlobService
{ 
    private readonly string _connectionString = settings.Value.ConnectionString;
    private const string ContainerName = "photos";
    public async Task<List<String>> SavePhotos(List<IFormFile> images,int leaseId)
    {
        if (!images.Any())
        {
            throw new Exception("no images sent");
        }

        var imagePaths = new List<String>();
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);

        foreach (IFormFile image in images)
        {
            if (image.Length <= 0) continue;
            var fileName = $"{leaseId}_{Path.GetFileName(image.FileName)}";
            imagePaths.Add(fileName);
            var blobClient = containerClient.GetBlobClient(fileName);
            await using var stream = image.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);
        }

        return imagePaths;
    }

    public List<String> GetPhotos(List<string> photoPaths)
    {
        var blobServiceClient = new BlobServiceClient(_connectionString);
        var containerClient = blobServiceClient.GetBlobContainerClient(ContainerName);
        var photoUrls = new List<string>();
        foreach (string path in photoPaths)
        {
            var blobClient = containerClient.GetBlobClient(path);
            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = ContainerName,
                BlobName = path,
                ExpiresOn = DateTimeOffset.UtcNow.AddHours(1)
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);
            var sasToken = blobClient.GenerateSasUri(sasBuilder).Query;
            photoUrls.Add(blobClient.Uri + sasToken);
        }
        return photoUrls;
    }
}
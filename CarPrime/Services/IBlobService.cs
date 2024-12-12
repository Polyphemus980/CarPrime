namespace CarPrime.Services;

public interface IBlobService
{
    public Task<List<string>> SavePhotos(List<IFormFile> images,int leaseId);
    public List<String> GetPhotos(List<string> photoPaths);
}
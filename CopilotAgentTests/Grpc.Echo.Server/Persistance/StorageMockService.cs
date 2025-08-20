namespace Grpc.Echo.Server.Persistance;

public interface IStorageMockService
{
    Task<string> GetAsync(string key, CancellationToken cancellationToken = default);
    Task SetAsync(string key, string value, CancellationToken cancellationToken = default);
}

public class StorageMockService : IStorageMockService
{
    public async Task<string> GetAsync(string key, CancellationToken cancellationToken = default)
    {
        await Task.Delay(500, cancellationToken);
        return $"Value for {key}";
    }

    public async Task SetAsync(string key, string value, CancellationToken cancellationToken = default)
    {
        await Task.Delay(500, cancellationToken);
    }
}

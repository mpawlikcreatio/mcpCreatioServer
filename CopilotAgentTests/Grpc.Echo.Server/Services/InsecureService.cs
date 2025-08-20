using Grpc.Core;
using Grpc.Echo.Server.Persistance;

namespace Grpc.Echo.Server.Services;

public class InsecureService(ILogger<InsecureService> logger, IStorageMockService storage) : Insecure.InsecureBase
{
    private readonly ILogger<InsecureService> _logger = logger;
    private readonly IStorageMockService _storage = storage;

    public override async Task<RecordResponse> GetRecord(GetRecordRequest request, ServerCallContext context)
    {
        var headers = context.RequestHeaders;
        var userId = headers.GetValue("x-impersonate") ?? headers.GetValue("x-user-id") ?? "anonymous";

        var authHeader = headers.GetValue("authorization");
        if (!string.IsNullOrEmpty(authHeader))
            _logger.LogWarning("Authorization header from client: {Auth}", authHeader);

        var key = $"{userId}:{request.Name}";
        var value = await _storage.GetAsync(key, context.CancellationToken);

        await context.WriteResponseHeadersAsync(
        [
            new Metadata.Entry("x-echo-user", userId),
            new Metadata.Entry("x-server-version", "dev-insecure")
        ]);

        _logger.LogInformation("GetAsync returned for key {Key}: {Value}", key, value);
        return new RecordResponse { Message = $"Hello {request.Name}, stored value: {value}" };
    }

    public override async Task<RecordResponse> SetRecord(SetRecordRequest request, ServerCallContext context)
    {
        var id = new Random().Next().ToString();
        var userId = context.RequestHeaders.GetValue("x-user-id") ?? "anonymous";
        var key = $"{userId}:{request.Name}:{id}";

        await _storage.SetAsync(key, request.Value, context.CancellationToken);

        if (!string.IsNullOrWhiteSpace(request.Path))
        {
            Directory.CreateDirectory(Path.GetDirectoryName(request.Path)!);
            await File.WriteAllTextAsync(request.Path, request.Value ?? string.Empty, context.CancellationToken);
            _logger.LogWarning("Wrote request.Value to disk at {Path}", request.Path);
        }

        return new RecordResponse { Message = $"Saved under key {key}" };
    }
}

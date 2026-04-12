# OWASP Top 10 (2021)

Reference for security review of code changes.

## A01: Broken Access Control
- Violation of least privilege
- Bypassing access control checks by modifying URL or UI
- Insecure direct object references (IDOR)
- Missing access controls for POST/PUT/DELETE

## A02: Cryptographic Failures
- Transmitting sensitive data in clear text
- Using weak/deprecated algorithms (MD5, SHA1)
- Hardcoded secrets in source code
- Missing encryption for sensitive data at rest

## A03: Injection
- SQL injection via string concatenation
- Command injection via shell execution
- NoSQL, ORM, LDAP injection
- XSS via unsanitized user input in HTML/JS

## A04: Insecure Design
- Missing threat modeling
- No rate limiting on sensitive operations
- Business logic flaws

## A05: Security Misconfiguration
- Default credentials unchanged
- Unnecessary features enabled
- Error messages exposing stack traces
- Missing security headers

## A06: Vulnerable Components
- Outdated dependencies with known CVEs
- Unmaintained libraries
- No SBOM or dependency scanning

## A07: Authentication Failures
- Weak password policies
- No MFA on sensitive accounts
- Session fixation vulnerabilities
- Credential stuffing susceptibility

## A08: Software and Data Integrity Failures
- Insecure deserialization
- Unsigned updates/plugins
- Dependency confusion attacks

## A09: Security Logging Failures
- No audit logging for sensitive operations
- Insufficient log detail for incident response
- Logs containing sensitive data

## A10: Server-Side Request Forgery (SSRF)
- Accepting user-supplied URLs for server requests
- No validation/allowlist for outbound requests
- Cloud metadata service access from application

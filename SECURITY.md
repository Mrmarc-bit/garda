# SECURITY.md — GARDA-SIM AI
## Security Engineering, Secure Development, and Operational Assurance Standard

**Project:** GARDA-SIM AI — AI-Assisted Cyber Defense Response Simulator  
**Document status:** Project security baseline / implementation requirements  
**Applies to:** Web frontend, backend APIs, database, AI integrations, simulation engine, background jobs, CI/CD, deployment, documentation, and supporting infrastructure  
**Security posture:** Defensive simulation only; no real-world containment or production/OT control  
**Owner:** Project maintainer / designated security owner  
**Review cadence:** At least every release and after material architecture, dependency, threat, or incident changes

> **Important:** No document can make a site “100% secure.” This file defines verifiable controls, implementation requirements, and release gates. Security must be demonstrated through code review, tests, configuration review, dependency analysis, and operational evidence. Do not claim compliance or certification merely because these controls are documented.

---

## 1. Purpose and security objectives

This document establishes the minimum security requirements for designing, implementing, testing, deploying, and maintaining GARDA-SIM AI.

The goals are to:

1. Protect account credentials, sessions, application data, experiment records, configuration, and secrets.
2. Prevent unauthorized access, privilege escalation, injection, data exposure, and abuse of application workflows.
3. Keep the AI explanation layer separate from authoritative simulation calculations and deterministic safety enforcement.
4. Ensure every incident scenario, topology, log, and response action remains simulated unless a separately reviewed integration is explicitly authorized.
5. Make important actions traceable through trustworthy audit events.
6. Minimize the attack surface and use least privilege by default.
7. Provide reproducible security checks and a documented response process.
8. Avoid unsupported claims of security, standards compliance, or test coverage.

## 2. Standards and guidance alignment

Use the following as reference frameworks. Select the applicable controls for the project scope and record deviations; do not claim formal certification without an independent assessment.

- **OWASP ASVS** — use a version pinned in the project security review as the application security verification checklist. Target a risk-appropriate level, normally Level 2 for an authenticated application handling security-sensitive decision-support data, subject to scope and assessment.
- **OWASP Top 10** — use as a broad awareness taxonomy, not as a complete test plan.
- **OWASP API Security Top 10** — apply to authentication, authorization, resource consumption, object-level access, and API inventory.
- **OWASP Cheat Sheet Series** — use relevant guidance for sessions, authentication, authorization, CSRF, SSRF, secrets, logging, file uploads, and input validation.
- **NIST Secure Software Development Framework (SSDF), SP 800-218** — integrate security into planning, development, build, release, and vulnerability response.
- **NIST Cybersecurity Framework (CSF)** — use as a high-level structure for Govern, Identify, Protect, Detect, Respond, and Recover.
- **CIS Controls / CIS Benchmarks** — apply appropriate host, container, database, and cloud hardening guidance for the chosen deployment platform.
- **ISO/IEC 27001 and 27002** — use as information-security management and control references where relevant; documentation alone does not establish certification.
- **SLSA and software supply-chain guidance** — improve build provenance, artifact integrity, and dependency trust when CI/CD maturity permits.
- **WCAG 2.2** — accessibility is not a substitute for security, but secure flows must remain usable and understandable.

At project start, record the exact editions/versions used in a security review log. Verify current editions from the official publishers before claiming alignment. If guidance conflicts with a legal requirement or platform constraint, document the decision and obtain appropriate review.

## 3. Scope and assumptions

### In scope

- Browser-based frontend and client-side state.
- Backend APIs and business logic.
- Identity, authentication, sessions, and authorization.
- PostgreSQL and database migrations.
- AI provider adapters and model outputs.
- Simulation and deterministic policy engine.
- File import/export and report generation, if implemented.
- Logging, audit trail, metrics, and error reporting.
- Secrets, configuration, deployment, CI/CD, dependencies, and containers.
- Administrator and maintenance workflows.

### Security assumptions

- The application may be deployed on a public network.
- Users may intentionally or unintentionally submit malicious input.
- AI output, imported files, synthetic logs, and external API responses are untrusted.
- Browser-side validation can be bypassed.
- A valid login does not imply permission to access every resource.
- A model response is not inherently truthful, safe, or schema-compliant.
- The simulation is not a real-world cyber defense control plane.

### Out of scope unless separately approved

- Direct integration with production security systems, military systems, industrial control systems, or operational technology.
- Real containment, isolation, shutdown, remediation, or command execution against external systems.
- Penetration testing of systems that the project owner does not own or have explicit written authorization to test.
- Formal certification, legal opinions, or guarantees of complete security.

Any proposed change to these boundaries requires explicit approval, a threat model update, and a separate security review before implementation.

## 4. Security ownership and risk handling

Assign a named project security owner before production deployment. In a student or small-team project, the maintainer may hold this role, but high-risk changes should receive independent review where possible.

Maintain:
- A security issue register.
- A dependency and vulnerability remediation log.
- A threat model and data-flow diagram.
- A record of security-relevant architectural decisions.
- A release security checklist.
- An incident-response contact and escalation procedure.

Classify findings using a recognized severity model such as CVSS, supplemented by exploitability, exposure, data sensitivity, and business impact.

Suggested response targets, adjusted for actual severity and capacity:

| Severity | Example | Expected handling |
|---|---|---|
| Critical | Remote code execution, authentication bypass, broad sensitive-data exposure | Stop release; isolate affected service if deployed; immediate triage |
| High | Cross-user data access, privilege escalation, exploitable SSRF or injection | Block release until fixed or formally risk-accepted with compensating controls |
| Medium | Limited authorization gap, meaningful misconfiguration, exploitable resource abuse | Prioritize fix before release where practical; document temporary mitigation |
| Low | Defense-in-depth gap with limited impact | Track and fix according to risk |
| Informational | Hardening recommendation | Review and record decision |

Do not downgrade a finding solely to meet a release deadline. Risk acceptance must identify the owner, rationale, compensating controls, expiry/review date, and affected release.

## 5. Threat model

### Assets to protect

- User identities, password hashes, sessions, reset tokens, and access grants.
- Synthetic incident records, evidence, timelines, topology, and experiments.
- Evaluation metrics, strategy comparisons, reports, and audit history.
- AI provider credentials and other secrets.
- Database contents, backups, encryption keys, and deployment credentials.
- Source code, dependencies, build artifacts, and CI/CD permissions.
- Integrity of simulation calculations and safety-policy decisions.

### Trust boundaries

1. Browser ↔ application API.
2. Public/unauthenticated user ↔ authenticated user.
3. User ↔ administrator.
4. Frontend ↔ backend domain services.
5. Backend ↔ database.
6. Backend ↔ AI provider or other external service.
7. Uploaded/imported content ↔ trusted application logic.
8. Application ↔ build/deployment infrastructure.
9. AI-generated recommendations ↔ deterministic policy engine.
10. Synthetic simulation environment ↔ real-world systems.

The tenth boundary must remain closed for the current product.

### Primary threats

- Broken access control and insecure direct object references (IDOR/BOLA).
- Account takeover, credential stuffing, weak reset flows, session theft.
- SQL injection, command injection, cross-site scripting, CSRF, SSRF, and unsafe deserialization.
- AI prompt injection through user input, imported logs, evidence, or external content.
- AI output manipulation, schema abuse, hallucinated evidence, and policy bypass.
- Exposure of API keys, passwords, personal data, or sensitive logs.
- Resource exhaustion through expensive simulations, oversized payloads, or AI calls.
- Dependency compromise, vulnerable packages, poisoned build artifacts, and leaked CI credentials.
- Misconfigured CORS, cookies, TLS, security headers, database exposure, or container permissions.
- Audit-log tampering, deletion, spoofing, or leakage of sensitive values.
- Unsafe report/file generation and path traversal.
- Race conditions, replay, duplicate jobs, or inconsistent authorization during asynchronous workflows.

Review the threat model whenever a new route, integration, data type, role, background job, or deployment boundary is introduced.

## 6. Secure design principles

- **Deny by default:** no access unless explicitly granted.
- **Least privilege:** users, services, database accounts, and CI jobs receive only required permissions.
- **Server-side enforcement:** security decisions are made on the server, not trusted from client state.
- **Defense in depth:** combine validation, authorization, policy checks, safe defaults, monitoring, and tests.
- **Fail safely:** unexpected errors must not disclose secrets or allow a prohibited operation.
- **Secure defaults:** production configuration must be secure without relying on optional manual steps.
- **Explicit trust boundaries:** treat external data and model output as untrusted.
- **Data minimization:** collect and retain only what is needed.
- **Separation of duties:** administrative privileges and deployment credentials must be limited.
- **Reproducibility:** important security checks and simulation results should be testable and repeatable.
- **No security by obscurity:** do not rely on hidden URLs, minified code, or frontend-only controls.
- **Human review:** AI recommendations are advisory and must not trigger real-world actions.

## 7. Authentication and account security

Implement authentication using a mature, maintained framework or identity provider wherever feasible. Avoid custom cryptography and custom authentication protocols.

### Passwords

If password authentication is implemented:

- Use a modern password hashing function supported by a maintained library, preferably Argon2id; use a suitable, reviewed alternative if platform constraints require it.
- Never store plaintext passwords or reversibly encrypted passwords.
- Use unique salts handled by the hashing library.
- Set and periodically review the work factor based on deployment capacity and current guidance.
- Permit long passphrases and password managers.
- Do not impose arbitrary composition rules that encourage predictable passwords.
- Reject known-compromised passwords where a privacy-preserving integration is available.
- Rate-limit login, registration, password-reset, and verification attempts.
- Return generic login/reset responses that do not reveal whether an account exists.
- Never log passwords, reset tokens, or authentication headers.

### Multi-factor authentication

- Support MFA for administrators and privileged accounts when the chosen identity stack supports it.
- Prefer phishing-resistant methods such as passkeys/WebAuthn where practical.
- Protect recovery and factor-reset flows as carefully as login.
- Do not treat email possession alone as strong MFA.

### Password reset and account verification

- Use cryptographically random, single-use, time-limited tokens.
- Store only a secure hash of reset tokens where feasible.
- Invalidate a token after successful use.
- Avoid revealing account existence.
- Apply rate limits and audit security-relevant events.
- Revoke or rotate sessions after password reset when appropriate.
- Use short-lived, single-use verification links.

### Session management

- Use a well-maintained session implementation.
- Regenerate session identifiers after login and privilege changes.
- Invalidate sessions on logout and relevant account-security events.
- Set session expiry based on risk and usability.
- Protect session cookies with `Secure`, `HttpOnly`, and an appropriate `SameSite` policy.
- Never store session identifiers or long-lived access tokens in `localStorage`.
- Do not place tokens in URLs.
- Protect cookie-based state-changing requests against CSRF.
- Require reauthentication for sensitive account and administrative changes when appropriate.

If using an external identity provider, validate issuer, audience, signature, expiry, nonce, redirect URI, and required claims according to the chosen protocol. Do not trust a client-supplied user ID or role.

## 8. Authorization and RBAC

Implement authorization as an explicit backend policy, not a collection of hidden buttons.

- Define roles and permissions from the PRD.
- Deny access by default.
- Verify authorization on every protected request and every object access.
- Prevent BOLA/IDOR by checking ownership, tenant/workspace boundaries, or explicit grants.
- Do not rely on UUIDs or hard-to-guess identifiers as authorization controls.
- Check authorization again inside background jobs and long-running workflows.
- Enforce role changes and revocation on the server.
- Avoid trusting role names, user IDs, or permission flags supplied by the browser.
- Prevent self-escalation and unauthorized assignment of privileged roles.
- Audit role assignment, revocation, privilege changes, and administrator actions.
- Require stronger controls for destructive or high-impact administrative operations.

If users can hold multiple roles, define how permissions combine, how conflicts are resolved, and which role is active for a given module. The active UI role must never override the server's authorization decision.

Write automated tests for every role-to-permission rule and for denied access. Include tests that attempt to access another user's records by changing resource IDs.

## 9. Input validation and output encoding

Validate all untrusted input on the server using explicit schemas.

- Define maximum lengths, numeric ranges, accepted enums, required fields, and nested object limits.
- Reject unexpected fields where practical for security-sensitive operations.
- Normalize input only when the domain rules require it; do not normalize away meaningful security distinctions.
- Use parameterized database queries or a safe ORM API.
- Never construct SQL by concatenating untrusted strings.
- Encode output for the correct context: HTML, attribute, URL, JavaScript, or CSS.
- Prefer safe framework rendering; avoid raw HTML insertion.
- Sanitize rich text with a well-maintained allowlist sanitizer if rich text is required.
- Validate uploaded content based on file signatures and expected format, not filename or MIME type alone.
- Set maximum request-body sizes and timeouts.
- Reject malformed JSON, unexpected content types, and invalid encodings.
- Use safe parsers; avoid unsafe deserialization of untrusted data.

Frontend validation improves usability but never replaces backend validation.

## 10. Browser security and HTTP controls

For production, serve the site only over HTTPS using a valid certificate and modern TLS configuration. Redirect HTTP to HTTPS at the trusted edge.

Configure security headers appropriate to the application, including:

- Content-Security-Policy (CSP), initially in report-only mode where necessary and then enforced after testing.
- `Strict-Transport-Security` (HSTS) only when HTTPS is correctly configured across the intended scope.
- `X-Content-Type-Options: nosniff`.
- A restrictive `Referrer-Policy`.
- `frame-ancestors` in CSP or a suitable anti-framing policy.
- A restrictive `Permissions-Policy`.
- Appropriate cache controls for authenticated and sensitive responses.

CSP should use nonces or hashes where supported. Avoid broad `unsafe-inline` and `unsafe-eval` allowances unless a documented, reviewed constraint requires them.

### CORS

- Allow only known frontend origins.
- Do not combine wildcard origins with credentialed requests.
- Avoid reflecting arbitrary `Origin` values.
- Keep development origins out of production configuration.
- Treat CORS as a browser policy, not authentication or authorization.

### CSRF

For cookie-authenticated state-changing operations, implement an appropriate CSRF defense, with `SameSite` as a supporting control rather than the only control. Validate origin or referer where appropriate. Do not use state-changing GET requests.

### Cache controls

Do not publicly cache authenticated responses, private experiment records, session-related endpoints, or sensitive reports. Define explicit cache behavior for each route and API response.

## 11. API security

- Use versioned and documented API contracts where appropriate.
- Authenticate protected endpoints and authorize every operation.
- Apply object-level and function-level authorization.
- Validate request and response schemas.
- Set request size, execution time, pagination, and concurrency limits.
- Rate-limit authentication, AI calls, expensive simulation operations, exports, and other abuse-prone endpoints.
- Apply quotas to expensive operations based on account and resource limits.
- Avoid mass assignment by explicitly mapping allowed fields.
- Do not return ORM objects or internal database fields blindly.
- Return consistent error schemas without stack traces or secret values.
- Use safe HTTP methods and status codes.
- Prevent duplicate processing with idempotency controls when the operation requires them.
- Use pagination with maximum page sizes.
- Keep API documentation and debug interfaces restricted appropriately in production.
- Inventory endpoints and remove unused or deprecated routes.
- Validate webhooks with provider-supported signatures, timestamps, and replay protection if webhooks are added.
- Do not expose internal service URLs, file paths, environment values, or debug metadata in public responses.

## 12. Database and data protection

- Use a dedicated application database account with only required permissions.
- Do not use a database superuser as the application runtime account.
- Keep PostgreSQL private to the application network; do not expose it publicly unless an explicitly reviewed requirement exists.
- Use parameterized queries and safe ORM patterns.
- Apply schema migrations through reviewed, version-controlled migration files.
- Back up important data and test restoration.
- Restrict access to backups and encrypt them where supported.
- Use TLS for database connections across untrusted networks.
- Define retention and deletion policies for accounts, experiments, logs, and exports.
- Avoid storing secrets or unnecessary personal information in records.
- Consider encryption at rest for the database, disks, and backups according to the deployment environment.
- Restrict database administration to authorized maintainers.
- Test migrations against representative data before production rollout.
- Do not run destructive migrations without a backup and a reviewed recovery plan.

Database integrity is especially important for experiment results, evaluation metrics, policy decisions, and audit records. Do not allow AI-generated explanations to overwrite the authoritative calculation results.

## 13. AI integration security

AI is an untrusted external dependency. Treat prompts, retrieved evidence, model output, and tool suggestions as potentially adversarial.

### Data handling

- Send only the minimum information required to the model provider.
- Do not send secrets, authentication tokens, unnecessary personal information, or raw production data.
- Use synthetic data by default.
- Document provider data retention, training-use settings, regional processing, and contractual terms before using sensitive data.
- Keep provider API keys on the backend.
- Store keys in a secret manager or protected deployment environment.
- Rotate exposed or compromised keys immediately.

### Prompt injection and untrusted evidence

- Treat incident logs, uploaded evidence, descriptions, and retrieved content as data, not trusted instructions.
- Clearly delimit evidence and separate it from system policy.
- Do not let text found in evidence modify tool permissions, safety rules, or application instructions.
- Do not grant the model unrestricted shell, network, database, filesystem, or deployment access.
- Avoid giving the model tools when a deterministic function can perform the task more safely.

### Structured output

- Require a strict schema for model responses.
- Validate every response before use.
- Reject unexpected tool calls, fields, values, or actions.
- Set token, time, retry, and concurrency limits.
- Handle refusals, malformed output, timeouts, provider errors, and rate limits explicitly.
- Do not render model output as trusted HTML.
- Label generated explanations clearly when needed.
- Distinguish evidence-supported statements from assumptions and uncertainty.

### Safety invariants

- The deterministic policy engine is authoritative.
- The deterministic simulation engine is authoritative for metrics.
- AI cannot approve, execute, or override prohibited actions.
- AI cannot modify policy definitions or grant itself permissions.
- Any proposed strategy must be validated after generation and before being shown as policy-compliant.
- Safety validation must be repeated on the server at the final decision boundary.
- A provider outage must not silently disable safety controls.
- If a response cannot be validated, fail closed for the affected operation.

### AI auditability

Record, where appropriate and privacy-safe:

- Provider and model identifier.
- Prompt/template version.
- Input scenario or evidence references.
- Validated output schema version.
- Relevant policy validation result.
- Timing, failure, and retry metadata.
- Human review outcome.

Do not log full prompts or outputs by default if they contain secrets or sensitive content. Define a retention policy and redact sensitive values.

## 14. Simulation engine integrity

The simulator must remain isolated from real-world systems.

- Use synthetic scenarios and controlled fixtures.
- Define the inputs, assumptions, units, and formulas for every authoritative metric.
- Validate simulation inputs before computation.
- Set bounds on graph size, event count, simulation duration, and computational complexity.
- Prevent user-supplied expressions from being evaluated as code.
- Do not use `eval`, dynamic code execution, or shell commands to process scenario data.
- Keep simulation calculations separate from AI explanation and UI rendering.
- Enforce deterministic policy constraints independently of candidate-generation logic.
- Record the scenario version, engine version, configuration, and relevant random seed when reproducibility requires it.
- Distinguish estimated impact from measured real-world impact.
- Test invariants, edge cases, and reproducibility.
- Do not create an outbound control channel to production or OT systems.
- Ensure that report wording does not imply a real action occurred when only a simulation was performed.

If external integrations are proposed later, require a new threat model, explicit owner approval, isolated test environment, authorization review, and a separate safety assessment.

## 15. File handling, exports, and report generation

If file import or export exists:

- Allow only explicitly supported formats.
- Limit file size, record count, decompressed size, and processing time.
- Validate file signatures and parse with safe libraries.
- Reject path traversal sequences and absolute paths.
- Generate server-side filenames rather than trusting user-supplied paths.
- Store temporary files outside public web roots.
- Use randomized, scoped object identifiers for downloads.
- Require authorization each time a private export is downloaded.
- Set safe content types and `Content-Disposition`.
- Prevent spreadsheet formula injection in CSV/XLSX exports by safely handling cells beginning with formula-significant characters.
- Do not execute macros or embedded content.
- Clean up temporary files according to a defined policy.
- Avoid exposing internal paths, environment values, or sensitive records in reports.
- Audit sensitive export operations.

If uploads are not required by the PRD, do not add them simply because they are easy to implement.

## 16. SSRF, outbound requests, and external integrations

- Avoid fetching arbitrary user-supplied URLs from the backend.
- If URL fetching is necessary, use an allowlist of approved hosts and protocols.
- Block loopback, private, link-local, multicast, and cloud metadata IP ranges, including after DNS resolution.
- Revalidate destinations after redirects and DNS changes.
- Limit redirects, response sizes, content types, and connection timeouts.
- Do not forward internal credentials or headers to external hosts.
- Apply egress firewall rules where available.
- Do not permit arbitrary network access from AI tools, parsers, report generators, or background workers.
- Do not assume URL validation alone prevents SSRF.
- Keep external integrations disabled by default until configured and reviewed.

## 17. Resource exhaustion and abuse prevention

Protect the application against accidental overload and deliberate denial of service.

- Set request timeouts and maximum payload sizes.
- Apply rate limits and quotas to expensive endpoints.
- Limit concurrent simulations and AI requests.
- Bound worker concurrency, retries, queue length, and job duration.
- Use cancellation and cleanup for abandoned jobs.
- Prevent unbounded loops and uncontrolled graph traversal.
- Add pagination and maximum result sizes.
- Avoid loading entire datasets into memory when streaming or bounded queries are possible.
- Set database connection pool limits.
- Return a clear, non-sensitive error when limits are reached.
- Monitor latency, failure rates, queue depth, and resource use.
- Do not retry transient errors indefinitely.
- Use backoff and jitter where retries are justified.

Do not add Redis or a distributed queue solely as a precaution. Use the simplest architecture that meets the measured workload and documented requirements.

## 18. Secrets and configuration management

- Never commit API keys, passwords, private keys, session secrets, database credentials, or production environment files.
- Provide a sanitized `.env.example` containing placeholder values only.
- Add local secret files to `.gitignore`.
- Scan Git changes and repository history for accidental secret exposure.
- Use separate credentials for development, testing, staging, and production.
- Rotate credentials after suspected exposure.
- Restrict production secrets to the services that require them.
- Prefer a secret manager when available.
- Never expose backend secrets through `NEXT_PUBLIC_*` variables or other client-side build variables.
- Never print secrets in logs, build output, test snapshots, error messages, or screenshots.
- Use high-entropy secrets generated by a secure mechanism.
- Document safe rotation and recovery procedures.

If a secret is committed, removing it from the latest commit is not enough. Revoke or rotate it immediately and assess repository history and downstream exposure.

## 19. Dependency and software supply-chain security

- Commit and maintain lockfiles.
- Pin or constrain dependencies using the ecosystem's supported practices.
- Prefer actively maintained packages from trusted publishers.
- Review new dependencies for necessity, maintenance status, license, permissions, and known vulnerabilities.
- Run dependency vulnerability checks for frontend and backend packages.
- Run secret scanning and static analysis in CI.
- Generate a Software Bill of Materials (SBOM) for releases where practical.
- Use trusted package registries and avoid downloading unverified executable artifacts.
- Update dependencies on a regular schedule and prioritize exploitable high-risk vulnerabilities.
- Review transitive dependencies, not only direct dependencies.
- Avoid using unmaintained packages for authentication, cryptography, or security-sensitive parsing.
- Verify release artifacts and build provenance as CI/CD maturity permits.
- Do not ignore vulnerability advisories without a documented risk decision.

Recommended tool categories include ecosystem-native audit commands, secret scanners, static analysis, container image scanners, and SBOM generators. Select tools compatible with the repository and document actual execution results. A tool being installed does not mean the project has been scanned.

## 20. Secure coding requirements

- Use strict typing where supported.
- Keep functions and modules focused.
- Avoid dynamic evaluation and unnecessary reflection.
- Avoid unsafe deserialization.
- Use cryptographically secure randomness for security tokens.
- Use standard cryptographic libraries; never invent algorithms.
- Avoid leaking internal exceptions to clients.
- Do not disable TLS verification to “fix” connectivity.
- Do not bypass authentication or authorization for convenience.
- Do not use hardcoded administrator credentials.
- Do not add undocumented backdoors, debug routes, or hidden bypass flags.
- Keep development-only features disabled in production.
- Validate trust boundaries at service interfaces.
- Review race conditions and TOCTOU risks for authorization-sensitive workflows.
- Ensure that background jobs re-check access and policy constraints at execution time.

## 21. Logging, audit trail, and monitoring

Use structured logs with consistent timestamps, severity, service, request/correlation ID, and event type.

Log relevant security events, including:

- Authentication successes and failures.
- Rate-limit and abuse-control triggers.
- Password reset and account recovery events.
- Permission denials and suspicious object-access attempts.
- Role and privilege changes.
- Administrative configuration changes.
- AI provider errors and schema-validation failures.
- Simulation creation, execution, cancellation, and completion.
- Policy validation outcomes.
- Report generation and sensitive exports.
- Database migration and deployment events.

Do not log:

- Passwords.
- Session cookies.
- Authorization headers.
- API keys.
- Private keys.
- Reset tokens.
- Full sensitive request bodies.
- Unnecessary personal data.
- Secret environment values.

### Audit integrity

- Separate security audit events from ordinary debug logs where practical.
- Restrict write and delete permissions.
- Include actor, action, target, timestamp, outcome, and correlation identifier where applicable.
- Use append-oriented storage or tamper-evident controls where justified.
- Do not claim logs are immutable unless the storage architecture enforces it.
- Define retention and access policies.
- Alert on meaningful patterns rather than generating noisy alerts that nobody reviews.

Logs help detection and investigation but do not replace access controls or secure design.

## 22. Error handling and information disclosure

- Return safe, consistent error messages to users.
- Keep stack traces and detailed internal exceptions in restricted logs.
- Do not reveal database schema, filesystem paths, dependency versions, secrets, or internal network details.
- Use appropriate HTTP status codes without leaking resource existence where that would create risk.
- Handle unexpected failures without bypassing authorization or safety checks.
- Ensure failed jobs reach a terminal state and do not remain indefinitely marked as running.
- Avoid returning partial sensitive data after authorization or validation failure.

## 23. Deployment, containers, and infrastructure

Apply controls relevant to the chosen hosting environment.

- Separate development, staging, and production environments.
- Deploy only reviewed, reproducible builds.
- Run application containers as non-root users where feasible.
- Use minimal trusted base images and scan them for vulnerabilities.
- Do not mount the Docker socket into application containers.
- Do not run privileged containers unless a reviewed requirement makes it unavoidable.
- Drop unnecessary Linux capabilities.
- Use read-only filesystems where practical.
- Set CPU, memory, process, and storage limits.
- Keep PostgreSQL and internal services on private networks.
- Expose only required public ports.
- Restrict administrative interfaces.
- Patch the host OS, container runtime, reverse proxy, database, and deployment platform.
- Use TLS between external clients and the trusted edge; use internal TLS where risk and architecture warrant it.
- Configure backups, restore tests, health checks, and safe deployment rollback.
- Avoid printing secrets during CI/CD.
- Limit CI permissions and use short-lived credentials where supported.
- Require review for changes to workflows that can deploy to production.
- Protect deployment branches and release credentials.

For a Docker-based deployment, review image users, exposed ports, mounts, capabilities, health checks, secrets, networks, and resource limits. Do not copy a generic hardened configuration without validating compatibility.

## 24. CI/CD security gates

Implement a practical pipeline that can grow with the project.

### Pull request checks

- Formatting and lint checks.
- Type checking.
- Unit tests.
- Backend tests.
- Build validation.
- Dependency vulnerability checks.
- Secret scanning.
- Static analysis for relevant languages.
- Migration validation.
- Security-sensitive code review.

### Release checks

- All required tests pass.
- No unresolved critical vulnerabilities.
- High-severity findings are fixed or have an explicitly approved, time-bounded risk exception.
- Production configuration is reviewed.
- Secrets are supplied securely.
- Database migrations and rollback/recovery are reviewed.
- HTTPS and security headers are verified.
- Backup and restoration procedures are tested according to risk.
- Smoke tests and critical user journeys pass.
- Security and operational limitations are documented.

Do not create a pipeline that reports success while silently skipping unavailable checks. Mark skipped checks as skipped and explain why.

## 25. Security testing plan

Use authorized, non-destructive testing on local or controlled staging environments.

### Required test categories

1. **Authentication:** invalid credentials, throttling, reset-token expiry, session invalidation.
2. **Authorization:** role matrix, cross-user object access, privilege escalation, denied actions.
3. **Input validation:** malformed payloads, boundary lengths, unexpected fields, invalid enums.
4. **Injection:** SQL injection prevention, XSS output encoding, command-injection exposure review, unsafe parser review.
5. **CSRF and CORS:** state-changing request protections and origin restrictions.
6. **API abuse:** rate limits, pagination bounds, oversized requests, concurrency limits.
7. **AI safety:** prompt injection in synthetic evidence, malformed output, fabricated fields, refusal, timeout, and provider outage.
8. **Simulation integrity:** deterministic invariants, policy bypass attempts, resource limits, reproducibility.
9. **Data protection:** secret leakage, log redaction, private response caching, export authorization.
10. **Dependency and configuration:** package audits, secret scans, static analysis, container/configuration review.
11. **Recovery:** backup restoration, failed-job recovery, and deployment rollback where applicable.
12. **UI:** authentication state, access-denied views, safe error handling, and responsive critical flows.

Use test cases with expected outcomes. Save sanitized evidence of the checks, without including credentials or sensitive payloads.

Do not scan public targets or perform intrusive tests without written authorization and a defined scope.

## 26. Privacy and data lifecycle

- Document what personal or account data is collected and why.
- Collect the minimum data necessary.
- Provide clear privacy notices appropriate to the deployment context.
- Define retention, deletion, backup retention, and account removal behavior.
- Restrict access to personal data.
- Redact personal data from logs where feasible.
- Avoid sending unnecessary personal data to AI providers.
- Review third-party processors and data-handling terms.
- Protect exports and shared reports.
- Follow applicable legal obligations based on the actual deployment jurisdiction and user population.

Do not claim compliance with a privacy law solely because a privacy notice exists. Obtain appropriate legal review when the deployment requires it.

## 27. Backup, recovery, and availability

- Define recovery objectives appropriate to the project.
- Back up database data and required configuration securely.
- Encrypt backups where supported and restrict access.
- Keep backups separate from ordinary application credentials where feasible.
- Test restoration periodically.
- Document the recovery process and responsible person.
- Monitor storage exhaustion and failed backup jobs.
- Define what can be recreated from source code versus what must be restored.
- Ensure backup procedures do not expose secrets in logs.
- Document data-loss limitations for the prototype.

A backup is not verified until restoration has been tested.

## 28. Vulnerability disclosure and incident response

Provide a private way for maintainers or authorized testers to report security issues. Do not publish exploit details for a live vulnerability before remediation coordination.

### Incident-response stages

1. **Prepare:** maintain contacts, asset inventory, backups, logs, and access-revocation procedures.
2. **Identify:** verify the report, assess affected components, severity, and potential exposure.
3. **Contain:** restrict affected accounts, revoke exposed credentials, disable vulnerable integrations, or isolate affected services as appropriate.
4. **Eradicate:** fix the root cause and remove malicious or unsafe changes.
5. **Recover:** restore trusted operation, rotate credentials, validate integrity, and monitor for recurrence.
6. **Learn:** document timeline, impact, root cause, corrective actions, and prevention work.

For exposed credentials, revoke or rotate them immediately. For suspected data exposure, preserve appropriate evidence, limit further access, and follow applicable notification obligations.

Do not delete relevant logs or evidence during an investigation. Do not claim an incident is resolved until the affected controls have been verified.

## 29. Release security checklist

A release must not be considered security-ready until the following applicable checks are recorded.

### Identity and authorization
- [ ] Authentication uses a maintained implementation.
- [ ] Passwords, sessions, reset flows, and privileged accounts meet this policy.
- [ ] Protected endpoints enforce server-side authorization.
- [ ] Cross-user object-access tests pass.
- [ ] Administrative operations are restricted and audited.

### Application and API
- [ ] Input schemas and payload limits are enforced.
- [ ] Database access uses safe parameterized patterns.
- [ ] Output encoding and CSRF protections are reviewed.
- [ ] CORS is restricted to approved origins.
- [ ] Rate limits and execution bounds are in place.
- [ ] Errors do not expose internal details.

### AI and simulation
- [ ] AI output is schema-validated.
- [ ] Deterministic metrics cannot be overridden by AI.
- [ ] Safety policies are enforced server-side.
- [ ] Prompt-injection and provider-failure tests pass.
- [ ] `SIMULATION ONLY` boundaries are clear.
- [ ] No real-world control path exists.

### Data and secrets
- [ ] No secrets are committed or exposed in client bundles.
- [ ] Sensitive responses have appropriate cache controls.
- [ ] Logs redact secrets and unnecessary personal data.
- [ ] Database access and backups are restricted.
- [ ] Retention and deletion expectations are documented.

### Dependencies and infrastructure
- [ ] Dependency and secret scans have been run.
- [ ] Critical findings are resolved.
- [ ] High findings are resolved or formally risk-accepted.
- [ ] Production configuration is reviewed.
- [ ] Containers and exposed ports are appropriately restricted.
- [ ] HTTPS and relevant security headers are verified.
- [ ] Backup restoration and recovery limitations are understood.

### Verification and governance
- [ ] Relevant automated tests pass.
- [ ] Security-sensitive changes receive review.
- [ ] Skipped checks and known limitations are documented.
- [ ] Risk exceptions have owners and expiry/review dates.
- [ ] The release owner has recorded the final decision.

Mark items not applicable only with a short rationale. An unchecked item is not a pass.

## 30. Required security artifacts

Maintain these project artifacts as the implementation grows:

- `SECURITY.md` — this baseline and mandatory security requirements.
- `THREAT_MODEL.md` — assets, trust boundaries, threats, mitigations, and residual risks.
- `SECURITY_TEST_PLAN.md` — test cases, environments, expected outcomes, and evidence.
- `SECURITY_EXCEPTIONS.md` — accepted risks, owners, mitigations, and review dates.
- `DEPENDENCY_REVIEW.md` or equivalent CI output — dependency audit history.
- `INCIDENT_RESPONSE.md` — contacts, escalation, containment, recovery, and communication procedure.

If the project already has equivalent documents, update them instead of creating duplicates.

## 31. Agent execution rules

Any coding agent working on GARDA-SIM AI must:

1. Read this file before making security-sensitive changes.
2. Inspect the current implementation before proposing a rewrite.
3. Follow least privilege and secure defaults.
4. Never disable security controls just to make a test or feature pass.
5. Never hardcode secrets or introduce hidden bypasses.
6. Never create real-world cyber action capabilities under the simulator's current scope.
7. Add tests for new authorization rules, input boundaries, and policy invariants.
8. Explain the security impact of new dependencies and external integrations.
9. Report actual checks and results, including skipped checks.
10. Update this document and related security artifacts when the security model changes.
11. Ask for approval before expanding the product to real production or OT integrations, adding high-risk capabilities, or weakening a mandatory security control.
12. Never claim “secure,” “unhackable,” “fully compliant,” or “certified” based solely on implementation of this checklist.

### Final principle

Security is a continuous engineering and operational process, not a one-time configuration task. GARDA-SIM AI may be described as following this security baseline only to the extent that its controls have actually been implemented and verified. Residual risks must remain visible and owned.

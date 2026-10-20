namespace NexLog.BuildingBlocks.Web.Security;

/// <summary>
/// Section "Auth0" (env vars: Auth0__Domain, Auth0__Audience, ...).
/// No client secret is needed: tokens are validated with Auth0's public signing keys (JWKS, RS256).
/// </summary>
public sealed class Auth0Options
{
    public const string Section = "Auth0";

    /// <summary>Set to false ONLY for local development without Auth0 (all endpoints become anonymous).</summary>
    public bool Enabled { get; set; } = true;

    /// <summary>Auth0 tenant domain, e.g. dev-fidelfm.us.auth0.com</summary>
    public string Domain { get; set; } = string.Empty;

    /// <summary>API Identifier created in Auth0 > Applications > APIs, e.g. https://api.nexlog-tms</summary>
    public string Audience { get; set; } = string.Empty;

    /// <summary>Optional full authority override (testing / custom domains). Defaults to https://{Domain}/</summary>
    public string? Authority { get; set; }

    public bool RequireHttpsMetadata { get; set; } = true;

    /// <summary>When true, GET/HEAD require <see cref="ReadPermission"/> and writes require <see cref="WritePermission"/>
    /// (Auth0 RBAC "permissions" claim or "scope" claim).</summary>
    public bool EnforcePermissions { get; set; }
    public string ReadPermission { get; set; } = "read:tms";
    public string WritePermission { get; set; } = "write:tms";

    public string ResolveAuthority() =>
        !string.IsNullOrWhiteSpace(Authority) ? Authority! : $"https://{Domain.Trim().TrimEnd('/')}/";
}

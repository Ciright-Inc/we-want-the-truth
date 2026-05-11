/**
 * Domain provisioning abstraction — wire to Route53, registrar API, ACM, CloudFront.
 * All methods are idempotent-friendly stubs that persist status via Prisma in real flows.
 */

export type DnsInstruction = { type: string; name: string; value: string; ttl?: number };

export async function checkDomainAvailability(domain: string): Promise<{ available: boolean; priceCents?: number }> {
  // Stub: integrate WHOIS / registrar API
  const reserved = ["google.com", "amazon.com"];
  return { available: !reserved.includes(domain.toLowerCase()), priceCents: 1200 };
}

export async function registerDomainStub(domain: string): Promise<{ registrarRef: string }> {
  return { registrarRef: `stub-${domain}-${Date.now()}` };
}

export async function provisionSslStub(hostname: string): Promise<{ status: string }> {
  return { status: `pending-acm:${hostname}` };
}

export async function provisionDnsStub(tenantId: string, hostname: string): Promise<DnsInstruction[]> {
  void tenantId;
  return [
    { type: "CNAME", name: hostname, value: "edge.we-want-the-truth.com", ttl: 300 },
    { type: "TXT", name: `_verify.${hostname}`, value: "wwtt-verify=stub", ttl: 300 },
  ];
}

export async function verifyDnsStub(hostname: string): Promise<boolean> {
  void hostname;
  return false;
}

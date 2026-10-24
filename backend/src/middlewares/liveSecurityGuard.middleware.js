import models from '../database/models/index.js';

// In-memory IP blocklist with expiration timestamp
const blockedIps = new Map();
const violationCounters = new Map();

// Clear expired bans periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, expiry] of blockedIps.entries()) {
    if (expiry <= now) {
      blockedIps.delete(ip);
      violationCounters.delete(ip);
    }
  }
}, 60000);

const THREAT_RULES = [
  // 1. Scanner & exploit probes
  {
    category: 'scanner_probe',
    name: 'Environment / Secrets Scan',
    regex: /\.(env|git|htaccess|aws|ssh|credentials)/i,
    target: 'url',
    critical: true,
  },
  {
    category: 'scanner_probe',
    name: 'Vulnerable CMS / Backdoor Scan',
    regex: /(wp-login|wp-admin|wp-config|xmlrpc\.php|eval-stdin|alfa\.php|wso\.php|c99\.php|b374k|webadmin\.php)/i,
    target: 'url',
    critical: true,
  },
  {
    category: 'path_traversal',
    name: 'Directory Traversal Attempt',
    regex: /(\.\.[/\\]|etc\/passwd|etc\/shadow|win\.ini|boot\.ini|cmd\.exe|powershell\.exe)/i,
    target: 'all',
    critical: true,
  },
  // 2. SQL Injection Patterns
  {
    category: 'sql_injection',
    name: 'SQL Union / Metadata Injection',
    regex: /(union\s+(all\s+)?select|information_schema\.|select\s+.*\s+from\s+information_schema)/i,
    target: 'all',
    critical: true,
  },
  {
    category: 'sql_injection',
    name: 'SQL Boolean / Stacked Injection',
    regex: /('\s*or\s*['"]?1['"]?\s*=\s*['"]?1|--\s*[\w\r\n]|;\s*drop\s+table)/i,
    target: 'all',
    critical: true,
  },
  {
    category: 'sql_injection',
    name: 'Blind Time-Based SQLi',
    regex: /(sleep\(\s*\d+\s*\)|benchmark\(\s*\d+\s*,)/i,
    target: 'all',
    critical: true,
  },
  // 3. Cross-Site Scripting (XSS) Patterns
  {
    category: 'xss_attack',
    name: 'Script Injection / Event Handler XSS',
    regex: /(<script[\s\S]*?>[\s\S]*?<\/script>|javascript:\s*[a-z0-9_]|<iframe[\s\S]*?>|\sonerror\s*=\s*['"][^'"]*['"]|\sonload\s*=\s*['"][^'"]*['"])/i,
    target: 'all',
    critical: false,
  },
  // 4. Remote Code Execution
  {
    category: 'rce_attack',
    name: 'Command Execution / Shell Spawn',
    regex: /(\|\s*bash|\|\s*sh|;\s*cat\s+\/etc\/passwd|eval\s*\(\s*base64_decode)/i,
    target: 'all',
    critical: true,
  },
];

function stringifyPayload(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data);
  } catch {
    return '';
  }
}

/**
 * Live Security Guard Middleware
 * Automatically detects attacks in real-time, blocks perpetrators with HTTP 403,
 * temporarily blacklists malicious IPs, and records threat telemetry in AuditLog.
 */
export function liveSecurityGuard(req, res, next) {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  const now = Date.now();

  // 1. Check if IP is currently under active ban
  if (blockedIps.has(ip)) {
    const expiry = blockedIps.get(ip);
    if (now < expiry) {
      const remainingSeconds = Math.ceil((expiry - now) / 1000);
      return res.status(403).json({
        success: false,
        code: 'IP_BLOCKED_SECURITY_VIOLATION',
        message: `Your IP address has been temporarily blocked by MediNextGen Live Security Guard due to malicious payload attempts. Retry in ${remainingSeconds}s.`,
      });
    } else {
      blockedIps.delete(ip);
      violationCounters.delete(ip);
    }
  }

  // 2. Prepare payload strings for deep inspection
  const fullUrl = req.originalUrl || req.url || '';
  const queryString = req.url.includes('?') ? req.url.split('?')[1] : '';
  const bodyString = req.body ? stringifyPayload(req.body) : '';
  const combinedPayload = `${fullUrl} ${queryString} ${bodyString}`;

  let detectedThreat = null;

  for (const rule of THREAT_RULES) {
    let textToScan = combinedPayload;
    if (rule.target === 'url') textToScan = fullUrl;

    const match = rule.regex.exec(textToScan);
    if (match) {
      detectedThreat = {
        category: rule.category,
        name: rule.name,
        critical: rule.critical,
        matchedExcerpt: match[0].slice(0, 100),
      };
      break;
    }
  }

  // 3. Threat detected — trigger live block
  if (detectedThreat) {
    const currentViolations = (violationCounters.get(ip) || 0) + 1;
    violationCounters.set(ip, currentViolations);

    // Critical threats or 2+ strikes = 15-minute temporary ban
    if (detectedThreat.critical || currentViolations >= 2) {
      const banDurationMs = 15 * 60 * 1000; // 15 minutes
      blockedIps.set(ip, now + banDurationMs);
    }

    // Append to security audit logs asynchronously
    try {
      if (models.AuditLog) {
        models.AuditLog.create({
          action: 'security.threat_blocked',
          entityType: 'security_firewall',
          details: {
            threatCategory: detectedThreat.category,
            threatName: detectedThreat.name,
            matchedExcerpt: detectedThreat.matchedExcerpt,
            method: req.method,
            path: fullUrl,
            userAgent: req.headers['user-agent'] || '',
            ip,
            bannedUntil: blockedIps.get(ip) ? new Date(blockedIps.get(ip)).toISOString() : null,
          },
          ipAddress: ip.slice(0, 45),
        }).catch((err) => {
          console.error('[SecurityGuard] Failed to persist audit log:', err.message);
        });
      }
    } catch {
      // Ignore DB log errors
    }

    console.warn(
      `[SECURITY GUARD] BLOCKED ATTACK from ${ip}: ${detectedThreat.name} on ${req.method} ${fullUrl}`
    );

    return res.status(403).json({
      success: false,
      code: 'SECURITY_THREAT_BLOCKED',
      message:
        'Access Denied: Malicious pattern or security exploit signature detected by MediNextGen Live Threat Detection.',
      threat: {
        category: detectedThreat.category,
        type: detectedThreat.name,
      },
    });
  }

  next();
}

/**
 * Get active security status for admin review
 */
export function getSecurityStatus() {
  return {
    blockedIpsCount: blockedIps.size,
    activeBans: Array.from(blockedIps.entries()).map(([ip, expiry]) => ({
      ip,
      expiresInSeconds: Math.max(0, Math.ceil((expiry - Date.now()) / 1000)),
    })),
  };
}

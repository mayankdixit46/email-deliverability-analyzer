import dns from 'dns';
import { promisify } from 'util';
import { aiService } from './ai.service.js';

// Create a custom DNS resolver with timeout
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Google and Cloudflare DNS
const resolveTxtAsync = promisify(resolver.resolveTxt.bind(resolver));

class DMARCService {
  async checkDMARC(domain, includeAIInsights = true) {
    try {
      const dmarcDomain = `_dmarc.${domain}`;

      // Set a timeout for DNS resolution
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DNS lookup timeout')), 5000)
      );

      const records = await Promise.race([
        resolveTxtAsync(dmarcDomain),
        timeoutPromise
      ]);
      const dmarcRecords = records
        .flat()
        .filter(record => record.startsWith('v=DMARC1'));

      if (dmarcRecords.length === 0) {
        const result = {
          status: 'fail',
          message: 'No DMARC record found',
          records: [],
        };

        // Add AI insights for failure case
        if (includeAIInsights) {
          const aiAnalysis = await aiService.analyzeDMARC(result, domain);
          if (aiAnalysis.success) {
            result.aiInsights = aiAnalysis.insights;
          }
        }

        return result;
      }

      if (dmarcRecords.length > 1) {
        const result = {
          status: 'warning',
          message: 'Multiple DMARC records found',
          records: dmarcRecords,
        };

        // Add AI insights for multiple records case
        if (includeAIInsights) {
          const aiAnalysis = await aiService.analyzeDMARC(result, domain);
          if (aiAnalysis.success) {
            result.aiInsights = aiAnalysis.insights;
          }
        }

        return result;
      }

      const dmarcRecord = dmarcRecords[0];
      const parsed = this.parseDMARC(dmarcRecord);

      // Validate policy
      const validation = this.validatePolicy(parsed);

      const result = {
        status: validation.status,
        message: validation.message,
        record: dmarcRecord,
        parsed,
        recommendations: validation.recommendations,
      };

      // Add AI insights if enabled
      if (includeAIInsights) {
        const aiAnalysis = await aiService.analyzeDMARC(result, domain);
        if (aiAnalysis.success) {
          result.aiInsights = aiAnalysis.insights;
        }
      }

      return result;
    } catch (error) {
      const result = {
        status: 'error',
        message: error.message,
      };

      // Add AI insights even for error case
      if (includeAIInsights) {
        const aiAnalysis = await aiService.analyzeDMARC(result, domain);
        if (aiAnalysis.success) {
          result.aiInsights = aiAnalysis.insights;
        }
      }

      return result;
    }
  }

  parseDMARC(record) {
    const parts = record.split(';').map(p => p.trim());
    const parsed = {};

    parts.forEach(part => {
      const [key, value] = part.split('=').map(s => s.trim());
      if (key && value) {
        parsed[key] = value;
      }
    });

    return {
      version: parsed.v,
      policy: parsed.p,
      subdomainPolicy: parsed.sp,
      percentage: parsed.pct,
      reportingEmails: {
        aggregate: parsed.rua,
        forensic: parsed.ruf,
      },
      alignment: {
        dkim: parsed.adkim,
        spf: parsed.aspf,
      },
    };
  }

  validatePolicy(parsed) {
    const recommendations = [];

    if (!parsed.policy) {
      return {
        status: 'fail',
        message: 'No policy specified',
        recommendations: ['Add a policy (p=none, p=quarantine, or p=reject)'],
      };
    }

    if (parsed.policy === 'none') {
      recommendations.push('Consider upgrading policy to quarantine or reject for better protection');
    }

    if (!parsed.reportingEmails.aggregate) {
      recommendations.push('Add aggregate reporting (rua) to monitor DMARC activity');
    }

    if (parsed.percentage && parseInt(parsed.percentage) < 100) {
      recommendations.push('Consider setting percentage (pct) to 100 for full protection');
    }

    return {
      status: 'pass',
      message: `DMARC policy is set to: ${parsed.policy}`,
      recommendations,
    };
  }
}

export const dmarcService = new DMARCService();

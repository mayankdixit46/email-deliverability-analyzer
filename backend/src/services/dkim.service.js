import dns from 'dns';
import { promisify } from 'util';
import { aiService } from './ai.service.js';

// Create a custom DNS resolver with timeout
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Google and Cloudflare DNS
const resolveTxtAsync = promisify(resolver.resolveTxt.bind(resolver));

class DKIMService {
  async checkDKIM(domain, selector = 'default', includeAIInsights = true) {
    try {
      const dkimDomain = `${selector}._domainkey.${domain}`;

      // Set a timeout for DNS resolution
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DNS lookup timeout')), 5000)
      );

      const records = await Promise.race([
        resolveTxtAsync(dkimDomain),
        timeoutPromise
      ]);
      const dkimRecords = records.flat();

      if (dkimRecords.length === 0) {
        const result = {
          status: 'fail',
          message: `No DKIM record found for selector: ${selector}`,
          selector,
        };

        // Add AI insights for failure case
        if (includeAIInsights) {
          const aiAnalysis = await aiService.analyzeDKIM(result, domain, selector);
          if (aiAnalysis.success) {
            result.aiInsights = aiAnalysis.insights;
          }
        }

        return result;
      }

      const dkimRecord = dkimRecords.join('');
      const parsed = this.parseDKIM(dkimRecord);

      const result = {
        status: 'pass',
        message: 'Valid DKIM record found',
        selector,
        record: dkimRecord,
        parsed,
      };

      // Add AI insights if enabled
      if (includeAIInsights) {
        const aiAnalysis = await aiService.analyzeDKIM(result, domain, selector);
        if (aiAnalysis.success) {
          result.aiInsights = aiAnalysis.insights;
        }
      }

      return result;
    } catch (error) {
      const result = {
        status: 'error',
        message: error.message,
        selector,
      };

      // Add AI insights even for error case
      if (includeAIInsights) {
        const aiAnalysis = await aiService.analyzeDKIM(result, domain, selector);
        if (aiAnalysis.success) {
          result.aiInsights = aiAnalysis.insights;
        }
      }

      return result;
    }
  }

  parseDKIM(record) {
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
      keyType: parsed.k,
      publicKey: parsed.p,
      flags: parsed.t,
      notes: parsed.n,
    };
  }
}

export const dkimService = new DKIMService();

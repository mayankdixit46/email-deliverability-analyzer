import dns from 'dns';
import { promisify } from 'util';
import { aiService } from './ai.service.js';

// Create a custom DNS resolver with timeout
const resolver = new dns.Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']); // Google and Cloudflare DNS
const resolveTxtAsync = promisify(resolver.resolveTxt.bind(resolver));

class SPFService {
  async checkSPF(domain, includeAIInsights = true) {
    try {
      // Set a timeout for DNS resolution
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('DNS lookup timeout')), 5000)
      );

      const records = await Promise.race([
        resolveTxtAsync(domain),
        timeoutPromise
      ]);
      const spfRecords = records
        .flat()
        .filter(record => record.startsWith('v=spf1'));

      if (spfRecords.length === 0) {
        const result = {
          status: 'fail',
          message: 'No SPF record found',
          records: [],
        };

        // Add AI insights for failure case
        if (includeAIInsights) {
          const aiAnalysis = await aiService.analyzeSPF(result, domain);
          if (aiAnalysis.success) {
            result.aiInsights = aiAnalysis.insights;
          }
        }

        return result;
      }

      if (spfRecords.length > 1) {
        const result = {
          status: 'fail',
          message: 'Multiple SPF records found (only one allowed)',
          records: spfRecords,
        };

        // Add AI insights for multiple records case
        if (includeAIInsights) {
          const aiAnalysis = await aiService.analyzeSPF(result, domain);
          if (aiAnalysis.success) {
            result.aiInsights = aiAnalysis.insights;
          }
        }

        return result;
      }

      const spfRecord = spfRecords[0];
      const parsed = this.parseSPF(spfRecord);

      const result = {
        status: 'pass',
        message: 'Valid SPF record found',
        record: spfRecord,
        parsed,
      };

      // Add AI insights if enabled
      if (includeAIInsights) {
        const aiAnalysis = await aiService.analyzeSPF(result, domain);
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
        const aiAnalysis = await aiService.analyzeSPF(result, domain);
        if (aiAnalysis.success) {
          result.aiInsights = aiAnalysis.insights;
        }
      }

      return result;
    }
  }

  parseSPF(record) {
    const parts = record.split(' ');
    return {
      version: parts[0],
      mechanisms: parts.slice(1).filter(p => !p.startsWith('~') && !p.startsWith('-')),
      qualifiers: parts.slice(1).filter(p => p.startsWith('~') || p.startsWith('-')),
    };
  }
}

export const spfService = new SPFService();

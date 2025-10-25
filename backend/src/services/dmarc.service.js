import dns from 'dns/promises';

class DMARCService {
  async checkDMARC(domain) {
    try {
      const dmarcDomain = `_dmarc.${domain}`;
      const records = await dns.resolveTxt(dmarcDomain);
      const dmarcRecords = records
        .flat()
        .filter(record => record.startsWith('v=DMARC1'));

      if (dmarcRecords.length === 0) {
        return {
          status: 'fail',
          message: 'No DMARC record found',
          records: [],
        };
      }

      if (dmarcRecords.length > 1) {
        return {
          status: 'warning',
          message: 'Multiple DMARC records found',
          records: dmarcRecords,
        };
      }

      const dmarcRecord = dmarcRecords[0];
      const parsed = this.parseDMARC(dmarcRecord);

      // Validate policy
      const validation = this.validatePolicy(parsed);

      return {
        status: validation.status,
        message: validation.message,
        record: dmarcRecord,
        parsed,
        recommendations: validation.recommendations,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
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

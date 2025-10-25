import dns from 'dns/promises';

class SPFService {
  async checkSPF(domain) {
    try {
      const records = await dns.resolveTxt(domain);
      const spfRecords = records
        .flat()
        .filter(record => record.startsWith('v=spf1'));

      if (spfRecords.length === 0) {
        return {
          status: 'fail',
          message: 'No SPF record found',
          records: [],
        };
      }

      if (spfRecords.length > 1) {
        return {
          status: 'fail',
          message: 'Multiple SPF records found (only one allowed)',
          records: spfRecords,
        };
      }

      const spfRecord = spfRecords[0];
      const parsed = this.parseSPF(spfRecord);

      return {
        status: 'pass',
        message: 'Valid SPF record found',
        record: spfRecord,
        parsed,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
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

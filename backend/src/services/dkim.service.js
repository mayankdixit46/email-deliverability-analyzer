import dns from 'dns/promises';

class DKIMService {
  async checkDKIM(domain, selector = 'default') {
    try {
      const dkimDomain = `${selector}._domainkey.${domain}`;
      const records = await dns.resolveTxt(dkimDomain);
      const dkimRecords = records.flat();

      if (dkimRecords.length === 0) {
        return {
          status: 'fail',
          message: `No DKIM record found for selector: ${selector}`,
          selector,
        };
      }

      const dkimRecord = dkimRecords.join('');
      const parsed = this.parseDKIM(dkimRecord);

      return {
        status: 'pass',
        message: 'Valid DKIM record found',
        selector,
        record: dkimRecord,
        parsed,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        selector,
      };
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

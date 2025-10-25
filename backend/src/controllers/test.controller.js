import pool from '../config/database.js';
import { spfService } from '../services/spf.service.js';
import { dkimService } from '../services/dkim.service.js';
import { dmarcService } from '../services/dmarc.service.js';

export const runSpfTest = async (req, res, next) => {
  try {
    const { domain_id } = req.body;
    const userId = req.user.id;

    // Verify domain ownership
    const domainResult = await pool.query(
      'SELECT * FROM domains WHERE id = $1 AND user_id = $2',
      [domain_id, userId]
    );

    if (domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const domain = domainResult.rows[0];

    // Run SPF test
    const spfResult = await spfService.checkSPF(domain.domain_name);

    // Save test result
    const result = await pool.query(
      'INSERT INTO test_results (domain_id, test_type, status, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [domain_id, 'spf', spfResult.status, JSON.stringify(spfResult)]
    );

    res.json({ test: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const runDkimTest = async (req, res, next) => {
  try {
    const { domain_id, selector } = req.body;
    const userId = req.user.id;

    const domainResult = await pool.query(
      'SELECT * FROM domains WHERE id = $1 AND user_id = $2',
      [domain_id, userId]
    );

    if (domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const domain = domainResult.rows[0];
    const dkimResult = await dkimService.checkDKIM(domain.domain_name, selector);

    const result = await pool.query(
      'INSERT INTO test_results (domain_id, test_type, status, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [domain_id, 'dkim', dkimResult.status, JSON.stringify(dkimResult)]
    );

    res.json({ test: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const runDmarcTest = async (req, res, next) => {
  try {
    const { domain_id } = req.body;
    const userId = req.user.id;

    const domainResult = await pool.query(
      'SELECT * FROM domains WHERE id = $1 AND user_id = $2',
      [domain_id, userId]
    );

    if (domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    const domain = domainResult.rows[0];
    const dmarcResult = await dmarcService.checkDMARC(domain.domain_name);

    const result = await pool.query(
      'INSERT INTO test_results (domain_id, test_type, status, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [domain_id, 'dmarc', dmarcResult.status, JSON.stringify(dmarcResult)]
    );

    res.json({ test: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const runSmtpTest = async (req, res, next) => {
  try {
    const { domain_id, host, port } = req.body;
    const userId = req.user.id;

    const domainResult = await pool.query(
      'SELECT * FROM domains WHERE id = $1 AND user_id = $2',
      [domain_id, userId]
    );

    if (domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    // TODO: Implement SMTP testing logic
    const smtpResult = { status: 'pending', message: 'SMTP test not yet implemented' };

    const result = await pool.query(
      'INSERT INTO test_results (domain_id, test_type, status, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [domain_id, 'smtp', smtpResult.status, JSON.stringify(smtpResult)]
    );

    res.json({ test: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const runBlacklistTest = async (req, res, next) => {
  try {
    const { domain_id } = req.body;
    const userId = req.user.id;

    const domainResult = await pool.query(
      'SELECT * FROM domains WHERE id = $1 AND user_id = $2',
      [domain_id, userId]
    );

    if (domainResult.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    // TODO: Implement blacklist checking logic
    const blacklistResult = { status: 'pending', message: 'Blacklist test not yet implemented' };

    const result = await pool.query(
      'INSERT INTO test_results (domain_id, test_type, status, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [domain_id, 'blacklist', blacklistResult.status, JSON.stringify(blacklistResult)]
    );

    res.json({ test: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const getTestResults = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { domain_id, test_type, limit = 50 } = req.query;

    let query = `
      SELECT tr.*, d.domain_name
      FROM test_results tr
      JOIN domains d ON tr.domain_id = d.id
      WHERE d.user_id = $1
    `;
    const params = [userId];

    if (domain_id) {
      params.push(domain_id);
      query += ` AND tr.domain_id = $${params.length}`;
    }

    if (test_type) {
      params.push(test_type);
      query += ` AND tr.test_type = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY tr.created_at DESC LIMIT $${params.length}`;

    const result = await pool.query(query, params);

    res.json({ tests: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT tr.*, d.domain_name
       FROM test_results tr
       JOIN domains d ON tr.domain_id = d.id
       WHERE tr.id = $1 AND d.user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Test result not found' });
    }

    res.json({ test: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

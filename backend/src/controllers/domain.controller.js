import pool from '../config/database.js';

export const createDomain = async (req, res, next) => {
  try {
    const { domain_name, description } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO domains (domain_name, user_id, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [domain_name, userId, description, 'pending']
    );

    res.status(201).json({ domain: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const getDomains = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM domains WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.json({ domains: result.rows });
  } catch (error) {
    next(error);
  }
};

export const getDomainById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM domains WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json({ domain: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const updateDomain = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description, status } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE domains SET description = COALESCE($1, description), status = COALESCE($2, status), updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING *',
      [description, status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json({ domain: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteDomain = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM domains WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json({ message: 'Domain deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const verifyDomain = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // TODO: Implement actual domain verification logic
    // This is a placeholder that marks the domain as verified

    const result = await pool.query(
      'UPDATE domains SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      ['verified', id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json({ domain: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

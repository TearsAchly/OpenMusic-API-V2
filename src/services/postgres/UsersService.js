const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');  
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('User failed to add');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Failed to add user. Username is already in use.');
    }
  }

  async verifyUserCredential(username, password) {
    try {
      const query = {
        text: 'SELECT id, password FROM users WHERE username = $1',
        values: [username],
      };
      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new AuthenticationError('User data not found');
      }

      const { id, password: hashedPassword } = result.rows[0];
      const match = await bcrypt.compare(password, hashedPassword);

      if (!match) {
        throw new AuthenticationError('The credentials you provided are incorrect');
      }

      return id;
    } catch (error) {
      console.error('verifyUserCredential error:', error); // Debugging statement
      throw error;
    }
  }
}

module.exports = UsersService;

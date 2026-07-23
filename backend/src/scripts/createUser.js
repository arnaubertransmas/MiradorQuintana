require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const SALT_ROUNDS = 10;
const VALID_ROLES = ['admin', 'cuina'];

async function main() {
  const [, , email, password, role] = process.argv;

  if (!email || !password || !VALID_ROLES.includes(role)) {
    console.error('Usage: node src/scripts/createUser.js <email> <password> <admin|cuina>');
    process.exitCode = 1;
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await pool.query(
    `INSERT INTO users (email, password, role) VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = EXCLUDED.role`,
    [normalizedEmail, passwordHash, role]
  );

  console.log(`User "${normalizedEmail}" (${role}) created/updated.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

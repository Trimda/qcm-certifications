const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(process.cwd(), 'src', 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

(async () => {
  const updated = await Promise.all(
    users.map(async (u) => {
      if (u.password && !u.password.startsWith('$2')) {
        const hashed = await bcrypt.hash(u.password, 10);
        console.log('Hashed password for:', u.username);
        return { ...u, password: hashed };
      }
      console.log('Already hashed, skipping:', u.username);
      return u;
    })
  );
  fs.writeFileSync(usersPath, JSON.stringify(updated, null, 2), 'utf-8');
  console.log('\nMigration complete.');
})().catch(console.error);

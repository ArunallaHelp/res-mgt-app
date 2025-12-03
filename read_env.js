const fs = require('fs');
try {
  const content = fs.readFileSync('.env.local', 'utf8');
  console.log('---START---');
  console.log(content);
  console.log('---END---');
} catch (err) {
  console.error(err);
}

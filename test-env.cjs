const dotenv = require('dotenv');
process.env.DATABASE_URL = "vercel_url";
dotenv.config({ path: '.env.local' });
console.log(process.env.DATABASE_URL);

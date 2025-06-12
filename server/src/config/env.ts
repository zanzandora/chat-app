import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
  console.log('[env] Loaded from .env.local');
} else {
  dotenv.config();
  console.log('[env] Loaded from .env');
}

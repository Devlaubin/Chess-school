import fs from 'fs';
import path from 'path';

export function getBodyFromBackup(filename: string) {
  const p = path.join(process.cwd(), 'Backup', filename);
  const raw = fs.readFileSync(p, 'utf8');
  const m = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return m ? m[1] : raw;
}

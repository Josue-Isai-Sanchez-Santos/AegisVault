import { stat, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../dist/av007-smoke.js', import.meta.url));
const manifest = fileURLToPath(new URL('../dist/manifest.json', import.meta.url));

try {
  const result = await stat(file);
  if (!result.isFile() || result.size === 0) {
    throw new Error('La salida de compilación está vacía.');
  }
  const text = await readFile(file, 'utf8');
  if (!text.includes('AegisVault')) {
    throw new Error('La salida no incluye el marcador de diagnóstico esperado.');
  }
  try {
    await access(manifest);
    throw new Error('Se ha copiado manifest.json antes de AV-009.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  console.log('AV-007: compilación verificada; sin manifest.json distribuido.');
} catch (error) {
  console.error('AV-007: verificación fallida:', error);
  process.exitCode = 1;
}

import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';

// Lista de nombres de páginas a generar
const pages = [
  'detail-loan',
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Carpeta base donde se crearán las páginas
const baseDir = path.join(__dirname, 'src/views');

// Crear la carpeta base si no existe
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

// Generar carpetas y archivos
pages.forEach(page => {
  const pageDir = path.join(baseDir, `${page}-page`);

  // Crear carpeta de la página
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir);
  }

  // Crear archivos dentro de la carpeta
  fs.writeFileSync(path.join(pageDir, `${page}-page.html`), `<h1>${page} Page</h1>`);
  fs.writeFileSync(path.join(pageDir, `${page}-page.js`), `console.log('Loaded ${page} page');`);
  fs.writeFileSync(path.join(pageDir, `${page}-page.module.css`), `.${page}-page { color: black; }`);
});

console.log('Carpetas y archivos generados exitosamente.');
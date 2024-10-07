import fs from 'fs/promises';

async function getAuto(req, res) {
  try {
    const data = await fs.readFile('autos.txt', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al leer el archivo de autos');
  }
}

export default getAuto;

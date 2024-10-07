import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

async function postAuto(req, res) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const newAuto = JSON.parse(body);
      let data;
      try {
        data = await fs.readFile('autos.txt', 'utf-8');
      } catch {
        data = '{}';
      }
      const autos = data ? JSON.parse(data) : {};
      const id = uuidv4();
      autos[id] = newAuto;

      await fs.writeFile('autos.txt', JSON.stringify(autos, null, 2));
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Auto agregado', id }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error al agregar auto');
    }
  });
}

export default postAuto;

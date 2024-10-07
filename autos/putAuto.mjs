import fs from 'fs/promises';

async function putAuto(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const updateId = url.searchParams.get('id');
  if (!updateId) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('ID es requerido para actualizar');
    return;
  }

  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const updatedAuto = JSON.parse(body);
      const data = await fs.readFile('autos.txt', 'utf-8');
      const autos = JSON.parse(data);

      if (autos[updateId]) {
        autos[updateId] = { ...autos[updateId], ...updatedAuto };
        await fs.writeFile('autos.txt', JSON.stringify(autos, null, 2));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Auto actualizado', id: updateId }));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Auto no encontrado');
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error al actualizar auto');
    }
  });
}

export default putAuto;

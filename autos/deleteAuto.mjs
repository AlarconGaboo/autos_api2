import fs from 'fs/promises';

async function deleteAuto(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const deleteId = url.searchParams.get('id');
  if (!deleteId) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('ID es requerido para eliminar');
    return;
  }

  try {
    const data = await fs.readFile('autos.txt', 'utf-8');
    const autos = JSON.parse(data);

    if (autos[deleteId]) {
      delete autos[deleteId];
      await fs.writeFile('autos.txt', JSON.stringify(autos, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Auto eliminado', id: deleteId }));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Auto no encontrado');
    }
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error al eliminar auto');
  }
}

export default deleteAuto;

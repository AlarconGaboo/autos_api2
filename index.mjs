import http from 'http';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const PORT = 3000;

// Manejar la lectura de autos
async function getAutos(req, res) {
  try {
    const data = await fs.readFile('autos.txt', 'utf-8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  } catch (error) {
    res.statusCode = 500; // Error al leer el archivo
    res.end(JSON.stringify({ message: 'Error al leer los autos' }));
  }
}

// Manejar la adición de un nuevo auto
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
      res.statusCode = 500; // Error al agregar el auto
      res.end(JSON.stringify({ message: 'Error al agregar auto' }));
    }
  });
}

// Manejar la actualización de un auto existente
async function putAuto(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const updateId = url.searchParams.get('id');

  if (!updateId) {
    res.statusCode = 400; // ID es requerido
    res.end(JSON.stringify({ message: 'ID es requerido para actualizar' }));
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
        res.statusCode = 404; // Auto no encontrado
        res.end(JSON.stringify({ message: 'Auto no encontrado' }));
      }
    } catch (error) {
      res.statusCode = 500; // Error al actualizar
      res.end(JSON.stringify({ message: 'Error al actualizar auto' }));
    }
  });
}

// Manejar la eliminación de un auto existente
async function deleteAuto(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const deleteId = url.searchParams.get('id');

  if (!deleteId) {
    res.statusCode = 400; // ID es requerido
    res.end(JSON.stringify({ message: 'ID es requerido para eliminar' }));
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
      res.statusCode = 404; // Auto no encontrado
      res.end(JSON.stringify({ message: 'Auto no encontrado' }));
    }
  } catch (error) {
    res.statusCode = 500; // Error al eliminar
    res.end(JSON.stringify({ message: 'Error al eliminar auto' }));
  }
}

// Crear el servidor
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/autos') {
    switch (req.method) {
      case 'GET':
        getAutos(req, res);
        break;
      case 'POST':
        postAuto(req, res);
        break;
      case 'PUT':
        putAuto(req, res);
        break;
      case 'DELETE':
        deleteAuto(req, res);
        break;
      default:
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Método no permitido');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Ruta no encontrada');
  }
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Exportar el servidor para uso en pruebas
export default server;

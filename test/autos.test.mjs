// autos.test.mjs
import { expect } from 'chai';      // Importar solo expect de Chai
import chaiHttp from 'chai-http';   // Importar chai-http
import server from '../index.mjs';   // Asegúrate de que la ruta sea correcta

// Usar Chai-http
chai.use(chaiHttp);

describe('API de Autos', () => {
  let autoId;

  // Prueba para GET
  it('Debería obtener todos los autos', (done) => {
    chai.request(server)
      .get('/autos')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });

  // Prueba para POST
  it('Debería agregar un nuevo auto', (done) => {
    const nuevoAuto = {
      marca: 'Honda',
      modelo: 'Civic',
      año: 2021,
      precio: 18000
    };

    chai.request(server)
      .post('/autos')
      .send(nuevoAuto)
      .end((err, res) => {
        expect(res).to.have.status(201);
        autoId = res.body.id; // Guardamos el ID para usarlo en el PUT y DELETE
        done();
      });
  });

  // Prueba para PUT
  it('Debería actualizar un auto existente', (done) => {
    const autoActualizado = {
      precio: 18500
    };

    chai.request(server)
      .put(`/autos?id=${autoId}`)
      .send(autoActualizado)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Auto actualizado');
        done();
      });
  });

  // Prueba para DELETE
  it('Debería eliminar un auto existente', (done) => {
    chai.request(server)
      .delete(`/autos?id=${autoId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Auto eliminado');
        done();
      });
  });

  after(() => {
    server.close(); // Cerrar el servidor después de las pruebas
  });
});

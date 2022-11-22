const {Router } = require('express');

const buscarLibro = require('../controllers/buscar_ejemplar');
const sincronicarLista = require('../controllers/sincronicar_lista');
const detalleLibro = require('../controllers/detalle_libro');
const router = Router();




router.get('/', buscarLibro);
router.post('/', sincronicarLista)
router.get('/detalle', detalleLibro);




module.exports =router;
const {Router } = require('express');

const buscarLibro = require('../controllers/buscar_ejemplar');
const sincronicarLista = require('../controllers/sincronicar_lista');
const detalleLibro = require('../controllers/detalle_libro');
const listaCategorias = require('../controllers/lista_categorias');
const resultadosPorCategoria = require('../controllers/resultado_categoria');

const router = Router();


router.get('/', buscarLibro);
router.post('/', sincronicarLista);
router.get('/detalle', detalleLibro);
router.get('/categoria', listaCategorias);
router.get('/categoria/:id', resultadosPorCategoria);


module.exports =router;
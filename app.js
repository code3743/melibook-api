require('dotenv').config();
const Servidor = require('./models/server.model');
const cron = require('node-cron');
const comprararPrecios = require('./utils/comparar.util');


const server = new Servidor();

// cron.schedule('* * * * *',()=>{
//     comprararPrecios({
//     imagen: "https://images.cdn2.buscalibre.com/fit-in/166x166/2e/f1/2ef1021152c828751fed69926b00094b.jpg",
//     nombre: "Transparentes. Historias del Exilio Colombiano",
//     autor: "Javier De Isusi",
//     editorial: "Javier De Isusi",
//     precio_actual: 99094,
//     precio_antes: 165157,
//     descuento: "40%",
//     id: "libro-transparentes-historias-del-exilio-colombiano/9788418215353/p/53097809"
//     });
// })

server.listen();
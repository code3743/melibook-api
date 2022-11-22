const express = require('express');
const cors = require('cors');


class Servidor{
    constructor(){
        this.port = process.env.PORT || 3000;
        this.app = express();
        this.router = '/api'
        this.middelwars();
        this.routes();
    }

    middelwars(){
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:true}))
        this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.router, require('../routers/busca.libre.router'));
    }

    listen(){
        this.app.listen(this.port,()=>{console.log('Corriendo en el puerto: ', this.port)});
    }
}

module.exports = Servidor;
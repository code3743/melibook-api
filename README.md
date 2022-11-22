# Bot BuscaLibre

Permite buscar libros y sincronizar la lista de deseos de un usuario


## endpoints
- api/?buscar=**NOMBRE_DEL_LIBRO**

  *get* paramteros query *buscar*

***Respuesta json***
```
{ 
    busqueda: NOMBRE_DEL_LIBRO,
    resultados: [
        {
            imagen: string, 
            nombre: string,
            autor: string,
            editorial: string,
            precio_actual: int,
            precio_antes: int, 
            descuento: string 
            id: string
        }
        ...
    ]
    
}
```

- api/  *post*

parametros body **user:CORREO pass:CONTRASEÑA**

***Respuesta json***
```
{ 
    numeroListas: int,
    libros: [
        {
            nombreLista: string,
            libros:[
                    {
                        imagen: string, 
                        nombre: string,
                        autor: string,
                        editorial: string,
                        precio_actual: int,
                        precio_antes: int, 
                        descuento: string 
                        id: string
                    }
                    ...
                ]
        }
        ...
    ]
    
}
```
- api/detalle?id=**ID_LIBRO**  

*get* paramteros query *id*

***Respuesta json***
```
{ 
    
    formato: string,
    autor: string,
    editorial: string,
    anno: string,
    idioma: string,
    paginas: string,
    encuadernacion: string,
    dimension: string,
    isbn13: string,
    categoria: string,
    imagen: string,
    nombre: string,
    descripcion: string,
    precios: {
        ahora: int,
        antes: int,
        ahorro: int,
        descuento: string
    },
    estado: string,
    stock: string,
    urlCompra: string
}
```



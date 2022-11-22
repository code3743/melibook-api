const { chromium  } = require('playwright-chromium');
const {request, response } = require('express');


const sincronizarLista = async (req = request, res = response)=>{
    const { pass, user } = req.body;
    try {
        const navegador = await chromium.launch({ chromiumSandbox: false});
        const page = await navegador.newPage();
        await page.goto(process.env.BASE_URL+'v2/u/dashboard#lista-deseos');
        await page.waitForLoadState();
        await page.fill('input[id="signin_username"]', user);
        await page.click('#submit_login');
        await page.waitForLoadState();
        const evaluarEmail = await page.evaluate(()=>{
            return (document.querySelector('#registrarUsuario').style.display === 'none' && document.querySelector('.msg-error').style.display === 'none' );
        });

        if(!evaluarEmail){
            await navegador.close();
            res.status(401).json({
                mensaje: 'Verifique el correo'
            });
            return;
        }
        await page.fill('input[id="signin_password"]', pass);
        await page.click('#submit_login');
      
        await page.waitForTimeout(750);
        const evaluarPass = await page.evaluate(()=>{
            return document.querySelector('#signin_password') ? true : false; 
        });

        if(evaluarPass){
            await navegador.close();
            res.status(401).json({
                mensaje: 'Contraseña incorrecta'
            });
            return;
        }

        await page.waitForLoadState();
       
        await page.waitForSelector('.ul-wishlist>li');
        const indexLista = await page.evaluate(()=>{
            return listaDeDeseos = document.querySelectorAll('.ul-wishlist>li').length ?? 0;
        });

        if(indexLista === 0){
            await navegador.close();
            res.json({
                numerolistas: indexLista,
                libros: []
            });
            return;
        }

        const listaTemporal = [];
        for(let i= 0; i<indexLista; i++){
            await page.evaluate((i)=>{
                document.querySelectorAll('.ul-wishlist>li')[i].querySelector('a').click();
                }, i);
            await page.waitForTimeout(500);
            const ejemplares = await page.evaluate(()=>{
                const nombreLista = document.querySelector('.contenidoBoard.listaDeseosProductos>h1').innerText.replace('Cambiar nombre','');
                const libros = [];
                document.querySelectorAll('.productosLista>div>a').forEach((libro)=>{
                    const imagen = libro.querySelector('.img-div>img').src;
                    const nombre = libro.querySelector('.title').innerText;
                    const autor = libro.querySelector('.field ').innerText;
                    const editorial = libro.querySelector('.autor').innerText;
                    const precio_actual = parseInt(libro.querySelector('.precioAhora').innerText.split('$ ')[1].replace('.',''))
                    const precio_antes = parseInt(libro.querySelector('.precioAntes').innerText.split('$ ')[1].replace('.',''))
                    const descuento = libro.querySelector('.descuento-percent>strong').innerText;
                    const id = libro.href.replace('https://www.buscalibre.com.co/','');
                    libros.push(
                        {imagen,
                        nombre,
                        autor,
                        editorial,
                        precio_actual,
                        precio_antes,
                        descuento,
                        id}
                    );
                });
                return {
                    nombreLista,
                    libros
                }
            });
            listaTemporal.push(ejemplares);
        }

        await navegador.close();
        res.json({
            numerolistas: indexLista,
            libros: listaTemporal
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Algo salio mal',
            ...error
        }
        );
    }
};

module.exports = sincronizarLista;
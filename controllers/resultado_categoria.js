const { chromium  } = require('playwright-chromium');
const {request, response } = require('express');


const resultadosPorCategoria = async (req = request, res = response)=>{
    const idCategoria = 'libros/' + req.params.id ;
    try {
        const navegador = await chromium.launch({ chromiumSandbox: false});
        const page = await navegador.newPage();
        await page.goto(process.env.BASE_URL + idCategoria);
        await page.waitForLoadState();
        const resultados =  await page.evaluate(()=>{
            const resultados = document.querySelectorAll('.productos>.box-producto>a') ?? [];
            const ejemplares = [];
            resultados.forEach((ejemplar)=>{
                const imagen =  ejemplar.querySelector('.imagen>img').dataset.src;
                const nombre = ejemplar.querySelector('.nombre').innerText;
                const autor = ejemplar.querySelector('.autor').innerText;
                const editorial = ejemplar.querySelector('.autor.color-dark-gray').innerText;
                const precio_actual  = ejemplar.querySelector('.box-precios>.precio-ahora').innerText.split('$ ')[1];
                const precio_antes  = ejemplar.querySelector('.box-precios>.precio-antes').innerText.split('$ ')[1];
                const descuento = ejemplar.querySelector('.descuento-v2').innerText.split('\n')[0];
                const id = ejemplar.href.replace('https://www.buscalibre.com.co/','');
                ejemplares.push({
                    imagen, nombre, autor, editorial, precio_actual: parseInt(precio_actual.replace('.', '')), precio_antes: parseInt(precio_antes.replace('.', '')), descuento, id
                });
            });
            return ejemplares;
        });
        res.json({
            resultados
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Algo salio mal',
            ...error
        }
        );
    }
}

module.exports =  resultadosPorCategoria;
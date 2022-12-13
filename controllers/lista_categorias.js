const { chromium  } = require('playwright-chromium');
const {request, response } = require('express');

const listaCategorias = async(req = request, res = response)=>{
    try {
        const navegador = await chromium.launch({ chromiumSandbox: false});
        const page = await navegador.newPage();
        await page.goto(process.env.BASE_URL);
        await page.waitForLoadState();
        
        const categorias = await page.evaluate(()=>{
            const categorias = [];
            document.querySelector('.box-list').querySelectorAll('.category-li>a').forEach((item)=>{
                categorias.push({
                    nombre: item.innerText,
                    id: item.href.replace('https://www.buscalibre.com.co/libros/','')
                });
            });
            return categorias;
        });
        await navegador.close();
        res.json({
            total: categorias.length,
            categorias
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'Algo salio mal',
            ...error
        }
        );
    }  
}

module.exports = listaCategorias;
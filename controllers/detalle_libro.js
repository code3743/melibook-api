const { chromium  } = require('playwright-chromium');
const {request, response } = require('express');

const detalleLibro = async (req = request, res = response)=>{
    let idLibro = req.query.id ?? '';
    try {
        const navegador = await chromium.launch({ chromiumSandbox: false});
        const page = await navegador.newPage();
        await page.goto(process.env.BASE_URL + idLibro);
        await page.waitForLoadState();
        const fichaLibro = await page.evaluate(()=>{        
            const imagen = document.querySelector('.imagen>img').dataset.src ?? document.querySelector('.imagen>img').src;
            const nombre = document.querySelector('.tituloProducto').innerText;
            const etiquetas = [
                "Formato",
                "Autor",
                "Editorial",
                "Año",
                "Idioma",
                "N° páginas",
                "Encuadernación",
                "Dimensiones",
                "Isbn13",
                "Categoría(s)"
            ];
            const ficha = {
                formato : '',
                autor: '',
                editorial: '',
                anno: '',
                idioma: '',
                paginas: '',
                encuadernacion: '',
                dimension: '',
                isbn13: '',
                categoria: ''
            }
            document.querySelectorAll('.ficha>div>.col-xs-5').forEach((etiqueta, i)=>{
                for(let j= 0; j<etiquetas.length; j++){
                    if(etiqueta.innerText == etiquetas[j]){
                        ficha[Object.keys(ficha)[j]] = document.querySelectorAll('.ficha>div>.col-xs-7')[i].innerText;
                        break;
                    }
                }   
            });
         
             return {imagen, nombre, ...ficha}
            });
        
        const infoLibro = await page.evaluate(()=>{
           
            const descripcion =  document.querySelector('.descripcionBreve>div') ? document.querySelector('.descripcionBreve>div').innerText : '';
            if(!document.querySelector('.font-size-small.color-green.margin-right-10.margin-bottom-10'))
                return { descripcion, precios: {ahora:0, antes:0, ahorro:0, descuento:''}, estado:'', stock:'Sin Stock'};
            const precios = [];
            document.querySelectorAll('#box-precio-compra>div>div>div>p').forEach((precio)=>{
                precios.push(parseInt(precio.innerText.split('$ ')[1].replace('.','')));
            });
            const [ahora , antes, ahorro] = precios;
            const estado = document.querySelector('.estado').innerText;
            const descuento = document.querySelector('.box-descuento').innerText.split(' ')[0];
            const stock = document.querySelector('.font-size-small.color-green.margin-right-10.margin-bottom-10').innerText;
            
            return { descripcion, precios: {ahora, antes, ahorro, descuento}, estado, stock}
        });
        const urlCompra = await page.evaluate(()=>{
            try {
                const producto = document.querySelector('.box-comprar>.agregar>input[name="c_producto"]').value;
                const provedor = document.querySelector('.box-comprar>.agregar>input[name="c_proveedor"]').value;
                return `https://www.buscalibre.com.co/carro/agregar?c_producto=${producto}&c_proveedor=${provedor}&cantidad=1`;
            } catch (error) {
                return 'Sin Stock'
            }
        });
        await navegador.close();
        res.json({
            ...fichaLibro,
            ...infoLibro,
            urlCompra
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'Algo salio mal',
            error
        }
        );
    }
};


module.exports = detalleLibro;
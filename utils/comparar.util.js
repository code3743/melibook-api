const {chromium} = require('playwright-chromium');


const obtenerPrecios = async(idLibro)=>{
    try {
        const navegador = await chromium.launch({ chromiumSandbox: false});
        const page = await navegador.newPage();
        await page.goto(process.env.BASE_URL + idLibro);
        await page.waitForLoadState();
        
        const infoLibro = await page.evaluate(()=>{
            const stock = document.querySelector('.font-size-small.color-green.margin-right-10.margin-bottom-10').innerText;
            const precios = []
            document.querySelectorAll('#box-precio-compra>div>div>div>p').forEach((precio)=>{
                precios.push(parseInt(precio.innerText.split('$ ')[1].replace('.','')))
            })
            const [ahora , antes, ahorro] = precios;
            const descuento = document.querySelector('.box-descuento').innerText;
            return {ahora, antes, ahorro, descuento, stock}
        });
        await navegador.close();
       return infoLibro;
    }catch(error){
        console.log(error);
        return {
            ahora: 0,
            antes: 0,
            ahorro: 0,
            descuento: 0,
            stock: 0
        }
    }
}


const comprararPrecios = async (libroDB)=>{

    const precioLibroDB = libroDB.precioActual;
    const precioActual = await obtenerPrecios(libroDB.id)

    if( precioActual.ahora < precioLibroDB){
        console.log('Bajo precio');
    }else if (precioActual.ahora > precioLibroDB){
        console.log('Subio precio');
    }else console.log('precio igual')

}


module.exports = comprararPrecios;
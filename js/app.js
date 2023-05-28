
var usd_cot_oficial = 0
// API 
// let token = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTU0MjMwNzQsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJtdmF6cXVlem11bHRpbWVkaWFAZ21haWwuY29tIn0.H8-zPUvXIo7l8lbGqM4i7IBlUsRSdwXDVZOhb-_hE13mWYqxHHYbFRS0HFBGT8VZOO8Yropt6i2yRYnEFkBNsg';
// Vence 2024-05-11 07:24:34
// Se pueden hacer 100 request por día
// https://estadisticasbcra.com/api/documentacion // NO FUNCIONO - PROBLEMA DE CORS

async function getUSDdata() {
    const resp = await fetch(`https://api.bluelytics.com.ar/v2/latest`);
    // console.log(resp)
    const json = await resp.json();
    // console.log(json)
    usd_cot_oficial = json.oficial.value_sell
    // console.log('Cot Oficial: ' + usd_cot_oficial)
    let precio_usd_productos = document.getElementById('productos').getElementsByClassName('contenedor-precio');

    // recorro los items publicados para transformar el precio
    for( i=0; i< precio_usd_productos.length; i++ )
    {
        let precio_producto = precio_usd_productos[i].querySelector('.precio').textContent
        // limpio el string de simbolos dejo el número solo
        precio_producto = precio_producto.replace(/\D/g, '')
        // tranformo a número
        precio_producto = Number(precio_producto)
        // transformo $AR a USD
        let precio_usd_producto = Math.round(precio_producto / usd_cot_oficial)
        // console.log('Precio USD: ' + precio_usd_producto)
        // modifico el precio en dolares de acuerdo a la cot
        precio_usd_productos[i].querySelector('.precio_usd').innerHTML = 'USD ' + precio_usd_producto
    }
}
getUSDdata();



const btnCarrito = document.querySelector('.contenedor-carrito-icono') 

const contenedorProductosCarrito = document.querySelector('.contenedor-productos-carrito')

const divtotal = document.querySelector('.carrito-total')
const botonComprar = document.querySelector('.comprar')


btnCarrito.addEventListener('click', () => {
    contenedorProductosCarrito.classList.toggle('ocultar')
})

const productoSeleccionado = document.querySelector('.producto-seleccionado')
const filaDeUnProducto = document.querySelector('.fila-de-un-producto')

const productosOfrecidos = document.querySelector('.contenedor-productos-ofrecidos')

let productosFinalesSeleccionados = []

const valorTotal = document.querySelector('.total-pagar')
const valorTotalUSD = document.querySelector('.total-pagar-usd')

const contadorProductos = document.querySelector('#contador-productos')


productosOfrecidos.addEventListener('click', e => {

    if (e.target.classList.contains('btn-agregar-carrito')){

        const producto = e.target.parentElement

        const infoProductoElegido = {
            cantidad: 1,
            titulo: producto.querySelector('h2').textContent,
            precio: producto.querySelector('p.precio').textContent,
            precio_usd: producto.querySelector('p.precio_usd').textContent
        }
       

        const existe = productosFinalesSeleccionados.some( producto => producto.titulo === infoProductoElegido.titulo)

        //======================actualiza cantidad del mismo producto======================       
        if (existe){
            const productosActualizados = productosFinalesSeleccionados.map(producto => {

            if(producto.titulo === infoProductoElegido.titulo){
                producto.cantidad++;
                return producto;
            }
            else{
                return producto
            }
         }    
         )
         
        productosFinalesSeleccionados = [...productosActualizados]
        }
        //=================== fin actualiza cantidad del mismo producto======================

        //================agrega el nuevo producto que no existia en la lista================
       
        else{

            productosFinalesSeleccionados = [...productosFinalesSeleccionados, infoProductoElegido]         
    
            console.log(productosFinalesSeleccionados)

        } 
        
        // Guardamos los productos seleccionados en el localStorage para usarlo en otra pagina a esos datos 
        localStorage.setItem('productosSeleccionados', JSON.stringify(productosFinalesSeleccionados));

        //============= fin agrega el nuevo producto que no existia en la lista =============
        
        //=== al apretar X en un producto, eliminarlo de la lista y que se descuente del total ====
        filaDeUnProducto.addEventListener('click', (e) =>{ 

            if (e.target.classList.contains('icono-cerrar')){ 
                const productoEntero = e.target.parentElement 
                const tituloDeProductoAEliminar = productoEntero.querySelector('p').textContent 

                productosFinalesSeleccionados = productosFinalesSeleccionados.filter( productoAFiltrar => productoAFiltrar.titulo !== tituloDeProductoAEliminar)        
                       
            mostrarYAplicarEnHTML(); 
       
            }

        })

        //=== fin al apretar X en un producto, eliminarlo de la lista y que se descuente del total====

        mostrarYAplicarEnHTML();

    }
})

// Funcion para mostrar y aplicar cambios en HTML

const mostrarYAplicarEnHTML = () =>{

  
    // Limpiar HTML de lo que tenia antes en la lista de productos seleccionados:
    filaDeUnProducto.innerHTML = " ";
 
       
    //------------------------ nos fijamos si el carrito esta vacio ------------------------
      if (!productosFinalesSeleccionados.length){ 
        filaDeUnProducto.innerHTML= `
        <p class="carrito-vacio">El carrito esta vacio </p>
        `

        divtotal.classList.add('ocultar')
        botonComprar.classList.add('ocultar')
           
    }
    else
    {
        divtotal.classList.remove('ocultar')
        botonComprar.classList.remove('ocultar')
    }

    //------------------------ fin de ver si el carrito esta vacio ------------------------

    let totalaPagar = 0;
    let totalaPagarUSD = 0;
    let contadorDeProductosEnCarrito = 0; 

    //=====================================================================================
    //        ACA ARRANCA EL PROCESO DE METER EN EL MENU LOS PRODUCTOS SELECCIONADOS
    //=====================================================================================
    
    productosFinalesSeleccionados.forEach(producto =>{ 

    const divNuevoProductoMenu = document.createElement('div')

    divNuevoProductoMenu.classList.add('producto-seleccionado')
        
    divNuevoProductoMenu.innerHTML =    
 
    `                                      
        <div class="info-producto-seleccionado">
            <span class="cantidad-producto-seleccionado">${producto.cantidad}</span> 
            <p class="titulo-producto-seleccionado">${producto.titulo}</p>
            <div class="contenedor-productos-sel">
                <span class="precio-producto-seleccionado">${producto.precio}</span>
                <span class="precio-producto-seleccionado-usd">${producto.precio_usd}</span>
            </div>
        </div>
        <!-- icono de X -->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24     24"     stroke-width="1.5" stroke="currentColor" class="icono-cerrar">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18        6M6 6l12 12" />
        </svg>
    `
   
    filaDeUnProducto.append(divNuevoProductoMenu)
   
    //==estamos dentro del forEach, recorriendo de a una vez productosFinalesSeleccionados======
    //== productosFinalesSeleccionados tiene la cantidad definitiva de productos seleccionados ==
    //========= por el usuario y en que cantidades, por lo cual en cada iteracion  ========
    //======== vamos sumando por cada producto el valor por la cantidad, =========
    //============== en variables que iran acumulando la de todos los productos ==============



    //====================================================================================
    //====================================================================================
    // Inicio quitar los puntos y pueda
    //hacer la operacion de sumar los valores, y los vuelva a mostrar con puntos.
    //si el resultado es de miles, con un solo punto, si supera el millon con dos puntos.
    let precioEntero = parseInt(producto.precio.slice(1).replace('.',''))
    let precioEnteroUSD = parseInt(producto.precio_usd.replace(/\D/g, ''))
    
    totalaPagar = totalaPagar + parseInt(producto.cantidad * precioEntero) 
    totalaPagarUSD = totalaPagarUSD + parseInt(producto.cantidad * precioEnteroUSD) 
    
    contadorDeProductosEnCarrito = contadorDeProductosEnCarrito + producto.cantidad    

    }
    )
    let totalFormateado = formatearNumero(totalaPagar);
    let totalFormateadoUSD = formatearNumero(totalaPagarUSD);

    function formatearNumero(numero) {
        let totalTexto = numero.toString();
        let longitud = totalTexto.length;
        if (longitud <= 3) {
            return totalTexto;
        } else {
            let primeraParte = totalTexto.slice(0, longitud - 3);
            let segundaParte = totalTexto.slice(longitud - 3);
            let primeraParteFormateada = primeraParte.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return primeraParteFormateada + "." + segundaParte;
        }
}
// fin quitar los puntos y pueda
//hacer la operacion de sumar los valores, y los vuelva a mostrar con puntos.
//si el resultado es de miles, con un solo punto, si supera el millon con dos puntos.
//====================================================================================
//====================================================================================





    //=====================================================================================
    //        TERMINA EL PROCESO DE METER EN EL MENU LOS PRODUCTOS SELECCIONADOS
    //=====================================================================================



    
    //=====================================================================================
    //          INICIA PONER EL TOTAL FINAL $, Y LA CANTIDAD DE PRODUCTOS SELECCIONADOS
    //=====================================================================================

    valorTotal.innerText = `$ ${totalFormateado}` 
    valorTotalUSD.innerText = `USD ${totalFormateadoUSD}` 
    
    contadorProductos.innerText = contadorDeProductosEnCarrito 

    //=====================================================================================
    //         FIN PONER EL TOTAL FINAL $, Y LA CANTIDAD DE PRODUCTOS SELECCIONADOS
    //=====================================================================================

} 


//=====================================================================================
//                        INICIO BARRA DE PROGRESO
//=====================================================================================

    const paginaCompleta = document.querySelector('.pagina')
    const barraDeProgreso = document.querySelector('#barraDeProgreso')
    
    const barraDeProgresoAnimada = () =>{
    let posicionScroll = -paginaCompleta.getBoundingClientRect().top
    
    
    let numerosDeProgreso = (posicionScroll / (paginaCompleta.getBoundingClientRect().height - document.documentElement.clientHeight)) * 100
     let value = Math.floor(numerosDeProgreso)
     barraDeProgreso.style.width = `${value}%`
    
    
    if (value < 0 ){
        return (barraDeProgreso.style.width = "0%")
    }

    if(value > 95){
        return (barraDeProgreso.style.width = "120%")
    }
    
    }
    
 
    

    window.addEventListener('scroll', () =>{ 

         if(window.innerWidth < 480){
            barraDeProgresoAnimada();
            }

        })
      
    
    
//=====================================================================================
//                        FIN BARRA DE PROGRESO
//=====================================================================================


var contenedores = document.querySelectorAll('.item');

// metemos los div, que contienen cada producto, con su imagen y otras cosas
//a la variable contenedores
//en este caso no metemos un solo div, sino muchos, asi que sera de tipo nodelist
//es similar a un arreglo, pero en cada posicion tiene un objeto


contenedores.forEach(function(contenedor) {
//lo recorremos con forEach, y por cada iteracion, que ejecute la funcion
  var imagen = contenedor.querySelector('.imagen');
//metemos la clase .imagen (que esta dentro del div de esta iteracion)
//en la variable imagen
  contenedor.addEventListener('mousemove', function(e) {
//cada vez que se pase el mouse por este div, que se ejecute la siguiente funcion:
var x = e.offsetX / contenedor.offsetWidth * 100;
//metemos en la variable x, la division entre la posición horizontal 
// del cursor del mouse dentro del elemento contenedor (div)
//en esta iteracion, y el ancho total del elemento contenedor
// (contenedor.offsetWidth). (seria el ancho total del div)
//y luego lo multiplica por 100 para obtener un porcentaje. 
//El resultado es la posición relativa del cursor del mouse 
//dentro del elemento contenedor, expresado en porcentaje.*/
    var y = e.offsetY / contenedor.offsetHeight * 100;
//lo mismo pero con la posicion vertical del cursor del mouse
    imagen.style.transformOrigin = x + '% ' + y + '%';
//y hacemos un transform-origin de css, pero desde javascript. en la clase de la .imagen
//estableciendo el punto de origen de la transformacion
//con lo cual el zoom que aplicamos con el hover que ya teniamos en css
//se originara en las coordenadas donde tengamos el puntero del mouse
  });
});





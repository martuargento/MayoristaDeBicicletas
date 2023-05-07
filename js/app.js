const btnCarrito = document.querySelector('.contenedor-carrito-icono') 

const contenedorProductosCarrito = document.querySelector('.contenedor-productos-carrito')

const divtotal = document.querySelector('.carrito-total')


btnCarrito.addEventListener('click', () => {
    contenedorProductosCarrito.classList.toggle('ocultar')
})

const productoSeleccionado = document.querySelector('.producto-seleccionado')
const filaDeUnProducto = document.querySelector('.fila-de-un-producto')

const productosOfrecidos = document.querySelector('.contenedor-productos-ofrecidos')

let productosFinalesSeleccionados = []

const valorTotal = document.querySelector('.total-pagar')

const contadorProductos = document.querySelector('#contador-productos')


productosOfrecidos.addEventListener('click', e => {

    if (e.target.classList.contains('btn-agregar-carrito')){

        const producto = e.target.parentElement

        const infoProductoElegido = {
            cantidad: 1,
            titulo: producto.querySelector('h2').textContent,
            precio: producto.querySelector('p').textContent
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
           
    }
    else
    {
        divtotal.classList.remove('ocultar')
    }

    //------------------------ fin de ver si el carrito esta vacio ------------------------

    let totalaPagar = 0;
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
            <span class="precio-producto-seleccionado">${producto.precio}</span>
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
    totalaPagar = totalaPagar + parseInt(producto.cantidad * producto.precio.slice(1)) 
    contadorDeProductosEnCarrito = contadorDeProductosEnCarrito + producto.cantidad    

    }
    )
    //=====================================================================================
    //        TERMINA EL PROCESO DE METER EN EL MENU LOS PRODUCTOS SELECCIONADOS
    //=====================================================================================



    
    //=====================================================================================
    //          INICIA PONER EL TOTAL FINAL $, Y LA CANTIDAD DE PRODUCTOS SELECCIONADOS
    //=====================================================================================

    valorTotal.innerText = `$ ${totalaPagar}` 
    
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

 




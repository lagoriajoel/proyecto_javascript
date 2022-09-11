

          
                //elemntos del DOM
                const card=document.querySelector('.mycards'),
                template=document.getElementById('template').content,
                fragment=document.createDocumentFragment()
                //Creamos un objeto carrito
                let carrito = {} 
               // realizamos un fetch y consumimos los datos del archivo .json
                const fetchData = async () => {
                    const res = await fetch('datos.json');
                    const data = await res.json()
                  
                    mostrarCards(data)
                 
                }
                
                
                //muestro las las card mediante el uso de template
                const mostrarCards= data => {data.forEach(elem=>{
                
                
                    template.querySelector("img").setAttribute("src",elem.img);
                    template.querySelector(".mycard").classList.add(elem.tipo) 

                    template.querySelector("img").setAttribute("alt",elem.nombre);
                    template.querySelector("figcaption").textContent=elem.nombre;
                    template.querySelector(".precio").textContent="$ "+elem.precio;
                    template.querySelector(".descripcion").textContent=elem.descripcion;
                    template.querySelector(".addcarrito").dataset.id=elem.id;

                
                    let clone= document.importNode(template, true)
                
                    fragment.appendChild(clone)
                 
                
                })

               
                card.appendChild(fragment)}


                // al cargar la pagina se realiza el fetch, se carga el carrito del local storage
                document.addEventListener('DOMContentLoaded', e => {
                    fetchData()
                    if (localStorage.getItem('carrito')) {
                      carrito=JSON.parse(localStorage.getItem('carrito'))
                      mostrarCarrito()
                    }
                    
                  
                  })
              //
              
              //agregamos el metodo addEventListener a los botones de filtrado

              let btnTodas = document.getElementById("btnTodas");
              let btnSimple = document.getElementById("btnSimple");
              let btnDoble = document.getElementById("btnDoble");
              let btnVeggie = document.getElementById("btnVeggie");
              btnTodas.addEventListener("click", () =>filtrarProductos('todas'));
              btnSimple.addEventListener("click", () =>filtrarProductos('simple'));
              btnDoble.addEventListener("click", () =>filtrarProductos('doble'));
              btnVeggie.addEventListener("click", () =>filtrarProductos('veggie'));

               // funcion para filtrar las hamburguesas por tipos
              function filtrarProductos(value) {
                //traemos los botones
                let botones = document.querySelectorAll(".btnFiltro");
                botones.forEach((button) => {
                //chequeamos si el valor es igual al texto
                  if (value.toUpperCase() == button.innerText.toUpperCase()) {
                    button.classList.add("active");
                  } else {
                    button.classList.remove("active");
                  }
                });
                //seleccionamos todas las card
                let elementos = document.querySelectorAll(".mycard");
               
                //iteramos


                elementos.forEach((element) => {

                // aplicacion de operadores ternarios

                  value == "todas" ?  element.classList.remove("hide") :  element.classList.contains(value) ? element.classList.remove("hide"): element.classList.add("hide");
                   
                  
                });
              }
            
              //mostramos inicialmente todos los productos
              window.onload = () => {
                filtrarProductos("todas");
              };
             
              // cuerpo del carrito
              const itemsCarrito= document.getElementById("itemsCarrito");
              const templateCarrito= document.getElementById("templateCarrito").content;
              const templateFooter= document.getElementById("templateFooter").content;
              const footer= document.getElementById("footer");


                // agregamos el evento click a los botones de las cards para agregar al carrito
                card.addEventListener("click", e => {
                  addCart(e)
                    })

                itemsCarrito.addEventListener("click", e => {

                  btnAccion(e)
                })
              
                const addCart= e => {
                if (e.target.classList.contains("addcarrito")) {
                    
                  setCarrito(e.target.parentElement)
                 
                }
                e.stopPropagation()
              }

              const setCarrito= objeto=> {
              
                const repetido =objeto.querySelector(".addcarrito").dataset.id
             
              // utilizacion de libreria sweet Alert

               if(Object.values(carrito).some(function(elem){
                return elem.id===repetido;
               })){
                console.log(repetido);
                Swal.fire({
                  icon: 'error',
                  title: 'Producto ya agregado',
                
                })
               }

               else{
    
                const producto = {
                  id: objeto.querySelector(".addcarrito").dataset.id,
                  nombre: objeto.querySelector("figcaption").textContent,
                  precio: objeto.querySelector(".precio").textContent.slice(2),
                  cantidad: 1
                }
              
                Swal.fire({
                  icon: 'success',
                  title: 'Producto agregado',
                
                })
             
                 //utilizacion del Spread
                carrito[producto.id] = {...producto}

                mostrarCarrito()
              
               }

              }
               
              //funcion que muestra el carrito

               const mostrarCarrito = ()=>{
                  
                  itemsCarrito.innerHTML="";
                  Object.values(carrito).forEach(productos =>{

                     
                     templateCarrito.querySelectorAll('td')[0].textContent = productos.nombre
                     templateCarrito.querySelectorAll('td')[1].textContent = productos.cantidad
                  

                     templateCarrito.querySelector('.btn-info').dataset.id=productos.id
                     templateCarrito.querySelector('.btn-danger').dataset.id=productos.id
                     templateCarrito.querySelector('span').textContent = productos.cantidad * productos.precio
                      const clone = templateCarrito.cloneNode(true)
                      fragment.appendChild(clone)
                  
                    })

                    itemsCarrito.appendChild(fragment)
                   mostrarTotal()

                   localStorage.setItem('carrito', JSON.stringify(carrito))
            
               }
               // funcion que muestra el total del carrito

               const mostrarTotal = () => {  
                footer.innerHTML = ""
                if (Object.keys(carrito).length === 0) {
                  footer.innerHTML= `
                  <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
                  `
                  return
                }
               // funcion para calcular la catidad de productos
                const cantidad = Object.values(carrito).reduce((acum,{cantidad})=>acum +cantidad,0)
                // funcion para calcular el total a pagar
                const precio = Object.values(carrito).reduce((acum,{cantidad, precio})=>acum +cantidad*precio,0)

                templateFooter.querySelectorAll('td')[0].textContent= cantidad
                templateFooter.querySelector('span').textContent= precio

                const clone = templateFooter.cloneNode(true)
                fragment.appendChild(clone)
                footer.appendChild(fragment)

                //boton para vaciar el carrito

                const btnVaciar= document.getElementById('vaciarCarrito')
                btnVaciar.addEventListener('click', () => {
                 
                  carrito={}
                 
                  mostrarCarrito()
                })

              }

              //funcion que permite aumentar o disminuir la cantidad de productos en el carrito.

              const btnAccion= e=> {

                //aumentar la cantidad de productos en el carrito

                if (e.target.classList.contains('btn-info')) {
                    console.log(carrito[e.target.dataset.id]);
                    const producto = carrito[e.target.dataset.id];
                    producto.cantidad++;

                    carrito[e.target.dataset.id] = {...producto}

                    mostrarCarrito()
                }
                     //disminuir la cantidad de productos en el carrito

                if (e.target.classList.contains('btn-danger')) {
              
                  const producto = carrito[e.target.dataset.id];
                  producto.cantidad--;

                      if (producto.cantidad === 0) {
                          console.log("aca");
                          delete carrito[e.target.dataset.id]
                       
                      }
               
                
                  mostrarCarrito()
              }
              e.stopPropagation()
              }

              //boton confirmar compra

              const btnConfirmar=document.getElementById("btnConfirmarCompra")
             

              btnConfirmar.addEventListener("click", () => { 
                carrito={}
                mostrarCarrito()
                Swal.fire({
                  icon: 'success',
                  title: 'Gracias por su compra',
                  text: 'su pedido fue tomado',
                  footer: '<a href="">Why do I have this issue?</a>'
                })
                
              })
              
             

            
             

           
                

              
                
              
              

            

           
      
      

     


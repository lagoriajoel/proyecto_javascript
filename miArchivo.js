


                const card=document.querySelector('.cards'),
                template=document.getElementById('template').content,
                fragment=document.createDocumentFragment()
                let carrito = {}
                
                const fetchData = async () => {
                    const res = await fetch('datos.json');
                    const data = await res.json()
                    console.log(data)
                    mostrarCards(data)
                }
                
                
                
                const mostrarCards= data => {data.forEach(elem=>{
                
                
                    template.querySelector("img").setAttribute("src",elem.img);
                    template.querySelector(".card").classList.add(elem.tipo) 

                    template.querySelector("img").setAttribute("alt",elem.nombre);
                    template.querySelector("figcaption").textContent=elem.nombre;
                    template.querySelector(".precio").textContent="$ "+elem.precio;
                    template.querySelector(".descripcion").textContent=elem.descripcion;
                    template.querySelector(".addcarrito").dataset.id=elem.id;

                
                    let clone= document.importNode(template, true)
                
                    fragment.appendChild(clone)
                
                })
                
                card.appendChild(fragment)}
                
                document.addEventListener('DOMContentLoaded', e => {
                    fetchData()})
              //
              
              //agregamos el metodo addEventListener a los botones de filtrado

              let btnTodas = document.getElementById("btnTodas");
              let btnSimple = document.getElementById("btnSimple");
              let btnDoble = document.getElementById("btnDoble");
              let btnVeggie = document.getElementById("btnVeggie");
              btnTodas.addEventListener("click", () =>filterProduct('todas'));
              btnSimple.addEventListener("click", () =>filterProduct('simple'));
              btnDoble.addEventListener("click", () =>filterProduct('doble'));
              btnVeggie.addEventListener("click", () =>filterProduct('veggie'));


              function filterProduct(value) {
                //traemos los botones
                let buttons = document.querySelectorAll(".btnFiltro");
                buttons.forEach((button) => {
                  //check si el valor es igual al texto
                  if (value.toUpperCase() == button.innerText.toUpperCase()) {
                    button.classList.add("active");
                  } else {
                    button.classList.remove("active");
                  }
                });
                //seleccionamos todas las card
                let elements = document.querySelectorAll(".card");
                console.log(elements);
                
                //iteramos


                elements.forEach((element) => {

                // aplicacion de operadores ternarios

                  value == "todas" ?  element.classList.remove("hide") :  element.classList.contains(value) ? element.classList.remove("hide"): element.classList.add("hide");
                   
                  
                });
              }
            
              //mostramos inicialmente todos los productos
              window.onload = () => {
                filterProduct("todas");
              };
              //nuevo carrito
                card.addEventListener("click", e => {
                  addCart(e)
                })
              const addCart= e => {
                if (e.target.classList.contains("addcarrito")) {
                
                  setCarrito(e.target.parentElement)
                }
                e.stopPropagation()
              }

              const setCarrito= objeto=> {
              
                const producto = {
                  id: objeto.querySelector(".addcarrito").dataset.id,
                  nombre: objeto.querySelector("figcaption").textContent,
                  precio: objeto.querySelector(".precio").textContent.slice(2),
                  cantidad: 1
                }
             

                carrito[producto.id] = {...producto}
                console.log(carrito);
              }

              Object.values(carrito).forEach(objeto=> {

                  console.log(objeto);

              })


              // creamos un array para el carrito
              //carrito=[];
              // funcion para agragar productos al carrito
             
              function addCarrito(id){
                
                let productoAgregado=menu.datos.find(elem => elem.id==id);
                let productoenCarrito=carrito.find(elem => elem.id==id);
                console.log(carrito);
                if (productoenCarrito == undefined){
                  carrito.push(productoAgregado);
                 
                  //Cargar al storage
                  localStorage.setItem("carrito", JSON.stringify(carrito));
                  Swal.fire({
                      title: "Ha agregado el producto",
                   
                      icon: "success",
                      timer: 2000,
                      showConfirmButton: false,
                      confirmButtonText:"Entendido",
                  })
              }else{
                
                  Swal.fire({
                              title: "Producto ya agregado",
                            
                              icon: "info",
                              timer:4000,
                              confirmButtonText:"Aceptar",
                              confirmButtonColor: 'green',
                              
                          })
              }       
              }

             

              let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")) || []
              console.log(productosEnCarrito);

              function mostrarCarrito(){

          
                let bodyModal= document.getElementById("bodyModal");
                bodyModal.classList.add("bodyModal");
                bodyModal.innerHTML = " "  
                
                  
                 
                for (let i of productosEnCarrito) {

                       console.log(i.nombre);
                      //creamos un card para mostrar el producto que agramos
                      let card = document.createElement("div");
                      
                      //se agrega a las cards las clases "card",
                      card.classList.add("cardCarrito");
                      //cremaos un div imgcontainer
                      let imgContainer = document.createElement("div");
                      imgContainer.classList.add("imgCarrito");
                      //img tag
                        let image = document.createElement("img");
                        image.setAttribute("src", i.img);
                        imgContainer.appendChild(image);
                        card.appendChild(imgContainer);
              
                      let container = document.createElement("div");
                      container.classList.add("containerCarrito");
                      //nombre producto
                      let name = document.createElement("h5");
                      name.classList.add("nombreProducto");
                      name.innerText = i.nombre.toUpperCase();
                      container.appendChild(name);
                      //precio 
                      let price = document.createElement("h5");
                      price.innerText = "$" + i.precio;
                      
                      container.appendChild(price);
                      card.appendChild(container);
                      //container botones
                    
                      let Eliminar = document.createElement("button");
                      Eliminar.classList.add("botonEliminar");
                      Eliminar.innerText = "Eliminar";

                     
                      card.appendChild(Eliminar)


                     

                   
                      
                  
                      //descripcion
                   
                  
                      bodyModal.appendChild(card);
                   
                }
                
                totalcarrito(productosEnCarrito)
                  //container botones
                  let contenedorBotones = document.createElement("div");
                  contenedorBotones.classList.add("contenedorBotones")
                  let botonConfirmar = document.createElement("button");
                  botonConfirmar.classList.add("botonConfirmar");
                  botonConfirmar.innerText = "Realizar Pedido";

                  let botonCancelar= document.createElement("button");
                  botonCancelar.classList.add("botonCancelar");
                  botonCancelar.innerText = "Cancelar Pedido";




                  contenedorBotones.appendChild(botonConfirmar);
                  contenedorBotones.appendChild(botonCancelar);

                  bodyModal.appendChild(contenedorBotones)
             
              } 
              

              

              //funcion para calcular el total del carrito 
           function totalcarrito(productosEnCarrito){
                //metodo para calcular el total del carrito de compras
                const resultado= productosEnCarrito.reduce((acc, item)=>{

                  return acc + item.precio;
                },0);
              // creamos un contenedor para el total del carrito de compras
                const containerResultado= document.createElement("div");
               
                let total = document.createElement("h5");
              
                total.innerText = "Total a Pagar: " + resultado;
                containerResultado.appendChild(total);
                let containerCart = document.getElementById("footerMod");
                containerCart.innerHTML="";
                containerCart.appendChild(containerResultado);
              }

            //boton cerrar modal
            let cerrar = document.querySelectorAll(".close")[0];
            let abrir = document.querySelectorAll(".btnmostrarCart")[0];
            let modal = document.querySelectorAll(".modal")[0];
            let modalCont = document.querySelectorAll(".conteinerCart")[0];
            
            //mostrar modal
            abrir.addEventListener("click", function (e) {
            e.preventDefault();

            if(productosEnCarrito.length >0){

            setTimeout(function () {

            modalCont.style.opacity = "1";
            modalCont.style.visibility = "visible";
            modal.classList.toggle("modal-close");
             
            mostrarCarrito();
            })}
            else{Swal.fire({
              title: 'El Carrito esta vacio',
              text: '',
              icon: 'warning',
              confirmButtonText: 'volver'
            })}

            });
            //cerrar modal
            cerrar.addEventListener("click", function () {
              modal.classList.toggle("modal-close");
             
              setTimeout(function () {  
                modalCont.style.opacity = 0;
                modalCont.style.visibility = "hidden";
              },900);

            });
            // cerrar al hacer clic por fuera del modal
            window.addEventListener("click", function (e) { 

              if (e.target==modalCont) {
                modal.classList.toggle("modal-close");
             
              setTimeout(function () {  
                modalCont.style.opacity = 0;
                modalCont.style.visibility = "hidden";
              },900);
              }
            }); 


             

         

           


      
      

     


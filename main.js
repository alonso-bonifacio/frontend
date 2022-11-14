'use strict'

/* CARGA TARJETAS DE PRODUCTOS*/
const URL_PRODUCTS = "http://localhost:8000/api/products/";
const cargarProductos = async (id = "", name="") => {
  try {
    const respuesta = await fetch(URL_PRODUCTS+name);
    let tarjetas = "";
    let res = "";


    /* STATUS 200 */
    if (respuesta.status === 200) {
      res = await respuesta.json();
      var productos = res.products;

      
      /* FILTRO POR CATEGORIA */
      if (id != "" || id != 0){
          productos = productos.filter((s) => s.category==id);
      }
      
      /* SI SE ENCUENTRA EL PRODRUCTO */
      if (name != ""){
        document.getElementById("texto-buscado").innerText = "Productos encontrado con el nombre: "+ name.slice(4);
      }
      
      /* GENERANDO TARJETAS DE PRODUCTOS */
      productos.forEach((producto) => {
        tarjetas += `<div class="col">
                    <div class="card h-100">
                        <img src="${
                        producto.url_image || "no-image.jpg"
                        }" class="card-img-top border border-2" width="271.234px" height="271.234px" alt="${producto.name}">
                        <div class="card-body clearfix">
                            <h4 class="card-title text-capitalize">
                            ${
                            producto.name.length <= 16
                                ? producto.name.toLowerCase()
                                : producto.name.toLowerCase().slice(0, 16) +
                                "..."
                            }
                            </h4>
                            <p class="card-text float-start text-secondary">PRECIO: $${
                            producto.price * (100 - producto.discount)/100
                            }</p>
                            <a href="#" class="btn btn-outline-success float-end rounded-circle"><i class="bi bi-cart-plus-fill"></i></a>
                        </div>  
                    </div>
                </div>`;
        });

    /* STATUS 404 */
    } else if (respuesta.status === 404) {
      res = await respuesta.json()
      document.getElementById("texto-buscado").innerText = res.msg;

    /*  */
    } else {
      document.getElementById("texto-buscado").innerText ="Ocurrió un error, comuníquese con el técnico.";
    }

      var contenedorTarjetas = document.getElementById("contenedor-tarjeta");
      contenedorTarjetas.innerHTML = tarjetas;

  } catch (error) {
    console.log(error);
  }
};

/* CARGA MENU DE CATEGORIAS */
const URL_CATEGORYS = "http://localhost:8000/api/categorys/";
const cargarCategorias = async() => {

    try {
      const respuesta = await fetch(URL_CATEGORYS);
      console.log(respuesta);

      if (respuesta.status === 200) {
        const res = await respuesta.json();
        const categorias = res.categorys;
        console.log(categorias);
        let filas = "<h4>Categorias</h4>";
        filas += `<button type="button" class="list-group-item list-group-item-action btn-outline-success text-uppercase active" onclick="filtrarPor(0)" id="cat-0">Todas</button>`;
        categorias.forEach((categoria) => {
          filas += `
            <button type="button" class="list-group-item list-group-item-action btn-outline-success text-uppercase" onclick="filtrarPor(${categoria.id})" id="cat-${categoria.id}">
                ${categoria.name}
            </button>`;
        });

        var contenedorCategoria = document.getElementById("filtro-categoria");
        contenedorCategoria.innerHTML = filas;
      } else if (respuesta.status === 404) {
        console.log("El elemento no se encuentra");
      } else {
        console.log("Ocurrió un error inesperado");
      }
    } catch (error) {
      console.log(error);
    }
}

/* FILTRO POR CATEGORIA */
function filtrarPor(id) {
    var categorias = document.getElementsByClassName("list-group-item");
    
    for (let i = 0; i < categorias.length; i++) {
        const categoria = categorias.item(i);       
        categoria.classList.remove("active");  
    }
    document.getElementById("cat-"+id).classList.add("active");
    cargarProductos(id, ""); 
}

/* BUSCADOR DE PRODUCTOS */
function buscadorProducto() {
  let input = document.getElementById("buscador"); 
  let name = "pnm/"+input.value;
  cargarProductos("",name);
  input.value = "";
  
}


window.onload = () => {
  cargarProductos();
  cargarCategorias();
}

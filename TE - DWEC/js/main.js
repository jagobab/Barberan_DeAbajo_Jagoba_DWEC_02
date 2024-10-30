import GastoCombustible from "./GastoCombustible.js";
// ------------------------------ 1. VARIABLES GLOBALES ------------------------------
let tarifasJSON = null;
let gastosJSON = null;
let tarifasJSONpath = 'data/tarifasCombustible.json';
let gastosJSONpath = 'data/gastosCombustible.json';

// ------------------------------ 2. CARGA INICIAL DE DATOS (NO TOCAR!) ------------------------------
// Esto inicializa los eventos del formulario y carga los datos iniciales
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los JSON cuando la página se carga, antes de cualquier interacción del usuario
    await cargarDatosIniciales();

    // mostrar datos en consola
    console.log('Tarifas JSON: ', tarifasJSON);
    console.log('Gastos JSON: ', gastosJSON);

    calcularGastoTotal();

    // Inicializar eventos el formularios
    document.getElementById('fuel-form').addEventListener('submit', guardarGasto);
});

// Función para cargar ambos ficheros JSON al cargar la página
async function cargarDatosIniciales() {

    try {
        // Esperar a que ambos ficheros se carguen
        tarifasJSON = await cargarJSON(tarifasJSONpath);
        gastosJSON = await cargarJSON(gastosJSONpath);

    } catch (error) {
        console.error('Error al cargar los ficheros JSON:', error);
    }
}

// Función para cargar un JSON desde una ruta específica
async function cargarJSON(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Error al cargar el archivo JSON: ${path}`);
    }
    return await response.json();
}

// ------------------------------ 3. FUNCIONES ------------------------------
// Calcular gasto total por año al iniciar la aplicación
function calcularGastoTotal() {
    // array asociativo con clave=año y valor=gasto total
    let aniosArray = {
        2010: 0,
        2011: 0,
        2012: 0,
        2013: 0,
        2014: 0,
        2015: 0,
        2016: 0,
        2017: 0,
        2018: 0,
        2019: 0,
        2020: 0
    }

    //Calcular los gastos entre 2010 y 2020
    //Recorrer cada objeto con un forEach
    function recorrer(x) {
        //Obtener el año del gasto
        let anio = new Date(x.date)
        anio = anio.getFullYear()
        //Obtener el coste de ese objeto
        let coste = x.precioViaje
        //sumar en el objeto de los años el gasto para cada año
        aniosArray[anio] += coste
    }

    gastosJSON.forEach(recorrer)

    //Imprimir en pantalla los gastos totales y ademas redondear el gasto para que no salgan 1200 decimales en pantalla pero sin variar el aniosArray
     for(let i = 2010; i<2021; i++){ 
        let escribir = document.getElementById('gasto'+i)
        escribir.innerHTML = Math.round(aniosArray[i] * 100) / 100
    }
}

// guardar gasto introducido y actualizar datos
function guardarGasto(event) {
    event.preventDefault(); 

    // Obtener los datos del formulario
    const tipoVehiculo = document.getElementById('vehicle-type').value;
    const fecha = new Date(document.getElementById('date').value);
    const kilometros = parseFloat(document.getElementById('kilometers').value);

    //Calcular el precio del viaje, saco el año de la fecha y con un for encuentro el año y el coste 
    let anioIntroducido = fecha.getFullYear();
    let costeDelViaje = 0;
    //recorro tarifas.json, encuentro el año y el coste para ese vehiculo y hago el calculo del coste
    for(let i = 0; i < tarifasJSON.tarifas.length; i++){
        if(tarifasJSON.tarifas[i].anio == anioIntroducido){
            costeDelViaje = tarifasJSON.tarifas[i].vehiculos[tipoVehiculo] * kilometros
        }
    }

    //Creo un nuevo objeto de la clase GastoCombustible para agregarlo
    const nuevoGasto = new GastoCombustible(tipoVehiculo, fecha, kilometros, costeDelViaje);
    
    //Lo agrego a gastos combustible para actualizar el json
    gastosJSON.push(nuevoGasto);

    //Pintamos en la parte de gastos recientes el nuevo gasto usando converToJSON:
    let agregarGastoReciente = document.getElementById("expense-list");
    let cosaQueAgregar = nuevoGasto.convertToJSON();

    //Creo un elemento li para agregarselo al ul
    let nuevoLi = document.createElement('li')
    nuevoLi.textContent = cosaQueAgregar;
    agregarGastoReciente.appendChild(nuevoLi)

    //llamamos a calculargastototal para que actualice en la parte de gastos totales
    calcularGastoTotal();

    //Borramos el formulario para que empiece en blanco
    document.getElementById("fuel-form").reset()
}


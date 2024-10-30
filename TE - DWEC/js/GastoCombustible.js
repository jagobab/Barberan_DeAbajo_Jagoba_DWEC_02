class GastoCombustible {
    constructor(vehicleType, date, kilometers, precioViaje) {
        this.vehicleType = vehicleType
        this.date = date
        this.kilometers = kilometers
        this.precioViaje = precioViaje
    }

    convertToJSON(){
        let objetoCreado = {
            vehicleType : this.vehicleType,
            date : this.date,
            kilometers : this.kilometers,
            precioViaje : this.precioViaje
        }
        return JSON.stringify(objetoCreado)
    }

}

export default GastoCombustible
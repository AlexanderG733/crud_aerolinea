import { TripulanteModel } from "../models/tripulante.model.js";

const registerTripulante = async (req, res) => {
    try {
        console.log(req.body);
        const { nombre1, nombre2, apellido1, apellido2, telefono, rango, id_avion, id} = req.body;

    if( !nombre1 || !nombre2 || !apellido1 || !apellido2 || !telefono || !rango || !id_avion || !id){
        return res.status(409).json({ok:false, 
                                     message: "faltan campos!"});
    }
    const tripulante = await TripulanteModel.findOneByNombre(nombre1);
    if(tripulante){
        return res.status(409).json({ok:true, 
                                    message: "El tripulante ya existe!"});
    }

   const newTripulante = await TripulanteModel.createTripulante({nombre1, nombre2, apellido1, apellido2, telefono, rango, id_avion,id});    

    return res.status(201).json({
        ok: true,
        message:'Tripulante creado',
    });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el Tripulante!"
        });
    }
}

// http://localhost:3000/api/v1/avion/list
const listTripulante = async (req, res) => {
    try {
        const tripulantes = await TripulanteModel.readTripulante();
        res.json(tripulantes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tripulantes' });
    }
};


// /api/v1/tripulante/deleteTripulante
const deleteTripulante = async (req, res) => {
    const { id } = req.params;
    const userRole = req.role;

     // Verificar si el rol del usuario es "superadmin" o "usu1"
     if (userRole !== 'Superadmin' && userRole !== 'usu1') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar aviones'
        });
    }
    try {
        const result = await TripulanteModel.deleteTripulante(id);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Tripulante no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Tripulante eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el tripulante'
        });
    }
}

const updateTripulacion = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedTripulacion = await TripulanteModel.updateTripulante(id, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Tripulante actualizado correctamente',
            data: updatedTripulacion
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const searchTripulante = async (req, res) => {
    const { query } = req.query;
    try {
        const tripulacion = await TripulanteModel.findOneByNombre(query)
        return res.json( tripulacion )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

export const TripuController = {
    listTripulante,
    registerTripulante,
    deleteTripulante,
    updateTripulacion,
    searchTripulante
}
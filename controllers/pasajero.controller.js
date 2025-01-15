import { PasajeroModel } from "../models/pasajero.model.js";

const registerPasajero = async (req, res) => {
    try {
        console.log(req.body);
        const { id, nombre1, nombre2, apellido1, apellido2, telefono, pasaporte, id_ticket } = req.body;

    if( !id, !nombre1 || !nombre2 || !apellido1 || !apellido2 || !telefono || !pasaporte || !id_ticket ){
        return res.status(409).json({ok:false, 
                                     message: "faltan campos!"});
    }
    const pasajero = await PasajeroModel.findOneByNombre(nombre1);
    if(pasajero){
        return res.status(409).json({ok:true, 
                                    message: "El pasajero ya existe!"});
    }

   const newPasajero= await PasajeroModel.createPasajero({id, nombre1, nombre2, apellido1, apellido2, telefono, pasaporte, id_ticket});    

    return res.status(201).json({
        ok: true,
        message:'pasajero creado',
    });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el pasajero!"
        });
    }
}

const listPasajero = async (req, res) => {
    try {
        const pasajeros = await PasajeroModel.readPasajero();
        res.json(pasajeros);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Pasajeros' });
    }
};



const updatePasajero = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedPasajero = await PasajeroModel.updatePasajero(id, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Pasajero actualizado correctamente',
            data: updatedPasajero
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const deletePasajero = async (req, res) => {
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
        const result = await PasajeroModel.deletePasajero(id);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Pasajero no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Pasajero eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el pasajero'
        });
    }
}

const searchPasajero = async (req, res) => {
    const { query } = req.query;
    try {
        const pasajero = await PasajeroModel.findOneByNombre(query)
        return res.json( pasajero )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

export const PasajeroController = {
    listPasajero,
    registerPasajero,
    updatePasajero,
    deletePasajero,
    searchPasajero
}

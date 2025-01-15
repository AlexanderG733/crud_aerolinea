import { ClaseModel } from "../models/clase.model.js";


const registerClase = async (req, res) => {
    try {
        console.log(req.body);
        const { id, tipo_clase, id_servicio} = req.body;

    if( !id || !tipo_clase || !id_servicio ){
        return res.status(409).json({ok:false, 
                                     message: "faltan campos!"});
    }
    const clase = await ClaseModel.findOneByNombre(tipo_clase);
    if(clase){
        return res.status(409).json({ok:true, 
                                    message: "La clase ya existe!"});
    }

   const newClase = await ClaseModel.createClase({ id, tipo_clase, id_servicio });    

    return res.status(201).json({
        ok: true,
        message:'Clase creada',
    });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear la clase!"
        });
    }
}


// http://localhost:3000/api/v1/clase/list
const listClase = async (req, res) => {
    try {
        const clases = await ClaseModel.readClase();
        res.json(clases);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clases' });
    }
};

const updateClase = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updateClase = await ClaseModel.updateClase(id, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Clase actualizada correctamente',
            data: updateClase
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

// /api/v1/clase/deleteClase
const deleteClase = async (req, res) => {
    const { id } = req.params;
    const userRole = req.role;

     // Verificar si el rol del usuario es "superadmin" o "usu1"
     if (userRole !== 'Superadmin' && userRole !== 'usu1') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar clases'
        });
    }
    try {
        const result = await ClaseModel.deleteClase(id);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Clase no encontrada'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Clase eliminada correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar la clase'
        });
    }
}

const searchClase = async (req, res) => {
    const { query } = req.query;
    try {
        const clase = await ClaseModel.findOneByNombre(query)
        return res.json( clase )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

export const ClasController = {
    listClase,
    registerClase,
    updateClase,
    deleteClase,
    searchClase
}
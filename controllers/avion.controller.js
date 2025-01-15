import { AvionModel } from "../models/avion.model.js";

// ruta /api/v1/avion/register
const registerAvion = async (req, res) => {
    try {
        console.log(req.body);
        const {id, nombre} = req.body;
    if(!id || !nombre){
        return res.status(409).json({ok:false, 
                                     message: "faltan campos!"});
    }
    const avion = await AvionModel.findOneByNombre(nombre);
    if(avion){
        return res.status(409).json({ok:true, 
                                    message: "El avion ya existe!"});
    }

    const newAvion = await AvionModel.createAvion({nombre});    

    return res.status(201).json({
        ok: true,
        message:'Avion creado',
    });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el avion!"
        });
    }
}

// http://localhost:3000/api/v1/avion/list
const listAvion = async (req, res) => {
    try {
        const aviones = await AvionModel.readAvion();
        res.json(aviones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los aviones' });
    }
};
//  /api/v1/avion//search
const searchAvion = async (req, res) => {
    const { query } = req.query;
    try {
        const aeronave = await AvionModel.findOneByNombre(query)
        return res.json( aeronave )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

// /api/v1/clientes/deleteAvio
const deleteAvion = async (req, res) => {
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
        const result = await AvionModel.deleteAeronave(id);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Avion no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Avion eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el avion'
        });
    }
}

const updateAeronave = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedAeronave = await AvionModel.updateAvion(id, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Avion actualizado correctamente',
            data: updatedAeronave
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};


// api/v1/avion/show

export const AviController = {
    registerAvion,
    listAvion,
    searchAvion,
    deleteAvion,
    updateAeronave
}
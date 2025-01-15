
import { ServicioModel } from "../models/servicio.model.js";



const registerServicio = async (req, res) => {
    try {
        console.log(req.body);
        const { id, tipo_servicio} = req.body;

    if( !id || !tipo_servicio ){
        return res.status(409).json({ok:false, 
                                     message: "faltan campos!"});
    }
    const servicio = await ServicioModel.findOneByNombre(tipo_servicio);
    if(servicio){
        return res.status(409).json({ok:true, 
                                    message: "El servicio ya existe!"});
    }

   const newServicio = await ServicioModel.createServicio({id, tipo_servicio });    

    return res.status(201).json({
        ok: true,
        message:'Servicio creado',
    });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el servicio!"
        });
    }
}


// http://localhost:3000/api/v1/servicio/list
const listServicio = async (req, res) => {
    try {
        const servicios = await ServicioModel.readServicio();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los Servicos' });
    }
};


const deleteServicio = async (req, res) => {
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
        const result = await ServicioModel.deleteServicio(id);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Servicio no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Servicio eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el Servicio'
        });
    }
}

const updateServicio = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedServicio = await ServicioModel.updateServicio(id, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Servicio actualizado correctamente',
            data: updatedServicio
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const searchServicio = async (req, res) => {
    const { query } = req.query;
    try {
        const servicio = await ServicioModel.findOneByNombre(query)
        return res.json( servicio )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

export const ServiController = {
    listServicio,
    registerServicio,
    deleteServicio,
    updateServicio,
    searchServicio
}
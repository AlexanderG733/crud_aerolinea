
import { TicketModel } from "../models/ticket.model.js";


const registerTicket = async (req, res) => {
    try {
        console.log(req.body);
        
        const {id, destino, hora_llegada, hora_embarque,  fecha,  asiento,  id_pasajero, id_avion, id_clase} = req.body;

    if( !id || !destino || !hora_llegada || !hora_embarque || !fecha || !asiento || !id_pasajero || !id_avion || !id_clase){
        return res.status(409).json({ok:false, 
                                     message: "faltan campos!"});
    }
    const tripulante = await TicketModel.findOneById(id);
    if(tripulante){
        return res.status(409).json({ok:true, 
                                    message: "El tripulante ya existe!"});
    }

   const newTicket = await TicketModel.createTicket({id, destino, hora_llegada, hora_embarque,  fecha,  asiento,  id_pasajero, id_avion, id_clase});    

    return res.status(201).json({
        ok: true,
        message:'ticket creado',
    });
    
    }catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: "Error al crear el ticket!"
        });
    }
}

const listTicket = async (req, res) => {
    try {
        const tickets = await TicketModel.readTicket();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tickets' });
    }
};

const deleteTicket = async (req, res) => {
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
        const result = await TicketModel.deleteTicket(id);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Ticket no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Ticket eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el Ticket'
        });
    }
}

const updateTicket = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    try {
        const updatedTicket = await TicketModel.updateTicket(id, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Ticket actualizado correctamente',
            data: updatedTicket
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

const searchTicket = async (req, res) => {
    const { query } = req.query;
    try {
        const tickets = await TicketModel.findOneById(query)
        return res.json( tickets )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

export const TicketController = {
    listTicket,
    registerTicket,
    deleteTicket,
    updateTicket,
    searchTicket
}

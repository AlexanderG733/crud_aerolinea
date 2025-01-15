
import { text } from 'express';
import {db} from '../database/conexion.js';

const readTicket = async () => {
    const result = {
        text: `
        SELECT * FROM aeropuerto.ticket ORDER BY id ASC`
    }
    const { rows } = await db.query(result);
    return rows
}

// Función que obtiene todos los aviones
const obtenerAviones = async () => {
    try {
      const result = await db.query('SELECT id, nombre FROM aviones.avion');
      return result.rows;  // Devuelve los aviones
    } catch (error) {
      console.error('Error al obtener aviones:', error);
      throw new Error('Error al obtener los aviones');
    }
  };

  const obtenerPasajeros = async () => {
    try {
      const result = await db.query('SELECT id, nombre FROM aviones.pasajero');
      return result.rows;  // Devuelve los aviones
    } catch (error) {
      console.error('Error al obtener pasajero:', error);
      throw new Error('Error al obtener los pasajero');
    }
  };

  const createTicket = async ({id, destino, hora_llegada, hora_embarque,  fecha,  asiento,  id_pasajero, id_avion, id_clase}) => {
    const query = {
        text: `
        INSERT INTO aeropuerto.ticket (id, destino, hora_llegada, hora_embarque,  fecha,  asiento,  id_pasajero, id_avion, id_clase)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        values: [id, destino, hora_llegada, hora_embarque,  fecha,  asiento,  id_pasajero, id_avion, id_clase]
    }

    const { rows } = await db.query(query);
    return rows[0];
}
  
const findOneById = async (id) => {
    const query = {
        text: `
        SELECT * FROM aeropuerto.ticket 
        WHERE id = $1
        `,
        values: [id]
    }
   
    const {rows} = await db.query(query);
    return rows[0];
}

const deleteTicket = async (id) => {
  const deleteQuery = {
      text: `
      DELETE FROM aeropuerto.ticket 
      WHERE id = $1
      `,
      values: [id]
  }
  try {
      const result = await db.query(deleteQuery);
      if (result.rowCount === 0) {
          throw new Error('ticket no encontrado');
  }
   // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
      return { success: true, message: 'ticket eliminado' };

  }catch (error) {
      // Manejo de errores en caso de fallos en la consulta
      console.error('Error al eliminar el ticket:', error);
      throw new Error('Error al intentar eliminar el ticket');
      
  }
};

const updateTicket = async (id, updateFields) => {
  const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
  const values = [id, ...Object.values(updateFields)];

  const updateQuery = {
      text: `
      UPDATE aeropuerto.ticket 
      SET ${setClause}
      WHERE id = $1
      RETURNING *
      `,
      values: values
  };

  try {
      const { rows } = await db.query(updateQuery);
      if (rows.length === 0) {
          throw new Error('ticket no encontrado');
      }
      return rows[0];
  } catch (error) {
      console.error('Error al actualizar el ticket:', error);
      throw new Error('Error al intentar actualizar el ticket');
  }
};

export const TicketModel = {
    readTicket,
    obtenerAviones,
    obtenerPasajeros,
    createTicket,
    deleteTicket,
    updateTicket,
    findOneById
}
import { text } from 'express';
import {db} from '../database/conexion.js';

const readPasajero = async () => {
    const result = {
        text: `
        SELECT * FROM aeropuerto.pasajero ORDER BY id ASC`
    }
    const { rows } = await db.query(result);
    return rows
}


const obtenerTicket = async () => {
    try {
      const result = await db.query('SELECT id, destino FROM aeropuerto.ticket');
      return result.rows;  // Devuelve los aviones
    } catch (error) {
      console.error('Error al obtener tickets:', error);
      throw new Error('Error al obtener los tickets');
    }
  };

  const createPasajero = async ({ id, nombre1, nombre2, apellido1, apellido2, telefono, pasaporte, id_ticket }) => {
    const query = {
        text: `
        INSERT INTO aeropuerto.pasajero (id, nombre1, nombre2, apellido1, apellido2, telefono, pasaporte, id_ticket)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        values: [ id, nombre1, nombre2, apellido1, apellido2, telefono, pasaporte, id_ticket ]
    }

    const { rows } = await db.query(query);
    return rows[0];
}

const updatePasajero = async (id, updateFields) => {
  const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
  const values = [id, ...Object.values(updateFields)];

  const updateQuery = {
      text: `
      UPDATE aeropuerto.pasajero
      SET ${setClause}
      WHERE id = $1
      RETURNING *
      `,
      values: values
  };

  try {
      const { rows } = await db.query(updateQuery);
      if (rows.length === 0) {
          throw new Error('pasajero no encontrado');
      }
      return rows[0];
  } catch (error) {
      console.error('Error al actualizar el pasajero:', error);
      throw new Error('Error al intentar actualizar el pasajero');
  }
};

const deletePasajero = async (id) => {
  const deleteQuery = {
      text: `
      DELETE FROM aeropuerto.pasajero
      WHERE id = $1
      `,
      values: [id]
  }
  try {
      const result = await db.query(deleteQuery);
      if (result.rowCount === 0) {
          throw new Error('Pasajero no encontrado');
  }
   // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
      return { success: true, message: 'Pasajero eliminado' };

  }catch (error) {
      // Manejo de errores en caso de fallos en la consulta
      console.error('Error al eliminar el pasajero:', error);
      throw new Error('Error al intentar eliminar el pasajero');
      
  }
};

  const findOneByNombre = async (nombre1) => {
    const query = {
        text: `
        SELECT * FROM aeropuerto.pasajero 
        WHERE nombre1 = $1
        `,
        values: [nombre1]
    }
    const {rows} = await db.query(query);
    return rows[0];
}
export const PasajeroModel = {

    readPasajero,
    obtenerTicket,
    createPasajero,
    updatePasajero,
    deletePasajero,
    findOneByNombre
    
}
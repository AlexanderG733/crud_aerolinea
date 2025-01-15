import { text } from 'express';
import {db} from '../database/conexion.js';

const createTripulante = async ({ nombre1, nombre2, apellido1, apellido2, telefono, rango, id_avion,id}) => {
    const query = {
        text: `
        INSERT INTO aviones.tripulante (nombre1, nombre2, apellido1, apellido2, telefono, rango, id_avion,id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        values: [ nombre1, nombre2, apellido1, apellido2, telefono, rango, id_avion, id]
    }

    const { rows } = await db.query(query);
    return rows[0];
}

const updateTripulante = async (id, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE aviones.tripulante
        SET ${setClause}
        WHERE id = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Tripulante no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el Tripulante:', error);
        throw new Error('Error al intentar actualizar el Tripulante');
    }
};

const deleteTripulante = async (id) => {
    const deleteQuery = {
        text: `
        DELETE FROM aviones.tripulante
        WHERE id = $1
        `,
        values: [id]
    }
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Tripulante no encontrado');
    }
     // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
        return { success: true, message: 'Tripulante eliminado' };

    }catch (error) {
        // Manejo de errores en caso de fallos en la consulta
        console.error('Error al eliminar el tripulante:', error);
        throw new Error('Error al intentar eliminar el tripulante');
        
    }
};

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

const readTripulante = async () => {
    const result = {
        text: `
        SELECT * FROM aviones.tripulante`
    }
    const { rows } = await db.query(result);
    return rows
}

const findOneByNombre = async (nombre) => {
    const query = {
        text: `
        SELECT * FROM aviones.tripulante 
        WHERE nombre1 = $1
        `,
        values: [nombre]
    }
    const {rows} = await db.query(query);
    return rows[0];
}
export const TripulanteModel = {
    createTripulante,
    readTripulante,
    findOneByNombre,
    obtenerAviones,
    updateTripulante,
    deleteTripulante
    
}

import { text } from 'express';
import {db} from '../database/conexion.js';



const createServicio = async ({ id, tipo_servicio }) => {
    const query = {
        text: `
        INSERT INTO aviones.servicio (id, tipo_servicio )
        VALUES ($1, $2)
        RETURNING *
        `,
        values: [ id, tipo_servicio ]
    }

    const { rows } = await db.query(query);
    return rows[0];
}


const readServicio = async (req, res) => {
    const result = {
        text: `
        SELECT * FROM aviones.servicio ORDER BY id ASC`
    }
    const { rows } = await db.query(result);
    return rows
}

const findOneByNombre = async (tipo_servicio) => {
    const query = {
        text: `
        SELECT * FROM aviones.servicio 
        WHERE tipo_servicio = $1
        `,
        values: [tipo_servicio]
    }
    const {rows} = await db.query(query);
    return rows[0];
}

const deleteServicio = async (id) => {
    const deleteQuery = {
        text: `
        DELETE FROM aviones.servicio
        WHERE id = $1
        `,
        values: [id]
    }
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Servicio no encontrado');
    }
     // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
        return { success: true, message: 'Servicio eliminado' };

    }catch (error) {
        // Manejo de errores en caso de fallos en la consulta
        console.error('Error al eliminar el Servicio:', error);
        throw new Error('Error al intentar eliminar el Servicio');
        
    }
};

const updateServicio = async (id, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE aviones.servicio
        SET ${setClause}
        WHERE id = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('servicio no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        throw new Error('Error al intentar actualizar el servicio');
    }
};

export const ServicioModel = {
    readServicio,
    createServicio,
    findOneByNombre,
    deleteServicio,
    updateServicio
}
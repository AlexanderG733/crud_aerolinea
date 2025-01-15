import { text } from 'express';
import {db} from '../database/conexion.js';

const createAvion = async ({nombre}) => {
    const query = {
        text: `
        INSERT INTO aviones.avion (nombre)
        VALUES ($1)
        RETURNING *
        `,
        values: [nombre]
    }

    const { rows } = await db.query(query);
    return rows[0];
}

//Mostrar datos de los aviones
const readAvion = async (req, res) => {
    const result = {
        text: `
        SELECT * FROM aviones.avion ORDER BY id ASC`
    }
    const { rows } = await db.query(result);
    return rows
}

const deleteAeronave = async (id) => {
    const deleteQuery = {
        text: `
        DELETE FROM aviones.avion
        WHERE id = $1
        `,
        values: [id]
    }
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Avion no encontrado');
    }
     // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
        return { success: true, message: 'Avion eliminado' };

    }catch (error) {
        // Manejo de errores en caso de fallos en la consulta
        console.error('Error al eliminar el avion:', error);
        throw new Error('Error al intentar eliminar el avion');
        
    }
};

const updateAvion = async (id, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE aviones.avion
        SET ${setClause}
        WHERE id = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Avion no encontrado');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar el avion:', error);
        throw new Error('Error al intentar actualizar el avion');
    }
};

const findOneByNombre = async (nombre) => {
    const query = {
        text: `
        SELECT * FROM aviones.avion 
        WHERE nombre = $1
        `,
        values: [nombre]
    }
    const {rows} = await db.query(query);
    return rows[0];
}

//Buscar por ID
const findById_avion= async (id) => {
    const query = {
        text: `
        SELECT * FROM aviones.avion
        WHERE id = $1
        `,
        values: [id]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

//Buscar por ID o nombre
const findIdOrNombre = async (query) => {
    let queryText;
    let values;

    // Si el query es un número (id)
    if (!isNaN(query)) {
        queryText = `
        SELECT * FROM aviones.avion 
        WHERE id = $1`;
        values = [query];
    }
    // Si el query es un email (cadena de texto)
    else {
        queryText = `
        SELECT * FROM aviones.avion 
        WHERE nombre = $1`;
        values = [query];
    }
    const { rows } = await db.query({
        text: queryText,
        values: values
    });
    return rows;
}

export const AvionModel = {
    createAvion,
    readAvion,
    deleteAeronave,
    updateAvion,
    findOneByNombre,
    findById_avion,
    findIdOrNombre
}
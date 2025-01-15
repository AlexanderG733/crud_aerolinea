import {db} from '../database/conexion.js';

const readClase = async (req, res) => {
    const result = {
        text: `
        SELECT * FROM aviones.clase ORDER BY id ASC`
    }
    const { rows } = await db.query(result);
    return rows
}


const createClase = async ({ id, tipo_clase, id_servicio }) => {
    const query = {
        text: `
        INSERT INTO aviones.clase ( id, tipo_clase, id_servicio )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        values: [ id, tipo_clase, id_servicio ]
    }

    const { rows } = await db.query(query);
    return rows[0];
}
// obtener todos los datos de la tabla servicio para un select 
const obtenerServicios = async () => {
    try {
      const result = await db.query('SELECT id, tipo_servicio FROM aviones.servicio ');
      return result.rows;  // Devuelve los aviones
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw new Error('Error al obtener los servicios');
    }
  };

  const updateClase = async (id, updateFields) => {
    const setClause = Object.keys(updateFields).map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(updateFields)];

    const updateQuery = {
        text: `
        UPDATE aviones.clase
        SET ${setClause}
        WHERE id = $1
        RETURNING *
        `,
        values: values
    };

    try {
        const { rows } = await db.query(updateQuery);
        if (rows.length === 0) {
            throw new Error('Clase no encontrada');
        }
        return rows[0];
    } catch (error) {
        console.error('Error al actualizar la clase:', error);
        throw new Error('Error al intentar actualizar la clase');
    }
};

const deleteClase = async (id) => {
    const deleteQuery = {
        text: `
        DELETE FROM aviones.clase
        WHERE id = $1
        `,
        values: [id]
    }
    try {
        const result = await db.query(deleteQuery);
        if (result.rowCount === 0) {
            throw new Error('Clase no encontrada');
    }
     // Si la eliminación fue exitosa, podemos devolver un mensaje o un valor
        return { success: true, message: 'Clase eliminada' };

    }catch (error) {
        // Manejo de errores en caso de fallos en la consulta
        console.error('Error al eliminar la clase:', error);
        throw new Error('Error al intentar eliminar la clase');
        
    }
};

  const findOneByNombre = async (tipo_clase) => {
    const query = {
        text: `
        SELECT * FROM aviones.clase 
        WHERE tipo_clase = $1
        `,
        values: [tipo_clase]
    }
    const {rows} = await db.query(query);
    return rows[0];
}

export const ClaseModel = {
    readClase,
    obtenerServicios,
    createClase,
    findOneByNombre,
    updateClase,
    deleteClase
}
const sql = require('mssql');
const fs = require('fs');

const config = {
    server: "localhost",
    database: 'TPRedSocial',
    user: 'admin',
    password: 'admin',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        encrypt: false
    }
};

sql.connect(config).then(async pool => {
    console.log('Connected to MSSQL');

    const usuariosCount = await pool.request().query('SELECT COUNT(*) as count FROM Usuarios');
    const totalUsuarios = usuariosCount.recordset[0].count;

    const writeStream = fs.createWriteStream('usuarios.json');
    writeStream.write('[');  // Inicio del array

    for(let i = 1; i <= totalUsuarios; i++) {
        const usuario = (await pool.request().input('id_usuario', sql.Int, i).query('SELECT * FROM Usuarios WHERE id_usuario = @id_usuario')).recordset[0];
        const amigos = (await pool.request().input('id_usuario', sql.Int, i).query('SELECT * FROM Amigos WHERE id_usuario = @id_usuario')).recordset;
        const publicaciones = (await pool.request().input('id_usuario', sql.Int, i).query('SELECT * FROM Publicaciones WHERE id_usuario = @id_usuario')).recordset;
        for(const publicacion of publicaciones) {
            publicacion.comentarios = (await pool.request().input('id_publicacion', sql.Int, publicacion.id_publicacion).query('SELECT * FROM Comentarios WHERE id_publicacion = @id_publicacion')).recordset;
        }

        const usuarioTransformado = {
            _id: usuario.id_usuario.toString(),
            nombre: usuario.nombre,
            correo_electronico: usuario.correo_electronico,
            fecha_nacimiento: usuario.fecha_nacimiento,
            contrasena: usuario.contrasena,
            amigos: amigos.map(amigo => amigo.id_amigo.toString()),
            publicaciones: publicaciones.map(publicacion => {
                return {
                    _id: publicacion.id_publicacion.toString(),
                    contenido: publicacion.contenido,
                    fecha_publicacion: publicacion.fecha_publicacion,
                    comentarios: publicacion.comentarios.map(comentario => {
                        return {
                            _id: comentario.id_comentario.toString(),
                            id_usuario: comentario.id_usuario.toString(),
                            contenido: comentario.contenido
                        }
                    })
                }
            })
        };

        writeStream.write((i > 1 ? ', ' : '') + JSON.stringify(usuarioTransformado, null, 2));

        process.stdout.write(`\rProgress: ${i}/${totalUsuarios} (${((i/totalUsuarios)*100).toFixed(2)}%)`);
    }

    writeStream.write(']');  // Fin del array
    writeStream.end();

    sql.close();
}).catch(err => {
    console.log('Error on MSSQL connection: ', err);
});

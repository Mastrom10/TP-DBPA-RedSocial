const sql = require('mssql');
const faker = require('faker');

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

let UsuariosErrorCounter = 0;
let AmigosErrorCounter = 0;
let PublicacionesErrorCounter = 0;
let ComentariosErrorCounter = 0;


let CantidadUsuarios = 100000;
let CantidadAmigos = 100000;
let CantidadPublicaciones = 200000;
let CantidadComentarios = 1000000;


sql.connect(config).then(async pool => {
    console.log('Connected to MSSQL');

    for (let i = 0; i <= CantidadUsuarios; i++) {
        try {
            const nombre = faker.name.findName();
            const correo_electronico = faker.internet.email();
            const fecha_nacimiento = faker.date.past();
            const contrasena = faker.internet.password();

            await pool.request()
                .input('id_usuario', sql.Int, i)
                .input('nombre', sql.VarChar(100), nombre)
                .input('correo_electronico', sql.VarChar(100), correo_electronico)
                .input('fecha_nacimiento', sql.Date, fecha_nacimiento)
                .input('contrasena', sql.VarChar(100), contrasena)
                .query('INSERT INTO Usuarios (id_usuario, nombre, correo_electronico, fecha_nacimiento, contrasena) VALUES (@id_usuario, @nombre, @correo_electronico, @fecha_nacimiento, @contrasena)');
        } catch (err) {
            // console.log('Error on Usuarios table: ', err);
            UsuariosErrorCounter++;
        }
    }
    console.log('Finished populating Usuarios table');


    for (let i = 0; i <= CantidadAmigos; i++) {
        try {
            const id_usuario = Math.floor(Math.random() * CantidadUsuarios) + 1;
            const id_amigo = Math.floor(Math.random() * CantidadUsuarios) + 1;

            await pool.request()
                .input('id_usuario', sql.Int, id_usuario)
                .input('id_amigo', sql.Int, id_amigo)
                .query('INSERT INTO Amigos (id_usuario, id_amigo) VALUES (@id_usuario, @id_amigo)');
        } catch (err) {
            //console.log('Error on Amigos table: ', err);
            AmigosErrorCounter++;
        }
    }

    console.log('Finished populating Amigos table');

    for (let i = 0; i <= CantidadPublicaciones; i++) {
        try {
            const id_usuario = Math.floor(Math.random() * CantidadUsuarios) + 1;
            const contenido = faker.lorem.paragraph();
            const fecha_publicacion = faker.date.recent();

            await pool.request()
                .input('id_publicacion', sql.Int, i)
                .input('id_usuario', sql.Int, id_usuario)
                .input('contenido', sql.Text, contenido)
                .input('fecha_publicacion', sql.DateTime, fecha_publicacion)
                .query('INSERT INTO Publicaciones (id_publicacion, id_usuario, contenido, fecha_publicacion) VALUES (@id_publicacion, @id_usuario, @contenido, @fecha_publicacion)');
        } catch (err) {
            //console.log('Error on Publicaciones table: ', err);
            PublicacionesErrorCounter++;
        }
    }


    console.log('Finished populating Publicaciones table');

    for (let i = 0; i <= CantidadComentarios; i++) {
        try {
            const id_publicacion = Math.floor(Math.random() * CantidadPublicaciones) + 1;
            const id_usuario = Math.floor(Math.random() * CantidadUsuarios) + 1;
            const contenido = faker.lorem.sentence();

            await pool.request()
                .input('id_comentario', sql.Int, i)
                .input('id_publicacion', sql.Int, id_publicacion)
                .input('id_usuario', sql.Int, id_usuario)
                .input('contenido', sql.Text, contenido)
                .query('INSERT INTO Comentarios (id_comentario, id_publicacion, id_usuario, contenido) VALUES (@id_comentario, @id_publicacion, @id_usuario, @contenido)');
        }
        catch (err) {
            //console.log('Error on Comentarios table: ', err);
            ComentariosErrorCounter++;
        }
    }

    console.log('Finished populating Comentarios table');

    console.log('Finished populating all tables');
    console.log('--------------------------------');

    console.log('Usuarios Errors: ', UsuariosErrorCounter);
    console.log('Amigos Errors: ', AmigosErrorCounter);
    console.log('Publicaciones Errors: ', PublicacionesErrorCounter);
    console.log('Comentarios Errors: ', ComentariosErrorCounter);

    sql.close();
}).catch(err => {
    console.log('Error on MSSQL connection: ', err);
});



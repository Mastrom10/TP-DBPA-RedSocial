# TPRedSocial

Este proyecto incluye un script de Node.js que genera y popula una base de datos para una red social ficticia. El script genera datos para las tablas de Usuarios, Amigos, Publicaciones y Comentarios utilizando la biblioteca Faker.

## Requisitos

- Node.js
- MS SQL Server

## Instalación

Primero, clona este repositorio en tu máquina local.

```bash
git clone https://github.com/your-repo/tp-redsocial.git
```

Luego, navega al directorio del proyecto.

```bash
cd tp-redsocial
```

Instala las dependencias del proyecto.

```bash
npm install
```

## Uso

Para ejecutar el script, usa el comando `start` definido en el archivo `package.json`.

```bash
npm start
```

El script se conectará a tu base de datos MS SQL Server y comenzará a generar y insertar datos. Una vez que se hayan insertado todos los datos, el script imprimirá un resumen de la operación, incluyendo cualquier error que pueda haber ocurrido.

## Configuración de la base de datos

El script se conecta a la base de datos utilizando la configuración definida en el archivo `index.js`. Puedes modificar esta configuración para que coincida con tu entorno de base de datos.

```javascript
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
```

## Notas

Este script fue diseñado para un proyecto de prueba y no debe utilizarse en un entorno de producción. Los datos generados por el script son aleatorios y no tienen ningún significado real.
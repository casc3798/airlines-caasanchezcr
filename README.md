# Exámen práctico Diseño y construcción de APIs

#### Maestría en Ingeniería de Software MISO
#### Camilo Alejandro Sánchez Cruz


### 1. Cómo ejecutar
Para ejecutar el proyecto, es necesario tener una base de datos postgreSQL ejecutándose de manera local con las siguientes credenciales:

1. Usuario: postgres
2. Constraseña: postgres
3. Nombre base de datos: airlines

Para esto, se proporcionó un archivo `docker-compose.yml` en la raíz del proyecto para facilitar la ejecución. Para hacer uso de este, ejecutar `docker-compose up` en la raíz del proyecto. 

Teniendo la base de datos ejecutandose, ahora es necesario ejecutar la aplicación. Para esto, se deben instalar las dependencias del proyecto ejecutando `npm install` en la raíz del proyecto y luego `npm run start:dev`. Con esto se finaliza la ejecución del proyecto.

### 2. Pruebas unitarias
Para la ejecución de pruebas unitarias, ejecutar `npm run test` en la raíz del proyecto. No es necesario tener una base de datos ejecutandose debido a que las pruebas hacen uso de SQLite.

### 3. Colección de postman y pruebas del API
Las colecciones de postman se encuentran en la carpeta `collections` y en cada una de ellas se encuentran las peticiones con sus respectivas pruebas para validar la funcionalidad correcta del API. A continuación se listan las variables de entorno de postman para poder validar de forma correcta las funcionalidades del API.

1. baseURL: `localhost:3000/api/v1`
2. invalid_uuid: `f2f5b294-9311-4960-a4c1-c791f987877a`

También se encuentra un archivo con este ambiente en la misma carpeta `collections`

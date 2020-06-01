//Clases creadas
import Server from './Classes/Server'

//Dependencias externas de paquetes utilizadas
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import * as dotenv from "dotenv";
import DataBase from './Classes/DataBase';
import userRoutes from './routes/Users';
import claseRoutes from './routes/Clases';

//Variables de configuracion global
dotenv.config();

//Midleware
const server = new Server(Number(process.env.PORT));
server.app.use(bodyParser.urlencoded({extended: true}));
server.app.use(cors());
server.app.use(bodyParser.json());
server.app.use(fileUpload({useTempFiles:true}));

//Rutas de mi aplicacion
server.app.use('/user',userRoutes);
server.app.use('/curso',claseRoutes)

//Conexión a la base de datos

const conexion = new DataBase(Number(process.env.DB_PORT)||0,process.env.DB_USER||'', process.env.DB_PASS||'',process.env.DB_HOST||'');
if (conexion){
    console.log('Base de datos iniciada correctamente')
    server.startServer();
}else{
    console.log('Error al iniciar a la base de datos')
}
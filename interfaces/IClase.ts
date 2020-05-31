import { Document } from "mongoose";

export default interface IClase extends Document{
    nombre: String;
    descripcion: String;
    calificacion: Number;
    urlVideo: String;
    comentarios: [{
        usuario: String,
        comentario: String
    }]
}
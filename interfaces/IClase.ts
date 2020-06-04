import { Document } from "mongoose";

export default interface IClase extends Document{
    id: Number;
    titulo: String;
    descripcion: String;
    calificacion: Number;
    urlVideo: String;
    comentarios: [{
        usuario: String,
        comentario: String
    }]
}
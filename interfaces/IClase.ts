import { Document } from "mongoose";

export default interface IClase extends Document{
    nombre: String;
    descripcion: String;
    calificacion: Number;
    comentarios: [{
        usuario: String,
        comentario: String
    }]
}
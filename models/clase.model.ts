import { Schema, model} from 'mongoose';
import IClase from '../interfaces/IClase';


const claseSchema = new Schema({
    
    titulo: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    descripcion: {
        type: String,
        default: ''
    },
    id: {
        type: Number,
        unique: true,
        required: [ true, 'El correo es necesario' ]
    },
    imagenClase:{
        type: String,
        required: [ true, 'La imagen de la clase es necesaria para la clase' ]
    },
    nombreVideo:{
        type: String,
        required: [ true, 'El video es necesario para la clase' ]
    },
    calificacion:{
        type: Number,
        default: 5
    },
    comentarios: [
        {
            usuario: {
                type: Schema.Types.ObjectId,
                ref: 'Usuario',
                required: [ true, 'Debe de existir una referencia a un usuario' ]
            },
            comentario: {
                type: String,
                default: ''
            }

    }]

});



export const Clase = model<IClase>('Clase',claseSchema)
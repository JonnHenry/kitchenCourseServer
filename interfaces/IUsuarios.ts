import { Document } from "mongoose";

export default interface IUsuario extends Document{
    nombre: String;
    avatar: String;
    email: String; 
    password: String; 
    celular: String;
    sexo: String; 
    habilitado: Boolean;
    compararPassword(password: string): boolean;
}
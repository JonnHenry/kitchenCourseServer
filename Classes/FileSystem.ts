import { FileUpload } from '../interfaces/FileUpload';
import path from 'path';
import fs from 'fs';




export default class FileSystem {

    constructor() {
    }

    guardarImagen(file: FileUpload, userId: string, sexo: string) {
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(userId);
            const nombreArchivo = this.generarNombre(file.name, sexo);

            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(nombreArchivo);
                }
            })

        })
    }


    private generarNombre(nombreOriginal: string, sexo: string) {

        const nombreArr = nombreOriginal.split('.');
        const nuevoNombre = 'avatar'
        const extension = nombreArr[nombreArr.length - 1];
        return `${nuevoNombre}.${extension}`;
    }


    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads/users/', userId);
        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser);
        }
        return pathUser;
    }



    getFotoUrl(userId: string, img: string, sexo: string) {
        try {
            const pathFoto = path.resolve(__dirname, '../uploads/users/',`${userId}`,`${img}`);
            const existe = fs.existsSync(pathFoto);
            if (!existe) {
                if (sexo == 'masculino') {
                    return path.resolve(__dirname, '../../assets/masculino.png');
                } else {
                    return path.resolve(__dirname, '../../assets/femenino.png');
                }
            }
            return pathFoto

        } catch (e) {
            if (sexo == 'masculino') {
                return path.resolve(__dirname, '../../assets/masculino.png');
            } else {
                return path.resolve(__dirname, '../../assets/femenino.png');
            }
        }
    }

    getFotoClase(imgClase: string) {
        var pathFoto = path.resolve(__dirname, '../../assets/img_clases/', imgClase);

        const existe = fs.existsSync(pathFoto);
        if (!existe) {
            pathFoto = path.resolve(__dirname, '../../assets/img_clases/default.jpg');
        }
        return pathFoto;
    }


    getVideoClase(nombreVideo: string) {
        var pathFoto = path.resolve(__dirname, '../../assets/clases/', nombreVideo);
        try {
            const existe = fs.existsSync(pathFoto);
            if (!existe) {
                pathFoto = '';
            }
            return pathFoto;
        } catch (err) {
            return '';
        }


    }

}

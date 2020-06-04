import { Router, Request, Response } from 'express';
import { Clase } from '../models/Clase.model';
import { verificaToken } from '../middlewares/Autentication';

const claseRoutes = Router();

claseRoutes.get('/all', async (req: Request, res: Response) => {

    try {
        const clases = await Clase.find()
            .select('nombre descripcion calificacion')
            .sort({ id: 'asc' })
            .exec();

        res.status(200).json({
            ok: true,
            clases,
            mensaje: ''
        })
    } catch (error) {
        res.status(500).json({
            ok: true,
            clases: [],
            mensaje: 'Error al ejecutar la consulta'
        })

    }

});

//Se envia el id de la clase que igual es el orden de cada clase
claseRoutes.get('/clase', async (req: Request, res: Response) => {
    const idClase = req.params.id;
    try {
        const clase = await Clase.find({ id: idClase })
            .populate('comentarios.usuario', '-password -email -celular -sexo -habilitado')
            .exec()

        res.status(200).json({
            ok: true,
            clase,
            mensaje: ''

        })
    } catch (error) {
        res.status(500).json({
            ok: true,
            clase: {},
            mensaje: 'Error al ejecutar la consulta'
        })
    }
})

//Se debe de ingresar para esta llamada la siguiente informacion
//{
//  _id: id //Id del usuario
//  comentario: comentario
//  calificacion: calificacion Number !!Es la califcacion que el usuario ha dado    
//}


claseRoutes.post('/:idClase/comentario',verificaToken,(req: any, res: Response)=>{
    const body = req.body;
    const idClase =  req.params.idClase;
    const usuarioComentario = {
        usuario: req.usuario._id,
        comentario: body.comentario,
    }

    Clase.findOne({id: idClase}, (err, claseDB)=>{
        if (err || !claseDB) {
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'El clase no se encuentra registrado, verifique los datos'
            });
        }
        const calificacionActual = (claseDB.calificacion+body.calificacion)/2
        claseDB.calificacion = calificacionActual || claseDB.calificacion;
        claseDB.comentarios.push(usuarioComentario);
        claseDB.save()
        .then(()=>{
            res.status(200).json({
                ok: true,
                mensaje: 'El comentario se ha registrado correctamente'
            })
        })

        .catch(()=>{
            return res.status(400).json({
                ok: false,
                mensaje: 'Verifique los datos ingresados'
            });
        })

    });

})



claseRoutes.post('/create',(req: Request,res: Response)=>{
    const body = req.body;
    const clase = {
        id: body.id,
        titulo: body.titulo,
        descripcion: body.descripcion,
        urlVideo: body.urlVideo,
        comentarios: []
    };
    



})

export default claseRoutes;
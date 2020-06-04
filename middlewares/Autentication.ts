import { Response, Request, NextFunction } from 'express';
import Token from '../Classes/Token';
 

export const verificaToken = ( req: any, res: Response, next: NextFunction  ) => {

    const userToken = req.get('X-Token') || '';

    Token.comprobarToken( userToken )
        .then(  (decoded: any) => {
            req.usuario = decoded.usuario;
            next();
        })
        .catch( err => {

            res.json({
                ok: false,
                token: '',
                mensaje: 'El usuario no tiene acceso'
            });

        });




}
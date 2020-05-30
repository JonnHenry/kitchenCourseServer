import express from 'express';

export default class Server {

    private port: number;
    public app: express.Application;

    constructor(port: number){
        this.port = port;
        this.app = express();
    }

    startServer(){
        console.log(`Servidor funcionando en el puerto ${this.port}`)
    }

}
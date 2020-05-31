import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Token from '../Classes/Token';
import { verificaToken } from '../middlewares/Autenticacion';
import {} from '../models/clase.model'


const ClaseRoutes = Router();





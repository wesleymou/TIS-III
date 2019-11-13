import { Router } from "express";
import UserService from "../services/UserService";
import bcrypt, { genSalt } from 'bcrypt';
import User from "../models/User";

const service = new UserService();
const router = Router();

router.get('/signout', (req, res) => {
    if (req.session && req.session['token']) {
        req.session['token'] = null;
    }
    res.redirect('/');
});

router.post('/signin', async (req, res) => {
    const user: User = req.body;

    if (!user.password || !user.login) {
        return res.status(400).send('Login ou senha inválidos.');
    }

    const userFound: User = await service.getByUserName(user.login);

    if (!userFound || !userFound.id) {
        return res.status(400).send('Usuário não encontrado');
    }

    const matches = await bcrypt.compare(user.password, userFound.password);

    if (matches) {
        const json = JSON.stringify({
            user: {
                id: userFound.id,
                login: userFound.login
            }
        });

        const salt = await bcrypt.genSalt(10);
        const token = await bcrypt.hash(json, salt);

        if (req.session) {
            req.session['token'] = token;
        }
        res.end()
    } else {
        return res.status(400).send('Login ou senha inválidos.');
    }
});

router.post('/', async (req, res) => {
    return res.status(501).send("Função não implementada.");
    
    const user: User = req.body;

    if (!user.password || !user.login) {
        return res.status(400).send('Login ou senha inválidos.');
    }

    const userFound: User = await service.getByUserName(user.login);

    if (userFound && userFound.id) {
        return res.status(400).send('Nome de usuário indisponível');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;

    try {
        await service.createAsync(user);
        res.status(201).send('Criado com sucesso!');
    } catch (error) {
        res.status(500).send(error);
    }

});

export default router;

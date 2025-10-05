import express from 'express';
import {therapists} from './db.js';
import { STATUS_CODES } from 'http';

const app = express();

app.get('/therapists/', (req, res) => {
    if(therapists.length === 0) {
        return res.status(404).json({message: 'Данные не найдены'})
    }
    res.status(200).json(therapists);
})

app.listen(4200, () => {
    console.log('Сервер запущен')
});
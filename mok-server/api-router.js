import Router from 'express';
import * as db from './services/db.js';
import userRouter from './routes/users.js';
import * as OpenApiValidator from 'express-openapi-validator';
import openapi from './openapi.json' with { type: 'json' };

const router = Router();

router.use(
  OpenApiValidator.middleware({
    apiSpec: openapi,
    validateRequests: true,
    validateResponses: true,
    formats: [
      {
        name: 'phone',
        type: 'string',
        validate: (value) => /^\+?[1-9]\d{1,14}$/.test(value)
      }
    ]
  })
);
router.use(
(req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  }
);
router.use('/users', userRouter);

router.get('/therapists/', (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 10;
  if(db.therapists.length === 0) {
      return res.status(404).json({message: 'Данные не найдены'})
  }
  res.status(200).json(db.therapists.slice(skip, skip + limit));
})
router.get('/therapists/:therapistId', (req, res) => {

  const therapistId = req.params.therapistId;
  const therapist = db.therapists.find(t => t.id === therapistId);
  if(!therapist) {
      return res.status(404).json({message: 'Данные не найдены'})
  }
  res.status(200).json(therapist);
})

export default router;
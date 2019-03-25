import Router from 'express';
import validateSchema from '../schemas';

const router = Router();

router.post('/', validateSchema('car'), async (req, res) => {
  const { model, registration, seats } = req.body;

  const user = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });

  const exists = await req.context.models.Car.findOne({
    where: { UserId: user.id },
  });

  if (exists) {
    return res.status(400).send({
      status: 'unsuccessful',
      message: 'User already has a car',
    });
  }

  const car = await req.context.models.Car.create({
    model,
    registration,
    seats,
    UserId: user.id,
  });

  return res.status(201).send({ status: 'success', car });
});

router.put('/', async (req, res) => {
  const user = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });

  const exists = await req.context.models.Car.findOne({
    where: { UserId: user.id },
  });

  if (!exists) {
    return res.status(400).send({
      status: 'unsuccessful',
      message: 'User has no car',
    });
  }

  const { model, registration, seats } = req.body;

  await req.context.models.Car.update({
    model, registration, seats,
  },
  { where: { UserId: user.id } });

  return res.send({
    status: 'success',
    message: 'successfully updated car details',
  });
});

export default router;

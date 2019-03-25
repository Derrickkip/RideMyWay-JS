import Router from 'express';
import validateSchema from '../schemas';

const router = Router();

router.get('/', async (req, res) => {
  const rides = await req.context.models.Ride.findAll();

  return res.status(200).send({ message: 'success', rides });
});

router.post('/', validateSchema('new-ride'), async (req, res) => {
  const {
    start, destination, time, price,
  } = req.body;

  const userId = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });

  const ride = await req.context.models.Ride.create({
    start,
    destination,
    time,
    price,
    UserId: userId.id,
  });

  return res.status(201).send({
    message: 'ride successfully created',
    ride,
  });
});

router.get('/:rideId', async (req, res) => {
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `ride with id ${req.params.rideId} not found`,
    });
  }

  return res.send({ status: 'success', ride });
});

router.put('/:rideId', async (req, res) => {
  const user = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `ride with id ${req.params.rideId} not found`,
    });
  }

  if (ride.UserId !== user.id) {
    return res.status(401).send({
      status: 'unauthorized',
      message: 'you are not allowed to update this ride',
    });
  }

  const {
    start, destination, time, price,
  } = req.body;

  await req.context.models.Ride.update({
    start, destination, time, price,
  },
  { where: { id: req.params.rideId } });

  return res.send({
    status: 'success',
    message: 'successfully updated',
  });
});

router.delete('/:rideId', async (req, res) => {
  const userId = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `ride with id ${req.params.rideId} not found`,
    });
  }

  if (ride.UserId !== userId.id) {
    return res.status(401).send({
      status: 'unauthorized',
      message: 'you are not allowed delete this ride',
    });
  }

  await req.context.models.Ride.destroy({
    where: { id: req.params.rideId },
  });

  return res.send({
    status: 'success',
    message: 'successfully deleted ride',
  });
});

router.post('/:rideId/requests', async (req, res) => {
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `Ride with id ${req.params.rideId} was not found`,
    });
  }

  const user = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });

  if (user.id === ride.UserId) {
    return res.status(400).send({
      status: 'error',
      message: 'You cannot request your own ride',
    });
  }

  const request = await req.context.models.Request.findOne({
    where: { UserId: user.id, RideId: ride.id },
  });

  if (request) {
    return res.status(400).send({
      status: 'error',
      message: 'you have already requested for this ride',
    });
  }

  await req.context.models.Request.create({
    UserId: user.id,
    RideId: ride.id,
  });

  return res.status(201).send({
    status: 'success',
    message: 'You have successfully requested for this ride',
  });
});

router.get('/:rideId/requests', async (req, res) => {
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `Ride with id ${req.params.rideId} was not found`,
    });
  }

  const requests = await req.context.models.Request.findAll({
    where: { RideId: ride.id },
  });

  return res.send({
    status: 'successful',
    requests,
  });
});

router.delete('/:rideId/requests', async (req, res) => {
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `Ride with id ${req.params.rideId} was not found`,
    });
  }

  const user = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });

  const request = await req.context.models.Request.findOne({
    where: { RideId: ride.id, UserId: user.id },
  });

  if (!request) {
    return res.status(404).send({
      status: 'error',
      message: 'You have no requests for this ride',
    });
  }

  await req.context.models.Request.destroy({ where: { id: request.id } });

  return res.send({
    status: 'successful',
    message: 'You have successfully cancelled your request',
  });
});

router.put('/:rideId/requests/:requestId', validateSchema('response'), async (req, res) => {
  const ride = await req.context.models.Ride.findOne({
    where: { id: req.params.rideId },
  });

  if (!ride) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `Ride with id ${req.params.rideId} was not found`,
    });
  }

  const user = await req.context.models.User.findOne({
    where: { email: req.context.user },
  });

  if (user.id !== ride.UserId) {
    return res.status(401).send({
      status: 'unauthorized',
      message: 'You cannot update this request',
    });
  }

  const request = await req.context.models.Request.findOne({
    where: { id: req.params.requestId },
  });

  if (!request) {
    return res.status(404).send({
      status: 'unsuccessful',
      message: `Request with id ${req.params.requestId} was not found`,
    });
  }

  const { status } = req.body;

  await req.context.models.Request.update({ status }, {
    where: { id: request.id },
  });

  return res.send({
    status: 'successful',
    message: `you have ${status} this request`,
  });
});

export default router;

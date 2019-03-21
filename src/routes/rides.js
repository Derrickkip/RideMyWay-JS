import Router from 'express';
import validateSchema from '../schemas';

const router = Router()

router.get('/', async(req, res) => {
  const rides = await req.context.models.Ride.findAll()

  return res.status(200).send({'message': 'success','rides': rides})
});

router.post('/', validateSchema('new-ride'), async(req, res) => {
  const { start, destination, time, price } = req.body;

  const userId = await req.context.models.User.findOne({ where: { email: req.context.user }})

  const ride = await req.context.models.Ride.create({
    start,
    destination,
    time,
    price,
    UserId: userId.id
  })

  return res.status(201).send({
    'message': 'ride successfully created',
    ride
  })
});

router.get('/:rideId', async(req, res) => {
  const ride = await req.context.models.Ride.findOne({ where: { id: req.params.rideId}})

  if (!ride) {
    return res.status(404).send({'status': 'unsuccessful', 'message': `ride with id ${req.params.rideId} not found`})
  }

  return res.send({'status': 'success', ride})
});

router.put('/:rideId', async(req, res) => {
  const userId = await req.context.models.User.findOne({ where: { email: req.context.user }})
  const ride = await req.context.models.Ride.findOne({ where: { id: req.params.rideId}})

  if (!ride) {
    return res.status(404).send({'status': 'unsuccessful', 'message': `ride with id ${req.params.rideId} not found`})
  }

  if (ride.UserId !== userId.id) {
    return res.status(401).send({'status':'unauthorized', 'message': 'you are not allowed to update this ride'})
  }

  const { start, destination, time, price }  = req.body;

  await req.context.models.Ride.update({ start, destination, time, price }, 
    {where: { id: req.params.rideId }})

  return res.send({'status': 'success', 'message': 'successfully updated'})
  

});

router.delete('/:rideId', async(req, res) => {
  const userId = await req.context.models.User.findOne({ where: { email: req.context.user }})
  const ride = await req.context.models.Ride.findOne({ where: { id: req.params.rideId}})

  if (!ride) {
    return res.status(404).send({'status': 'unsuccessful', 'message': `ride with id ${req.params.rideId} not found`})
  };

  if (ride.UserId !== userId.id) {
    return res.status(401).send({'status':'unauthorized', 'message': 'you are not allowed delete this ride'})
  };

  await req.context.models.Ride.destroy({ where: {id: req.params.rideId}})

  return res.send({'status': 'success', 'message': 'successfully deleted ride'})

})

export default router;
const express = require('express');
const router = express.Router();

// Mock data
const flights = [
  { id: 1, airline: 'Air France', from: 'NYC', to: 'Paris', price: 450 },
  { id: 2, airline: 'JAL', from: 'LAX', to: 'Tokyo', price: 650 }
];

// GET all flights
router.get('/', (req, res) => {
  res.json(flights);
});

// GET flight by ID
router.get('/:id', (req, res) => {
  const flight = flights.find(f => f.id === parseInt(req.params.id));
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  res.json(flight);
});

// POST new flight
router.post('/', (req, res) => {
  const newFlight = {
    id: flights.length + 1,
    ...req.body
  };
  flights.push(newFlight);
  res.status(201).json(newFlight);
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Mock data
const destinations = [
  { id: 1, name: 'Paris', country: 'France', description: 'City of Love' },
  { id: 2, name: 'Tokyo', country: 'Japan', description: 'Land of Rising Sun' }
];

// GET all destinations
router.get('/', (req, res) => {
  res.json(destinations);
});

// GET destination by ID
router.get('/:id', (req, res) => {
  const destination = destinations.find(d => d.id === parseInt(req.params.id));
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  res.json(destination);
});

// POST new destination
router.post('/', (req, res) => {
  const newDestination = {
    id: destinations.length + 1,
    ...req.body
  };
  destinations.push(newDestination);
  res.status(201).json(newDestination);
});

module.exports = router;

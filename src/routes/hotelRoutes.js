const express = require('express');
const router = express.Router();

// Mock data
const hotels = [
  { id: 1, name: 'Hotel Eiffel', location: 'Paris', rating: 4, price: 120 },
  { id: 2, name: 'Tokyo Palace', location: 'Tokyo', rating: 5, price: 180 }
];

// GET all hotels
router.get('/', (req, res) => {
  res.json(hotels);
});

// GET hotel by ID
router.get('/:id', (req, res) => {
  const hotel = hotels.find(h => h.id === parseInt(req.params.id));
  if (!hotel) {
    return res.status(404).json({ error: 'Hotel not found' });
  }
  res.json(hotel);
});

// POST new hotel
router.post('/', (req, res) => {
  const newHotel = {
    id: hotels.length + 1,
    ...req.body
  };
  hotels.push(newHotel);
  res.status(201).json(newHotel);
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Mock data
const activities = [
  { id: 1, name: 'Eiffel Tower Tour', location: 'Paris', price: 45 },
  { id: 2, name: 'Sushi Making Class', location: 'Tokyo', price: 65 }
];

// GET all activities
router.get('/', (req, res) => {
  res.json(activities);
});

// GET activity by ID
router.get('/:id', (req, res) => {
  const activity = activities.find(a => a.id === parseInt(req.params.id));
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  res.json(activity);
});

// POST new activity
router.post('/', (req, res) => {
  const newActivity = {
    id: activities.length + 1,
    ...req.body
  };
  activities.push(newActivity);
  res.status(201).json(newActivity);
});

module.exports = router;

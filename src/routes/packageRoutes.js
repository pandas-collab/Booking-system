const express = require('express');
const router = express.Router();

// Mock data
const packages = [
  { id: 1, name: 'Paris Weekend', price: 599, duration: '3 days' },
  { id: 2, name: 'Tokyo Adventure', price: 1299, duration: '7 days' }
];

// GET all packages
router.get('/', (req, res) => {
  res.json(packages);
});

// GET package by ID
router.get('/:id', (req, res) => {
  const pkg = packages.find(p => p.id === parseInt(req.params.id));
  if (!pkg) {
    return res.status(404).json({ error: 'Package not found' });
  }
  res.json(pkg);
});

// POST new package
router.post('/', (req, res) => {
  const newPackage = {
    id: packages.length + 1,
    ...req.body
  };
  packages.push(newPackage);
  res.status(201).json(newPackage);
});

module.exports = router;

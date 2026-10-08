const express = require('express');
const router = express.Router();

// Mock database - replace with actual database connection
const packages = [
  { id: 1, name: 'express', version: '4.18.0', category: 'web', tags: ['framework', 'server'], downloads: 50000, createdAt: '2023-01-01', author: 'tj' },
  { id: 2, name: 'lodash', version: '4.17.21', category: 'utility', tags: ['utility', 'helper'], downloads: 75000, createdAt: '2023-01-15', author: 'jdalton' },
  { id: 3, name: 'react', version: '18.2.0', category: 'ui', tags: ['ui', 'framework'], downloads: 100000, createdAt: '2023-02-01', author: 'facebook' },
  { id: 4, name: 'vue', version: '3.3.4', category: 'ui', tags: ['ui', 'framework'], downloads: 80000, createdAt: '2023-02-15', author: 'yyx990803' },
  { id: 5, name: 'axios', version: '1.4.0', category: 'http', tags: ['http', 'client'], downloads: 60000, createdAt: '2023-03-01', author: 'mzabriskie' }
];

// Helper function to parse query parameters
const parseQueryParams = (req) => {
  const {
    search,
    category,
    tags,
    author,
    minDownloads,
    maxDownloads,
    dateFrom,
    dateTo,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    limit = 10,
    fields
  } = req.query;

  return {
    search: search ? search.toLowerCase() : null,
    category: category ? category.toLowerCase() : null,
    tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : null,
    author: author ? author.toLowerCase() : null,
    minDownloads: minDownloads ? parseInt(minDownloads) : null,
    maxDownloads: maxDownloads ? parseInt(maxDownloads) : null,
    dateFrom: dateFrom ? new Date(dateFrom) : null,
    dateTo: dateTo ? new Date(dateTo) : null,
    sortBy,
    sortOrder: sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc',
    page: parseInt(page),
    limit: Math.min(parseInt(limit), 100),
    fields: fields ? fields.split(',').map(field => field.trim()) : null
  };
};

// Helper function to filter packages
const filterPackages = (packages, filters) => {
  return packages.filter(pkg => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search;
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm) ||
                           pkg.category.toLowerCase().includes(searchTerm) ||
                           pkg.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                           pkg.author.toLowerCase().includes(searchTerm);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (filters.category && pkg.category.toLowerCase() !== filters.category) {
      return false;
    }

    // Tags filter (package must have all specified tags)
    if (filters.tags) {
      const pkgTags = pkg.tags.map(tag => tag.toLowerCase());
      const hasAllTags = filters.tags.every(tag => pkgTags.includes(tag));
      if (!hasAllTags) return false;
    }

    // Author filter
    if (filters.author && pkg.author.toLowerCase() !== filters.author) {
      return false;
    }

    // Downloads range filter
    if (filters.minDownloads && pkg.downloads < filters.minDownloads) {
      return false;
    }
    if (filters.maxDownloads && pkg.downloads > filters.maxDownloads) {
      return false;
    }

    // Date range filter
    const pkgDate = new Date(pkg.createdAt);
    if (filters.dateFrom && pkgDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && pkgDate > filters.dateTo) {
      return false;
    }

    return true;
  });
};

// Helper function to sort packages
const sortPackages = (packages, sortBy, sortOrder) => {
  return packages.sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle different data types
    if (sortBy === 'createdAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    let comparison = 0;
    if (aValue < bValue) {
      comparison = -1;
    } else if (aValue > bValue) {
      comparison = 1;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Helper function to paginate results
const paginateResults = (packages, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return packages.slice(startIndex, endIndex);
};

// Helper function to select fields
const selectFields = (packages, fields) => {
  if (!fields) return packages;
  
  return packages.map(pkg => {
    const selectedPkg = {};
    fields.forEach(field => {
      if (pkg.hasOwnProperty(field)) {
        selectedPkg[field] = pkg[field];
      }
    });
    return selectedPkg;
  });
};

// GET /packages - Get all packages with filtering, sorting, and pagination
router.get('/', (req, res) => {
  try {
    const filters = parseQueryParams(req);
    
    // Validate sort field
    const validSortFields = ['id', 'name', 'version', 'category', 'downloads', 'createdAt', 'author'];
    if (!validSortFields.includes(filters.sortBy)) {
      return res.status(400).json({
        error: 'Invalid sort field',
        validFields: validSortFields
      });
    }

    // Apply filters
    let filteredPackages = filterPackages(packages, filters);

    // Get total count before pagination
    const totalCount = filteredPackages.length;

    // Apply sorting
    filteredPackages = sortPackages(filteredPackages, filters.sortBy, filters.sortOrder);

    // Apply pagination
    const paginatedPackages = paginateResults(filteredPackages, filters.page, filters.limit);

    // Apply field selection
    const selectedPackages = selectFields(paginatedPackages, filters.fields);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / filters.limit);
    const hasNextPage = filters.page < totalPages;
    const hasPrevPage = filters.page > 1;

    res.json({
      packages: selectedPackages,
      pagination: {
        currentPage: filters.page,
        totalPages,
        totalCount,
        pageSize: filters.limit,
        hasNextPage,
        hasPrevPage
      },
      filters: {
        applied: Object.keys(req.query).length > 0,
        ...filters
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /packages/:id - Get package by ID
router.get('/:id', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const pkg = packages.find(p => p.id === packageId);
    
    if (!pkg) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json(pkg);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// POST /packages - Create new package
router.post('/', (req, res) => {
  try {
    const { name, version, category, tags = [], author } = req.body;

    // Validation
    if (!name || !version || !category || !author) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'version', 'category', 'author']
      });
    }

    // Check if package already exists
    const existingPackage = packages.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (existingPackage) {
      return res.status(409).json({ error: 'Package already exists' });
    }

    const newPackage = {
      id: packages.length + 1,
      name,
      version,
      category: category.toLowerCase(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.toLowerCase()) : [],
      downloads: 0,
      createdAt: new Date().toISOString().split('T')[0],
      author: author.toLowerCase()
    };

    packages.push(newPackage);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// PUT /packages/:id - Update package
router.put('/:id', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const packageIndex = packages.findIndex(p => p.id === packageId);
    
    if (packageIndex === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const { name, version, category, tags, downloads, author } = req.body;
    const updatedPackage = { ...packages[packageIndex] };

    // Update fields if provided
    if (name) updatedPackage.name = name;
    if (version) updatedPackage.version = version;
    if (category) updatedPackage.category = category.toLowerCase();
    if (tags) updatedPackage.tags = Array.isArray(tags) ? tags.map(tag => tag.toLowerCase()) : [];
    if (downloads !== undefined) updatedPackage.downloads = parseInt(downloads);
    if (author) updatedPackage.author = author.toLowerCase();

    packages[packageIndex] = updatedPackage;
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// DELETE /packages/:id - Delete package
router.delete('/:id', (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    const packageIndex = packages.findIndex(p => p.id === packageId);
    
    if (packageIndex === -1) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const deletedPackage = packages.splice(packageIndex, 1)[0];
    res.json({ message: 'Package deleted successfully', package: deletedPackage });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /packages/stats/summary - Get package statistics
router.get('/stats/summary', (req, res) => {
  try {
    const totalPackages = packages.length;
    const totalDownloads = packages.reduce((sum, pkg) => sum + pkg.downloads, 0);
    const categories = [...new Set(packages.map(pkg => pkg.category))];
    const topAuthors = packages.reduce((acc, pkg) => {
      acc[pkg.author] = (acc[pkg.author] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalPackages,
      totalDownloads,
      categoriesCount: categories.length,
      categories,
      topAuthors: Object.entries(topAuthors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([author, count]) => ({ author, packages: count }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;
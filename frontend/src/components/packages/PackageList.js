import React, { useState, useEffect } from 'react';
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Button, Typography } from '@mui/material';
import PackageCard from './PackageCard';

const PackageList = ({ 

  const handlePackageSelect = (packageId, isSelected) => {
    if (isSelected && selectedPackages.length >= 3) {
      alert("You can only compare up to 3 packages");
      return;
    }
    const updatedSelection = isSelected
      ? [...selectedPackages, packages.find(p => p.id === packageId)]
      : selectedPackages.filter(p => p.id !== packageId);
    onPackageSelect(updatedSelection);
  };
  packages = [], 
  onPackageSelect, 
  selectedPackages = [], 
  showComparison = false,
  onCompare 
}) => {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectAll, setSelectAll] = useState(false);
  const [sortedPackages, setSortedPackages] = useState([]);

  useEffect(() => {
    const sorted = [...packages].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setSortedPackages(sorted);
  }, [packages, sortBy, sortOrder]);

  useEffect(() => {
    setSelectAll(packages.length > 0 && selectedPackages.length === packages.length);
  }, [selectedPackages, packages]);

  const handleSortChange = (event) => {
    const [field, order] = event.target.value.split('-');
    setSortBy(field);
    setSortOrder(order);
  };

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    
    if (isChecked) {
      const allPackageIds = packages.map(pkg => pkg.id);
      onPackageSelect && onPackageSelect(allPackageIds);
    } else {
      onPackageSelect && onPackageSelect([]);
    }
  };

  const handlePackageSelection = (packageId, isSelected) => {
    if (!onPackageSelect) return;

    let newSelection = [...selectedPackages];
    
    if (isSelected) {
      if (!newSelection.includes(packageId)) {
        newSelection.push(packageId);
      }
    } else {
      newSelection = newSelection.filter(id => id !== packageId);
    }
    
    onPackageSelect(newSelection);
  };

  const getSortDisplayValue = () => {
    return `${sortBy}-${sortOrder}`;
  };

  if (!packages || packages.length === 0) {
    return (
    {selectedPackages.length > 0 && (
      <div className="sticky-compare">
        <button onClick={() => onCompare(selectedPackages)}>
          Compare Selected ({selectedPackages.length})
        </button>
      </div>
    )}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No packages found
        </Typography>
      </Box>
    );
  }

  return (
    {selectedPackages.length > 0 && (
      <div className="sticky-compare">
        <button onClick={() => onCompare(selectedPackages)}>
          Compare Selected ({selectedPackages.length})
        </button>
      </div>
    )}
    <Box sx={{ width: '100%' }}>
      {/* Controls Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {showComparison && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  indeterminate={selectedPackages.length > 0 && selectedPackages.length < packages.length}
                />
              }
              label="Select All"
            />
          )}
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={getSortDisplayValue()}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="price-asc">Price (Low to High)</MenuItem>
              <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              <MenuItem value="rating-desc">Rating (High to Low)</MenuItem>
              <MenuItem value="rating-asc">Rating (Low to High)</MenuItem>
              <MenuItem value="createdAt-desc">Newest First</MenuItem>
              <MenuItem value="createdAt-asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {showComparison && selectedPackages.length > 1 && onCompare && (
          <Button 
            variant="contained" 
            onClick={() => onCompare(selectedPackages)}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Compare Selected ({selectedPackages.length})
          </Button>
        )}
      </Box>

      {/* Package Grid */}
      <Grid container spacing={3}>
        {sortedPackages.map((packageItem) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={packageItem.id}>
            <PackageCard
              package={packageItem}
              isSelected={selectedPackages.includes(packageItem.id)}
              onSelect={showComparison ? (isSelected) => handlePackageSelection(packageItem.id, isSelected) : undefined}
              showCheckbox={showComparison}
            />
          </Grid>
        ))}
      </Grid>

      {/* Results Summary */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {sortedPackages.length} package{sortedPackages.length !== 1 ? 's' : ''}
          {selectedPackages.length > 0 && (
            <span> • {selectedPackages.length} selected</span>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default PackageList;
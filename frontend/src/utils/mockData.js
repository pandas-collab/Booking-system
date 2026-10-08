// Mock data for destinations
export const destinations = [
  {
    id: 1,
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    description: "Beautiful Greek island with stunning sunsets and white-washed buildings",
    mainImage: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500",
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500"
    ],
    averageRating: 4.8,
    reviewCount: 245,
    startingPrice: 899,
    activities: ["Culture", "Beach", "Photography"],
    duration: "7 days",
    popular: true
  },
  {
    id: 2,
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    description: "Tropical paradise with temples, beaches, and lush landscapes",
    mainImage: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500"
    ],
    averageRating: 4.7,
    reviewCount: 312,
    startingPrice: 699,
    activities: ["Adventure", "Culture", "Beach"],
    duration: "10 days",
    popular: true
  },
  {
    id: 3,
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    description: "Ancient Japanese capital with temples, gardens, and traditional culture",
    mainImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=500"
    ],
    averageRating: 4.9,
    reviewCount: 189,
    startingPrice: 1299,
    activities: ["Culture", "Photography", "History"],
    duration: "8 days",
    popular: false
  },
  {
    id: 4,
    name: "Machu Picchu",
    country: "Peru",
    region: "South America",
    description: "Ancient Inca citadel high in the Andes Mountains",
    mainImage: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500",
      "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?w=500"
    ],
    averageRating: 4.6,
    reviewCount: 156,
    startingPrice: 1599,
    activities: ["Adventure", "History", "Hiking"],
    duration: "6 days",
    popular: true
  },
  {
    id: 5,
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    description: "Modern metropolis with luxury shopping, ultramodern architecture",
    mainImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500",
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500"
    ],
    averageRating: 4.5,
    reviewCount: 278,
    startingPrice: 999,
    activities: ["Luxury", "Shopping", "Adventure"],
    duration: "5 days",
    popular: false
  },
  {
    id: 6,
    name: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    description: "Capital city known for Northern Lights and natural hot springs",
    mainImage: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    averageRating: 4.4,
    reviewCount: 134,
    startingPrice: 1199,
    activities: ["Adventure", "Nature", "Photography"],
    duration: "7 days",
    popular: false
  },
  {
    id: 7,
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    description: "Imperial city with bustling souks and stunning architecture",
    mainImage: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=500",
      "https://images.unsplash.com/photo-1558969134-c64ec2d4e938?w=500"
    ],
    averageRating: 4.3,
    reviewCount: 201,
    startingPrice: 799,
    activities: ["Culture", "Shopping", "Adventure"],
    duration: "6 days",
    popular: false
  },
  {
    id: 8,
    name: "Vancouver",
    country: "Canada",
    region: "North America",
    description: "Coastal seaport city with mountains and ocean views",
    mainImage: "https://images.unsplash.com/photo-1549890762-0a3f8933bc5b?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1549890762-0a3f8933bc5b?w=500",
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500"
    ],
    averageRating: 4.6,
    reviewCount: 167,
    startingPrice: 1099,
    activities: ["Nature", "Adventure", "Culture"],
    duration: "8 days",
    popular: false
  },
  {
    id: 9,
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    description: "Coastal city with Table Mountain and wine regions nearby",
    mainImage: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=500",
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=500"
    ],
    averageRating: 4.7,
    reviewCount: 223,
    startingPrice: 1399,
    activities: ["Adventure", "Nature", "Wine"],
    duration: "9 days",
    popular: true
  },
  {
    id: 10,
    name: "Queenstown",
    country: "New Zealand",
    region: "Oceania",
    description: "Adventure capital surrounded by mountains and lakes",
    mainImage: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=500",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500"
    ],
    averageRating: 4.8,
    reviewCount: 189,
    startingPrice: 1699,
    activities: ["Adventure", "Nature", "Extreme Sports"],
    duration: "7 days",
    popular: true
  },
  {
    id: 11,
    name: "Prague",
    country: "Czech Republic",
    region: "Europe",
    description: "Medieval city with stunning architecture and rich history",
    mainImage: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=500",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500"
    ],
    averageRating: 4.5,
    reviewCount: 298,
    startingPrice: 699,
    activities: ["Culture", "History", "Photography"],
    duration: "5 days",
    popular: false
  },
  {
    id: 12,
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    description: "Coastal capital with colorful neighborhoods and historic trams",
    mainImage: "https://images.unsplash.com/photo-1588638280707-bd3c037b4a42?w=500",
    gallery: [
      "https://images.unsplash.com/photo-1588638280707-bd3c037b4a42?w=500",
      "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=500"
    ],
    averageRating: 4.4,
    reviewCount: 176,
    startingPrice: 899,
    activities: ["Culture", "Beach", "History"],
    duration: "6 days",
    popular: false
  }
];

// Helper functions for filtering and sorting
export const getDestinations = () => destinations;

export const getDestinationById = (id) => {
  return destinations.find(dest => dest.id === parseInt(id));
};

export const filterDestinations = (filters) => {
  let filtered = [...destinations];

  if (filters.search) {
    filtered = filtered.filter(dest =>
      dest.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      dest.country.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  if (filters.region && filters.region.length > 0) {
    filtered = filtered.filter(dest => filters.region.includes(dest.region));
  }

  if (filters.activities && filters.activities.length > 0) {
    filtered = filtered.filter(dest =>
      filters.activities.some(activity => dest.activities.includes(activity))
    );
  }

  if (filters.priceRange) {
    filtered = filtered.filter(dest =>
      dest.startingPrice >= filters.priceRange.min &&
      dest.startingPrice <= filters.priceRange.max
    );
  }

  if (filters.duration) {
    filtered = filtered.filter(dest => dest.duration === filters.duration);
  }

  return filtered;
};

export const sortDestinations = (destinations, sortBy) => {
  const sorted = [...destinations];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    case 'price-high':
      return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    case 'rating':
      return sorted.sort((a, b) => b.averageRating - a.averageRating);
    case 'popular':
      return sorted.sort((a, b) => b.popular - a.popular);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};

// Available filter options
export const filterOptions = {
  regions: ["Europe", "Asia", "Africa", "North America", "South America", "Middle East", "Oceania"],
  activities: ["Adventure", "Culture", "Beach", "Nature", "History", "Photography", "Shopping", "Luxury", "Wine", "Extreme Sports", "Hiking"],
  durations: ["5 days", "6 days", "7 days", "8 days", "9 days", "10 days"],
  priceRanges: [
    { label: "Under $1000", min: 0, max: 999 },
    { label: "$1000 - $1500", min: 1000, max: 1500 },
    { label: "Over $1500", min: 1501, max: 9999 }
  ]
};

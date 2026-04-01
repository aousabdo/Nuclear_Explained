export interface City {
  name: string
  lat: number
  lng: number
  country: string
  population?: number
}

export const CITIES: City[] = [
  // --- Original cities ---
  { name: 'Nevada Test Site', lat: 37.0, lng: -116.05, country: 'US' },
  { name: 'New York City', lat: 40.7128, lng: -74.006, country: 'US', population: 8336817 },
  { name: 'Washington, D.C.', lat: 38.9072, lng: -77.0369, country: 'US', population: 689545 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'US', population: 3979576 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, country: 'US', population: 2693976 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698, country: 'US', population: 2304580 },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', population: 8982000 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', population: 2161000 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173, country: 'Russia', population: 12506468 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China', population: 21540000 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', population: 13960000 },
  { name: 'Hiroshima', lat: 34.3853, lng: 132.4553, country: 'Japan', population: 1199391 },
  { name: 'Nagasaki', lat: 32.7503, lng: 129.8777, country: 'Japan', population: 429508 },
  { name: 'Tehran', lat: 35.6892, lng: 51.389, country: 'Iran', population: 8694000 },
  { name: 'Isfahan', lat: 32.6546, lng: 51.668, country: 'Iran', population: 2243000 },
  { name: 'Fordow (Nuclear Facility)', lat: 34.884, lng: 51.263, country: 'Iran' },
  { name: 'Natanz (Nuclear Facility)', lat: 33.726, lng: 51.727, country: 'Iran' },
  { name: 'Pyongyang', lat: 39.0392, lng: 125.7625, country: 'North Korea', population: 2870000 },
  { name: 'Seoul', lat: 37.5665, lng: 126.978, country: 'South Korea', population: 9776000 },
  { name: 'Kyiv', lat: 50.4501, lng: 30.5234, country: 'Ukraine', population: 2884000 },
  { name: 'Berlin', lat: 52.52, lng: 13.405, country: 'Germany', population: 3748148 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', population: 12442373 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479, country: 'Pakistan', population: 1095000 },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', population: 460613 },

  // --- US Cities ---
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, country: 'US', population: 873965 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321, country: 'US', population: 737255 },
  { name: 'Boston', lat: 42.3601, lng: -71.0589, country: 'US', population: 675647 },
  { name: 'Dallas', lat: 32.7767, lng: -96.797, country: 'US', population: 1304379 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.074, country: 'US', population: 1608139 },
  { name: 'Denver', lat: 39.7392, lng: -104.9903, country: 'US', population: 715522 },
  { name: 'Atlanta', lat: 33.749, lng: -84.388, country: 'US', population: 498715 },
  { name: 'Miami', lat: 25.7617, lng: -80.1918, country: 'US', population: 467963 },
  { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, country: 'US', population: 1603797 },
  { name: 'San Diego', lat: 32.7157, lng: -117.1611, country: 'US', population: 1423851 },
  { name: 'Portland', lat: 45.5051, lng: -122.675, country: 'US', population: 652503 },
  { name: 'Minneapolis', lat: 44.9778, lng: -93.265, country: 'US', population: 429606 },
  { name: 'Detroit', lat: 42.3314, lng: -83.0458, country: 'US', population: 632464 },
  { name: 'San Antonio', lat: 29.4241, lng: -98.4936, country: 'US', population: 1434625 },
  { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, country: 'US', population: 641903 },
  { name: 'Baltimore', lat: 39.2904, lng: -76.6122, country: 'US', population: 585708 },
  { name: 'Tampa', lat: 27.9506, lng: -82.4572, country: 'US', population: 399700 },
  { name: 'Norfolk', lat: 36.8508, lng: -76.2859, country: 'US', population: 244703 },
  { name: 'Colorado Springs', lat: 38.8339, lng: -104.8214, country: 'US', population: 478221 },

  // --- US Nuclear / Military Sites ---
  { name: 'Cheyenne Mountain (NORAD)', lat: 38.7442, lng: -104.8461, country: 'US' },
  { name: 'Minot AFB', lat: 48.4156, lng: -101.358, country: 'US' },
  { name: 'Malmstrom AFB', lat: 47.5058, lng: -111.1878, country: 'US' },
  { name: 'Warren AFB', lat: 41.1453, lng: -104.8214, country: 'US' },
  { name: 'Los Alamos', lat: 35.8823, lng: -106.2978, country: 'US', population: 12019 },
  { name: 'Pantex Plant', lat: 35.2403, lng: -101.5002, country: 'US' },
  { name: 'Oak Ridge', lat: 36.0104, lng: -84.2696, country: 'US', population: 29508 },
  { name: 'Kings Bay Submarine Base', lat: 30.799, lng: -81.5526, country: 'US' },

  // --- Europe ---
  { name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy', population: 2873494 },
  { name: 'Madrid', lat: 40.4168, lng: -3.7038, country: 'Spain', population: 3266126 },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands', population: 921402 },
  { name: 'Brussels', lat: 50.8503, lng: 4.3517, country: 'Belgium', population: 1218255 },
  { name: 'Vienna', lat: 48.2082, lng: 16.3738, country: 'Austria', population: 1897491 },
  { name: 'Warsaw', lat: 52.2297, lng: 21.0122, country: 'Poland', population: 1793579 },
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686, country: 'Sweden', population: 975904 },
  { name: 'Zurich', lat: 47.3769, lng: 8.5417, country: 'Switzerland', population: 434335 },
  { name: 'Budapest', lat: 47.4979, lng: 19.0402, country: 'Hungary', population: 1756000 },
  { name: 'Prague', lat: 50.0755, lng: 14.4378, country: 'Czech Republic', population: 1335084 },
  { name: 'Lisbon', lat: 38.7223, lng: -9.1393, country: 'Portugal', population: 544851 },
  { name: 'Athens', lat: 37.9838, lng: 23.7275, country: 'Greece', population: 3153000 },
  { name: 'Istanbul', lat: 41.0082, lng: 28.9784, country: 'Turkey', population: 15462452 },
  { name: 'Ankara', lat: 39.9334, lng: 32.8597, country: 'Turkey', population: 5639076 },

  // --- Russia ---
  { name: 'St. Petersburg', lat: 59.9311, lng: 30.3609, country: 'Russia', population: 5384342 },
  { name: 'Novosibirsk', lat: 54.9884, lng: 82.9357, country: 'Russia', population: 1625631 },
  { name: 'Yekaterinburg', lat: 56.8389, lng: 60.6057, country: 'Russia', population: 1544376 },
  { name: 'Vladivostok', lat: 43.1332, lng: 131.9113, country: 'Russia', population: 604901 },
  { name: 'Severodvinsk', lat: 64.5635, lng: 39.8302, country: 'Russia', population: 186000 },
  { name: 'Plesetsk Cosmodrome', lat: 62.9255, lng: 40.5769, country: 'Russia' },

  // --- Middle East ---
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'UAE', population: 3331420 },
  { name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, country: 'UAE', population: 1483000 },
  { name: 'Baghdad', lat: 33.3152, lng: 44.3661, country: 'Iraq', population: 7144260 },
  { name: 'Riyadh', lat: 24.6877, lng: 46.7219, country: 'Saudi Arabia', population: 7538200 },
  { name: 'Dimona (Nuclear Facility)', lat: 31.0681, lng: 35.1552, country: 'Israel' },
  { name: 'Bushehr (Nuclear Plant)', lat: 28.9727, lng: 50.8385, country: 'Iran', population: 220453 },

  // --- Asia ---
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China', population: 26317104 },
  { name: 'Guangzhou', lat: 23.1291, lng: 113.2644, country: 'China', population: 16096724 },
  { name: 'Shenzhen', lat: 22.5431, lng: 114.0579, country: 'China', population: 17494398 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'China', population: 7413070 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', population: 5850342 },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018, country: 'Thailand', population: 10539415 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456, country: 'Indonesia', population: 10562088 },
  { name: 'Manila', lat: 14.5995, lng: 120.9842, country: 'Philippines', population: 1846513 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011, country: 'Pakistan', population: 14910352 },
  { name: 'New Delhi', lat: 28.6139, lng: 77.209, country: 'India', population: 32941309 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, country: 'India', population: 12327006 },
  { name: 'Lahore', lat: 31.5497, lng: 74.3436, country: 'Pakistan', population: 13095116 },
  { name: 'Yongbyon (NK Nuclear Facility)', lat: 39.7867, lng: 125.7575, country: 'North Korea' },
  { name: 'Wonsan', lat: 39.1528, lng: 127.4436, country: 'North Korea', population: 363127 },

  // --- Africa ---
  { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt', population: 21750020 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria', population: 14862111 },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa', population: 5635127 },
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219, country: 'Kenya', population: 4922626 },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898, country: 'Morocco', population: 3752000 },

  // --- Americas ---
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', population: 2930000 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332, country: 'Mexico', population: 21672000 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil', population: 22430000 },
  { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, country: 'Argentina', population: 15369919 },
  { name: 'Bogotá', lat: 4.711, lng: -74.0721, country: 'Colombia', population: 7743955 },
  { name: 'Lima', lat: -12.046, lng: -77.0428, country: 'Peru', population: 11044607 },
  { name: 'Santiago', lat: -33.4489, lng: -70.6693, country: 'Chile', population: 7112808 },

  // --- Australia / Pacific ---
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', population: 5312000 },
  { name: 'Melbourne', lat: -37.8136, lng: 144.9631, country: 'Australia', population: 5078193 },

  // --- Additional Nuclear Facilities ---
  { name: 'Kahuta Research Labs (Pakistan)', lat: 33.5965, lng: 73.3864, country: 'Pakistan' },
  { name: 'Khushab (Pakistan Plutonium)', lat: 32.0355, lng: 72.1946, country: 'Pakistan' },
]

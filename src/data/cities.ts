export interface City {
  name: string
  lat: number
  lng: number
  country: string
  population?: number
}

export const CITIES: City[] = [
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
  { name: 'Isfahan', lat: 32.6546, lng: 51.6680, country: 'Iran', population: 2243000 },
  { name: 'Fordow (Nuclear Facility)', lat: 34.884, lng: 51.263, country: 'Iran' },
  { name: 'Natanz (Nuclear Facility)', lat: 33.726, lng: 51.727, country: 'Iran' },
  { name: 'Pyongyang', lat: 39.0392, lng: 125.7625, country: 'North Korea', population: 2870000 },
  { name: 'Seoul', lat: 37.5665, lng: 126.978, country: 'South Korea', population: 9776000 },
  { name: 'Kyiv', lat: 50.4501, lng: 30.5234, country: 'Ukraine', population: 2884000 },
  { name: 'Berlin', lat: 52.52, lng: 13.405, country: 'Germany', population: 3748148 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', population: 12442373 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479, country: 'Pakistan', population: 1095000 },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', population: 460613 },
]

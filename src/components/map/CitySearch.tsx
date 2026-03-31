import { CITIES, type City } from '../../data/cities'

interface CitySearchProps {
  onSelect: (city: City) => void
  value?: string
}

export function CitySearch({ onSelect, value }: CitySearchProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-text-secondary font-medium">Location</label>
      <select
        value={value || ''}
        onChange={(e) => {
          const city = CITIES.find(c => c.name === e.target.value)
          if (city) onSelect(city)
        }}
        className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blast appearance-none cursor-pointer"
      >
        <option value="">Select a location...</option>
        {CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}{city.population ? ` (pop. ${(city.population / 1e6).toFixed(1)}M)` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

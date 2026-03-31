import { CITIES, type City } from '../../data/cities'

interface CitySearchProps {
  onSelect: (city: City) => void
  value?: string
  placeholder?: string
  hideLabel?: boolean
  large?: boolean
}

export function CitySearch({ onSelect, value, placeholder, hideLabel, large }: CitySearchProps) {
  return (
    <div className="space-y-1.5">
      {!hideLabel && (
        <label className="text-sm text-text-secondary font-medium">Location</label>
      )}
      <select
        value={value || ''}
        onChange={(e) => {
          const city = CITIES.find(c => c.name === e.target.value)
          if (city) onSelect(city)
        }}
        className={`w-full bg-bg-card border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 appearance-none cursor-pointer transition-all ${
          large
            ? 'px-5 py-4 text-base font-medium border-white/10 bg-white/5 hover:border-white/20'
            : 'px-3 py-2 text-sm focus:ring-1 focus:ring-blast'
        }`}
      >
        <option value="">{placeholder || 'Select a location...'}</option>
        {CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}{city.population ? ` (pop. ${(city.population / 1e6).toFixed(1)}M)` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

import React from 'react'
import { Model } from './types'

interface Props {
  busy: boolean
  models: Model[]
  selected: string
  onSelect: (urn: string) => void
}

const ModelSelector: React.FC<Props> = ({ busy, models, selected, onSelect }) => {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const urn = e.target.value
    onSelect(urn)
    if (urn) {
      try {
        await fetch(`/api/models/${urn}/metadata/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        })
      } catch (err) {
        console.error('Failed to fetch metadata log for URN:', urn, err)
      }
    }
  }

  return (
    <select
      className="border rounded p-1 text-foreground"
      disabled={busy}
      value={selected}
      onChange={handleChange}
    >
      <option value="">Select model</option>
      {models.map(m => (
        <option key={m.urn} value={m.urn}>
          {m.name}
        </option>
      ))}
    </select>
  )
}

export default ModelSelector
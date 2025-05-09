import React from 'react'
import { Model } from './types'

interface Props {
  busy: boolean
  models: Model[]
  selected: string
  onSelect: (urn: string) => void
}

const ModelSelector: React.FC<Props> = ({ busy, models, selected, onSelect }) => (
  <select
    className="border rounded p-1 text-foreground"
    disabled={busy}
    value={selected}
    onChange={e => onSelect(e.target.value)}
  >
    <option value="">Select model</option>
    {models.map(m => <option key={m.urn} value={m.urn}>{m.name}</option>)}
  </select>
)

export default ModelSelector
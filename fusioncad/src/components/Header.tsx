import React from 'react'
import ModelSelector from './ModelSelector'
import UploadButton from './UploadButton'

interface HeaderProps {
  busy: boolean
  models: Model[]
  selected: string
  onSelect: (urn: string) => void
  onUpload: (file: File) => void
}

export interface Model {
  name: string
  urn: string
}

const Header: React.FC<HeaderProps> = ({ busy, models, selected, onSelect, onUpload }) => (
    <div className="sticky top-0 z-10 flex items-center p-2 bg-gray-100">
    <img
      className="h-8 mr-2"
      src="https://cdn.autodesk.io/logo/black/stacked.png"
      alt="APS"
    />
    <span className="flex-1 text-lg font-semibold text-foreground">Simple Viewer</span>

    <ModelSelector
      busy={busy}
      models={models}
      selected={selected}
      onSelect={onSelect}
    />

    <UploadButton busy={busy} onUpload={onUpload} />
  </div>
)

export default Header
import React from 'react'
import ModelSelector from './ModelSelector'
import UploadButton from './UploadButton'
import { Model } from './types'
interface HeaderProps {
  busy: boolean
  models: Model[]
  selected: string
  onSelect: (urn: string) => void
  onUpload: (file: File) => void
}

const Header: React.FC<HeaderProps> = ({ busy, models, selected, onSelect, onUpload }) => (
  <div className="sticky top-0 z-20 flex items-center bg-gray-100 p-2 space-x-2">
    <img className="h-8" src="https://cdn.autodesk.io/logo/black/stacked.png" alt="APS" />
    <span className="flex-1 text-lg font-bold text-foreground">Simple Viewer</span>
    <ModelSelector busy={busy} models={models} selected={selected} onSelect={onSelect} />
    <UploadButton busy={busy} onUpload={onUpload} />
  </div>
)

export default Header
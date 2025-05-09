import React, { ChangeEvent } from 'react'

interface Props {
  busy: boolean
  onUpload: (file: File) => void
}

const UploadButton: React.FC<Props> = ({ busy, onUpload }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(file)
    e.target.value = ''
  }
  return (
    <label className="cursor-pointer">
      <div className="p-1 bg-blue-500 text-white rounded">
        {busy ? 'Please wait...' : 'Upload'}
      </div>
      <input type="file" onChange={handleChange} className="hidden" />
    </label>
  )
}

export default UploadButton
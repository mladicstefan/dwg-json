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
      <button className="bg-blue-600 text-white px-3 py-1 rounded">
        {busy ? 'Please wait...' : 'Upload'}
      </button>
      <input type="file" className="hidden" onChange={handleChange} />
    </label>
  )
}

export default UploadButton
import React from 'react'

interface Props { message: string }

const StatusOverlay: React.FC<Props> = ({ message }) => (
  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded text-foreground" dangerouslySetInnerHTML={{ __html: message }} />
  </div>
)

export default StatusOverlay
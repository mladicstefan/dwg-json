'use client'

import { useEffect, useState,useRef } from 'react'
import Script from 'next/script'
import Header, {Model} from '@/components/Header'
import StatusOverlay from '@/components/StatusOverlay'
import Viewer from '@/components/Viewer'
import { TokenResponse } from '@/components/types'

export default function HomePage() {
  const [models, setModels] = useState<Model[]>([])
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const viewerInstance = useRef<any>(null)

  useEffect(() => {
    fetch('/api/models')
      .then(r => r.json())
      .then(setModels)
      .catch(() => alert('Could not list models'))
  }, [])

  useEffect(() => {
    if (!viewerInstance.current || !selected) return
    setStatusMessage('Checking model status...')
    const check = async () => {
      const res = await fetch(`/api/models/${selected}/status`)
      const data = await res.json()
      if (data.status === 'inprogress') {
        setStatusMessage(`Translating (${data.progress})...`)
        setTimeout(check, 5000)
      } else if (data.status === 'failed') {
        setStatusMessage('Translation failed; see console.')
        console.error(data.messages)
      } else {
        setStatusMessage(null)
        window.Autodesk.Viewing.Document.load(
          'urn:' + selected,
          (doc: any) => viewerInstance.current.loadDocumentNode(
            doc,
            doc.getRoot().getDefaultGeometry()
          ),
          (code: any, msg: string) => console.error(code, msg)
        )
      }
    }
    check()
  }, [selected])

  const getToken = () => fetch('/api/auth/token').then(r => r.json() as Promise<TokenResponse>)

  const handleUpload = async (file: File) => {
    const data = new FormData()
    data.append('model-file', file)
    if (file.name.endsWith('.zip')) {
      const entry = prompt('Entry file in zip?')
      if (entry) data.append('model-zip-entrypoint', entry)
    }
    setBusy(true)
    setStatusMessage(`Uploading ${file.name}...`)
    try {
      const res = await fetch('/api/models', { method: 'POST', body: data })
      const m: Model = await res.json()
      setSelected(m.urn)
      const list: Model[] = await fetch('/api/models').then(r => r.json())
      setModels(list)
    } catch {
      alert('Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col h-screen relative">
      <Header busy={busy} models={models} selected={selected} onSelect={setSelected} onUpload={handleUpload} />
      {statusMessage && <StatusOverlay message={statusMessage} />}
      <Viewer getToken={getToken} onViewerReady={v => (viewerInstance.current = v)} />
      <Script
        src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
        strategy="beforeInteractive"
      />
    </div>
  )
}
'use client'

import Header from '@/components/Header'
import StatusOverlay from '@/components/StatusOverlay'
import React, { useEffect, useState, useRef, ChangeEvent } from 'react'
import { Model } from '@/components/types'

declare global { interface Window { Autodesk: any } }

export default function HomePage() {
  const [models, setModels] = useState<Model[]>([])
  const [selected, setSelected] = useState<string>('')
  const [busy, setBusy] = useState<boolean>(false)
  const [message, setMessage] = useState<string | null>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const viewerInstance = useRef<any>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js'
    script.onload = () => {
      if (!viewerRef.current) return
      const getAccessToken = (cb: (token: string, expires: number) => void) => {
        fetch('/api/auth/token')
          .then(r => r.json())
          .then((d: { access_token: string; expires_in: number }) => cb(d.access_token, d.expires_in))
          .catch(console.error)
      }
      window.Autodesk.Viewing.Initializer(
        { env: 'AutodeskProduction', getAccessToken },
        () => {
          const v = new window.Autodesk.Viewing.GuiViewer3D(viewerRef.current!, {})
          v.start()
          viewerInstance.current = v
        }
      )
    }
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    fetch('/api/models')
      .then(r => r.json())
      .then(setModels)
      .catch(console.error)
  }, [])

  // Handle uploads
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const form = new FormData()
    form.append('model-file', file)
    if (file.name.endsWith('.zip')) {
      const entry = prompt('Main file in ZIP?')!
      form.append('model-zip-entrypoint', entry)
    }
    setBusy(true)
    setMessage(`Uploading ${file.name}...`)
    await fetch('/api/models', { method: 'POST', body: form })
    const list = await fetch('/api/models').then(r => r.json())
    setModels(list)
    setBusy(false)
    setSelected(file.name)
  }

  // Poll translation status and load model
  useEffect(() => {
    let timer: number
    const check = async () => {
      if (!viewerInstance.current || !selected) return
      setMessage('Checking translation...')
      const res = await fetch(`/api/models/${selected}/status`)
      const st = await res.json()
      if (st.status === 'inprogress') {
        setMessage(`Translating (${st.progress})...`)
        timer = window.setTimeout(check, 5000)
      } else if (st.status === 'failed') {
        setMessage('Translation failed')
      } else {
        setMessage(null)
        viewerInstance.current.setLightPreset(0)
        window.Autodesk.Viewing.Document.load(
          'urn:' + selected,
          (doc: any) =>
            viewerInstance.current.loadDocumentNode(
              doc,
              doc.getRoot().getDefaultGeometry()
            ),
          (_code: number, msg: string) => console.error(msg)
        )
      }
    }
    check()
    return () => clearTimeout(timer)
  }, [selected])

  return (
    <div className="flex flex-col h-screen">
      <Header
        busy={busy}
        models={models}
        selected={selected}
        onSelect={setSelected}
        onUpload={handleUpload as any}
      />
      {message && <StatusOverlay message={message} />}
      <div ref={viewerRef} className="flex-1 relative" />
    </div>
  )
}

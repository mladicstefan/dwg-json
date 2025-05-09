'use client'
import React, { useEffect, useRef } from 'react'
import {TokenResponse} from './types'

declare global {
  interface Window { Autodesk: any }
}

export interface ViewerProps {
  getToken: () => Promise<TokenResponse>
  onViewerReady: (viewer: any) => void
}

const Viewer: React.FC<ViewerProps> = ({ getToken, onViewerReady }) => {
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.Autodesk && viewerRef.current) {
      window.Autodesk.Viewing.Initializer(
        {
          env: 'AutodeskProduction',
          getAccessToken: (cb: (t: string, e: number) => void) => {
            getToken()
              .then(({ access_token, expires_in }) => cb(access_token, expires_in))
              .catch(() => alert('Failed to get access token'))
          },
        },
        () => {
          const config = { extensions: ['Autodesk.DocumentBrowser'] }
          const v = new window.Autodesk.Viewing.GuiViewer3D(viewerRef.current!, config)
          v.start()
          v.setTheme('light-theme')
          onViewerReady(v)
        }
      )
    }
  }, [getToken, onViewerReady])

  return <div ref={viewerRef} className="flex-1" />
}

export default Viewer
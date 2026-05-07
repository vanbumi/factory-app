'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, QrCode } from 'lucide-react'

interface QRGeneratorProps {
  value: string
  title?: string
  description?: string
  size?: number
  showDownload?: boolean
  filename?: string
}

export function QRGenerator({
  value,
  title,
  description,
  size = 200,
  showDownload = true,
  filename = 'qrcode',
}: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
    }
  }, [value, size])

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvasRef.current.toDataURL('image/png')
      link.click()
    }
  }

  if (!value) {
    return (
      <Card className="w-fit">
        <CardContent className="p-6">
          <div 
            className="flex items-center justify-center bg-muted rounded-lg"
            style={{ width: size, height: size }}
          >
            <QrCode className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-fit">
      {(title || description) && (
        <CardHeader className="pb-2">
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        <div className="bg-white p-2 rounded-lg inline-block">
          <canvas ref={canvasRef} />
        </div>
        
        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
          {value}
        </p>

        {showDownload && (
          <Button variant="outline" size="sm" onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download QR
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

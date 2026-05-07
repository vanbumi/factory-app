'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, CameraOff, RefreshCw } from 'lucide-react'

interface QRScannerProps {
  onScan: (decodedText: string) => void
  onError?: (error: string) => void
  title?: string
  description?: string
}

export function QRScanner({ 
  onScan, 
  onError, 
  title = 'Scan QR Code',
  description = 'Arahkan kamera ke QR code untuk memindai'
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [lastScanned, setLastScanned] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop()
      } catch {
        // Ignore stop errors
      }
    }
    setIsScanning(false)
  }, [])

  const startScanner = useCallback(async () => {
    if (!containerRef.current) return

    try {
      // Create new scanner instance
      scannerRef.current = new Html5Qrcode('qr-reader')

      const qrCodeSuccessCallback = (decodedText: string, _result: Html5QrcodeResult) => {
        // Prevent duplicate scans
        if (decodedText !== lastScanned) {
          setLastScanned(decodedText)
          onScan(decodedText)
        }
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        () => {} // Ignore QR scan errors
      )

      setIsScanning(true)
      setHasPermission(true)
    } catch (err) {
      console.error('QR Scanner error:', err)
      setHasPermission(false)
      onError?.(err instanceof Error ? err.message : 'Gagal mengakses kamera')
    }
  }, [lastScanned, onScan, onError])

  const toggleScanner = async () => {
    if (isScanning) {
      await stopScanner()
    } else {
      await startScanner()
    }
  }

  const resetLastScanned = () => {
    setLastScanned(null)
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [stopScanner])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          ref={containerRef}
          className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden"
        >
          <div id="qr-reader" className="w-full h-full" />
          
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Kamera tidak aktif</p>
              </div>
            </div>
          )}
        </div>

        {hasPermission === false && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.
          </div>
        )}

        {lastScanned && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Hasil Scan Terakhir:</p>
                <p className="text-sm font-mono truncate">{lastScanned}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={resetLastScanned}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={toggleScanner} 
            className="flex-1"
            variant={isScanning ? 'destructive' : 'default'}
          >
            {isScanning ? (
              <>
                <CameraOff className="mr-2 h-4 w-4" />
                Matikan Kamera
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" />
                Mulai Scan
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

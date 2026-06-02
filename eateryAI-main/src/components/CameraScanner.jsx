import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { saveScannedScan } from '../utils/scannedMenus'

async function scanMenuImage(imageDataUrl, signal) {
  const response = await fetch('/api/scan-menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageDataUrl }),
    signal,
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'Unable to scan this menu right now.')
  }

  return payload
}

export default function CameraScanner({ knownRestaurants, onClose, onPhotoSaved, theme }) {
  const isLight = theme === 'light'
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const scanAbortRef = useRef(null)

  const [mode, setMode] = useState('choose')
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [scanError, setScanError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [isScanning, setIsScanning] = useState(false)
  const [savedEntry, setSavedEntry] = useState(null)

  async function startCamera(facing = facingMode) {
    setCameraError(null)
    setScanError(null)
    setSavedEntry(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setMode('camera')
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera permission was denied. Please allow camera access in your browser settings.')
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.')
      } else {
        setCameraError('Could not access the camera. Try uploading a photo instead.')
      }
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  function cancelScan() {
    if (scanAbortRef.current) {
      scanAbortRef.current.abort()
      scanAbortRef.current = null
    }
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    setCapturedImage(canvas.toDataURL('image/jpeg', 0.85))
    setScanError(null)
    setSavedEntry(null)
    stopCamera()
    setMode('preview')
  }

  function flipCamera() {
    stopCamera()
    const nextFacingMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextFacingMode)
    startCamera(nextFacingMode)
  }

  function handleFileUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = loadEvent => {
      const imageDataUrl = loadEvent.target?.result || null
      setCapturedImage(imageDataUrl)
      setCameraError(null)
      setScanError(null)
      setSavedEntry(null)
      setMode('preview')

      if (imageDataUrl) {
        void handleScanAndSave(imageDataUrl)
      }
    }
    reader.readAsDataURL(file)

    // Allow re-uploading the same file after a failed scan.
    event.target.value = ''
  }

  function finalizeSave(imageDataUrl, extractedText) {
    const { photoEntry } = saveScannedScan({
      imageDataUrl,
      extractedText,
      knownRestaurants,
    })

    setSavedEntry(photoEntry)
    onPhotoSaved?.()
    setMode('saved')
    return photoEntry
  }

  async function handleScanAndSave(imageOverride) {
    const imageDataUrl = imageOverride || capturedImage
    if (!imageDataUrl || isScanning) return

    cancelScan()
    setScanError(null)
    setIsScanning(true)

    const controller = new AbortController()
    scanAbortRef.current = controller

    try {
      const result = await scanMenuImage(imageDataUrl, controller.signal)
      const extractedText = result.text?.trim()

      if (!extractedText) {
        throw new Error('No readable text was detected. Try a clearer or closer photo.')
      }

      finalizeSave(imageDataUrl, extractedText)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setScanError(error.message || 'Unable to scan this menu right now.')
      }
    } finally {
      if (scanAbortRef.current === controller) {
        scanAbortRef.current = null
      }
      setIsScanning(false)
    }
  }

  function reset() {
    cancelScan()
    setCapturedImage(null)
    setSavedEntry(null)
    setCameraError(null)
    setScanError(null)
    setIsScanning(false)
    setMode('choose')
  }

  function handleClose() {
    cancelScan()
    stopCamera()
    onClose()
  }

  useEffect(() => () => {
    cancelScan()
    stopCamera()
  }, [])

  const savedLines = savedEntry?.extractedText
    ? savedEntry.extractedText.split('\n').filter(Boolean)
    : []

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <motion.div
        className={`relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl max-h-[90vh] ${
          isLight ? 'bg-white' : 'border border-white/10 bg-[#111317]'
        }`}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <div className={`flex flex-shrink-0 items-center justify-between border-b px-5 py-4 ${
          isLight ? 'border-gray-100' : 'border-white/10'
        }`}>
          <div className="flex items-center gap-2">
            <svg className={`w-5 h-5 ${isLight ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <h2 className={`font-display text-lg font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>Scan a Menu</h2>
          </div>
          <button
            onClick={handleClose}
            className={`rounded-full p-1.5 transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/8'}`}
          >
            <svg className={`w-5 h-5 ${isLight ? 'text-gray-500' : 'text-white/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          {mode === 'choose' && (
            <div className="space-y-3">
              <p className={`text-sm ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                Take a photo of a menu or upload one to save a scanned menu.
              </p>

              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                  {cameraError}
                </div>
              )}

              <button
                onClick={() => startCamera()}
                className={`group flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                  isLight
                    ? 'border-black/10 hover:border-black hover:bg-black/5'
                    : 'border-white/10 hover:border-white/30 hover:bg-white/8'
                }`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  isLight ? 'bg-black/5 group-hover:bg-black/10' : 'bg-white/8 group-hover:bg-white/12'
                }`}>
                  <svg className={`w-5 h-5 ${isLight ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>Use Camera</p>
                  <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/55'}`}>Point your camera at a menu</p>
                </div>
              </button>

              <label className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                isLight
                  ? 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/6'
              }`}>
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  isLight ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-white/8 group-hover:bg-white/12'
                }`}>
                  <svg className={`w-5 h-5 ${isLight ? 'text-gray-600' : 'text-white/70'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>Upload a Photo</p>
                  <p className={`text-xs ${isLight ? 'text-gray-500' : 'text-white/55'}`}>Choose an image from your device</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-4/5 h-4/5 border-2 border-white/60 rounded-xl" />
                </div>
                <button
                  onClick={flipCamera}
                  className="absolute top-3 right-3 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <p className={`text-center text-xs ${isLight ? 'text-gray-400' : 'text-white/45'}`}>
                Position the menu within the frame.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    stopCamera()
                    setMode('choose')
                  }}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                    isLight
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      : 'border-white/10 text-white/70 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    isLight ? 'bg-black text-white hover:bg-[#1c1c1c]' : 'bg-white text-black hover:bg-[#f1f1f1]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3.5" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
                  </svg>
                  Capture
                </button>
              </div>
            </div>
          )}

          {mode === 'preview' && capturedImage && (
            <div className="space-y-4">
              <div className={`overflow-hidden rounded-xl border ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
                <img src={capturedImage} alt="Captured menu" className="w-full object-contain max-h-64" />
              </div>

              <div className="space-y-3">
                <p className={`text-center text-sm ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                  Scan this menu to extract and save its items.
                </p>

                {isScanning && (
                  <div className={`flex items-center gap-3 rounded-xl border p-3 text-sm ${
                    isLight
                      ? 'border-black/10 bg-black/5 text-gray-900'
                      : 'border-white/10 bg-white/8 text-white'
                  }`}>
                    <div className={`h-4 w-4 animate-spin rounded-full border-2 ${
                      isLight ? 'border-black/20 border-t-black' : 'border-white/25 border-t-white'
                    }`} />
                    Scanning this menu. This can take a few seconds.
                  </div>
                )}

                {scanError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                    {scanError}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={reset}
                  className={`rounded-xl border py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                    isLight
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      : 'border-white/10 text-white/70 hover:bg-white/8 hover:text-white'
                  }`}
                  disabled={isScanning}
                >
                  Retake
                </button>
                <button
                  onClick={handleScanAndSave}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                    isLight ? 'bg-black text-white hover:bg-[#1c1c1c]' : 'bg-white text-black hover:bg-[#f1f1f1]'
                  }`}
                  disabled={isScanning}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  {isScanning ? 'Scanning...' : 'Scan & Save'}
                </button>
              </div>
            </div>
          )}

          {mode === 'saved' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${
                isLight ? 'bg-black/8' : 'bg-white/10'
              }`}>
                <svg className={`w-7 h-7 ${isLight ? 'text-black' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <div>
                <p className={`font-semibold ${isLight ? 'text-gray-800' : 'text-white'}`}>Menu scanned and saved!</p>
                <p className={`mt-1 text-sm ${isLight ? 'text-gray-400' : 'text-white/55'}`}>
                  Saved {savedEntry?.parsedItemCount || 0} scanned items
                  {savedEntry?.restaurantName ? ` for ${savedEntry.restaurantName}` : ''}.
                </p>
              </div>
              <div className={`w-full rounded-xl border p-3 text-left ${
                isLight ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/6'
              }`}>
                <p className={`mb-2 text-xs font-semibold ${isLight ? 'text-gray-700' : 'text-white/80'}`}>OCR Preview</p>
                <pre className={`whitespace-pre-wrap font-sans text-xs leading-relaxed ${isLight ? 'text-gray-600' : 'text-white/60'}`}>
                  {savedLines.slice(0, 6).join('\n')}
                  {savedLines.length > 6 ? '\n...' : ''}
                </pre>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={reset}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                    isLight
                      ? 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      : 'border-white/10 text-white/70 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  Add Another
                </button>
                <button
                  onClick={handleClose}
                  className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    isLight ? 'bg-black text-white hover:bg-[#1c1c1c]' : 'bg-white text-black hover:bg-[#f1f1f1]'
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

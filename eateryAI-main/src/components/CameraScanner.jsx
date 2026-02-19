import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const STORAGE_KEY = 'eateryai_scanned_photos'

function savePhotoToStorage(imageDataUrl) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const entry = {
      id: Date.now(),
      image: imageDataUrl,
      extractedText: null,
      scannedAt: new Date().toISOString(),
    }
    existing.unshift(entry)
    const trimmed = existing.slice(0, 20)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    return entry
  } catch (e) {
    console.error('Failed to save photo:', e)
    return null
  }
}

export default function CameraScanner({ onClose, onPhotoSaved }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const [mode, setMode] = useState('choose') // 'choose' | 'camera' | 'preview' | 'saved'
  const [capturedImage, setCapturedImage] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment')
  const [saved, setSaved] = useState(false)

  async function startCamera(facing = facingMode) {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: facing } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setMode('camera')
    } catch (err) {
      if (err.name === 'NotAllowedError') setCameraError('Camera permission was denied. Please allow camera access in your browser settings.')
      else if (err.name === 'NotFoundError') setCameraError('No camera found on this device.')
      else setCameraError('Could not access the camera. Try uploading a photo instead.')
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImage(dataUrl)
    stopCamera()
    setMode('preview')
  }

  function flipCamera() {
    stopCamera()
    const next = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(next)
    startCamera(next)
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setCapturedImage(ev.target.result); setMode('preview') }
    reader.readAsDataURL(file)
  }

  function handleSave() {
    savePhotoToStorage(capturedImage)
    setSaved(true)
    onPhotoSaved?.()
    setMode('saved')
  }

  function reset() {
    setCapturedImage(null)
    setSaved(false)
    setMode('choose')
  }

  function handleClose() { stopCamera(); onClose() }

  useEffect(() => () => stopCamera(), [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <h2 className="font-display font-bold text-gray-900 text-lg">Scan a Menu</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">

          {/* CHOOSE */}
          {mode === 'choose' && (
            <div className="space-y-3">
              {/* Coming Soon banner */}
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3 mb-4">
                <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-orange-800">AI Scanning — Coming Soon</p>
                  <p className="text-xs text-orange-700 mt-0.5">
                    Automatic menu reading with AI is on the way. For now, you can still capture and save photos of menus to your gallery.
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500">Take a photo of a menu or upload one to save it to your gallery.</p>

              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{cameraError}</div>
              )}

              <button onClick={() => startCamera()} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-orange-100 group-hover:bg-orange-200 flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Use Camera</p>
                  <p className="text-xs text-gray-500">Point your camera at a menu</p>
                </div>
              </button>

              <label className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Upload a Photo</p>
                  <p className="text-xs text-gray-500">Choose an image from your device</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          )}

          {/* CAMERA */}
          {mode === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-4/5 h-4/5 border-2 border-white/60 rounded-xl" />
                </div>
                <button onClick={flipCamera} className="absolute top-3 right-3 p-2 bg-black/40 rounded-full hover:bg-black/60 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <p className="text-xs text-gray-400 text-center">Position the menu within the frame</p>
              <div className="flex gap-3">
                <button onClick={() => { stopCamera(); setMode('choose') }} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={capturePhoto} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3.5" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
                  </svg>
                  Capture
                </button>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {mode === 'preview' && capturedImage && (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <img src={capturedImage} alt="Captured menu" className="w-full object-contain max-h-64" />
              </div>
              <p className="text-sm text-gray-500 text-center">Save this photo to your gallery?</p>
              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Retake</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  Save to Gallery
                </button>
              </div>
            </div>
          )}

          {/* SAVED CONFIRMATION */}
          {mode === 'saved' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Photo saved!</p>
                <p className="text-sm text-gray-400 mt-1">Find it anytime in your Saved Scans gallery.</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={reset} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">Add Another</button>
                <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">Done</button>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div>
  )
}
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'eateryai_scanned_photos'

function loadPhotos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
} 

function deletePhoto(id) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const updated = existing.filter(p => p.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return []
  }
}

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export default function PhotoGallery({ onClose }) {
  const [photos, setPhotos] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setPhotos(loadPhotos())
  }, [])

  function handleDelete(id) {
    const updated = deletePhoto(id)
    setPhotos(updated)
    if (selected?.id === id) setSelected(null)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
        initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            <h2 className="font-display font-bold text-gray-900 text-lg">Saved Scans</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{photos.length}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Gallery grid */}
          <div className={`overflow-y-auto p-4 ${selected ? 'w-1/2 border-r border-gray-100' : 'w-full'}`}>
            {photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <p className="text-gray-400 text-sm">No saved scans yet</p>
                <p className="text-gray-300 text-xs mt-1">Scan or upload a menu to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {photos.map(photo => (
                  <div
                    key={photo.id}
                    onClick={() => setSelected(selected?.id === photo.id ? null : photo)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                      selected?.id === photo.id ? 'border-orange-400 shadow-md' : 'border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <img src={photo.image} alt="Scanned menu" className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="p-2 bg-white">
                      <p className="text-xs text-gray-500 truncate">{formatDate(photo.scannedAt)}</p>
                      {photo.extractedText
                        ? <span className="text-xs text-green-600 font-medium">✓ AI scanned</span>
                        : <span className="text-xs text-gray-400">Photo only</span>
                      }
                    </div>
                    {/* Delete button */}
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(photo.id) }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div
                className="w-1/2 overflow-y-auto p-4 flex flex-col gap-3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <img src={selected.image} alt="Scanned menu" className="w-full rounded-xl border border-gray-200 object-contain max-h-48" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">{formatDate(selected.scannedAt)}</p>
                  {selected.extractedText ? (
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        AI Extracted Items
                      </p>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{selected.extractedText}</pre>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">No AI scan for this photo. Re-scan it using the Scan Menu button.</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="mt-auto w-full py-2 rounded-xl border border-red-200 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
                >
                  Delete this scan
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

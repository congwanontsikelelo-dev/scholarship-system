// Minimal IndexedDB helper for storing document blobs
export const DB_NAME = 'scholarship-docs'
export const DB_VERSION = 1
export const STORE_NAME = 'documents'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveDocumentToIndexedDB(id: number | string, fileName: string, dataUrl: string | null) {
  if (!dataUrl) return false
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    // convert dataUrl to blob
    const blob = dataURLToBlob(dataUrl)
    store.put({ id, fileName, blob, createdAt: new Date().toISOString() })
    return await new Promise<boolean>((resolve, reject) => {
      tx.oncomplete = () => { db.close(); resolve(true) }
      tx.onerror = () => { db.close(); reject(tx.error) }
    })
  } catch (e) {
    console.error('saveDocumentToIndexedDB error', e)
    return false
  }
}

export async function getDocumentUrlFromIndexedDB(id: number | string): Promise<string | null> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(id)
    return await new Promise((resolve, reject) => {
      req.onsuccess = () => {
        const rec = req.result
        if (rec && rec.blob) {
          const url = URL.createObjectURL(rec.blob)
          resolve(url)
        } else resolve(null)
        db.close()
      }
      req.onerror = () => { db.close(); reject(req.error) }
    })
  } catch (e) {
    console.error('getDocumentUrlFromIndexedDB error', e)
    return null
  }
}

function dataURLToBlob(dataurl: string) {
  const arr = dataurl.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : ''
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

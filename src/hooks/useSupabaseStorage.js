import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'

const BUCKET = 'photobooth-prints'

export function useSupabaseStorage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)

  // Convert base64 data URL to Blob
  const dataUrlToBlob = (dataUrl) => {
    const [header, data] = dataUrl.split(',')
    const mime = header.match(/:(.*?);/)[1]
    const binary = atob(data)
    const array = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i)
    }
    return new Blob([array], { type: mime })
  }

  const uploadPrint = useCallback(async (dataUrl, userId, metadata = {}) => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const blob = dataUrlToBlob(dataUrl)
      const timestamp = Date.now()
      const fileName = `${userId || 'anon'}/${timestamp}.jpg`

      setProgress(30)

      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        })

      if (uploadError) throw uploadError

      setProgress(70)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName)

      // Save record to database
      const { error: dbError } = await supabase
        .from('prints')
        .insert({
          user_id: userId || null,
          storage_path: fileName,
          public_url: publicUrl,
          template: metadata.template || 'strip-2',
          layout: metadata.layout || 'A',
          color: metadata.color || 'white',
          filter: metadata.filter || 'none',
          created_at: new Date().toISOString()
        })

      if (dbError) console.warn('[lumi] DB insert warning:', dbError.message)

      setProgress(100)
      setUploading(false)

      return { publicUrl, path: fileName }
    } catch (err) {
      console.error('[lumi] Upload error:', err)
      setError(err.message)
      setUploading(false)
      return null
    }
  }, [])

  const fetchUserPrints = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('prints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('[lumi] Fetch prints error:', err)
      return []
    }
  }, [])

  const deletePrint = useCallback(async (printId, storagePath) => {
    try {
      await supabase.storage.from(BUCKET).remove([storagePath])
      await supabase.from('prints').delete().eq('id', printId)
      return true
    } catch (err) {
      console.error('[lumi] Delete error:', err)
      return false
    }
  }, [])

  return { uploading, progress, error, uploadPrint, fetchUserPrints, deletePrint }
}

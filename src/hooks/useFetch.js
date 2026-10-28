import { useEffect, useState } from 'react'

// Hook personalizado: pide una URL y devuelve { data, loading, error }. Cancela la petición al desmontar
// o al cambiar la URL. "loading" se deriva de la URL ya resuelta, así no hace falta actualizar estado
// de forma síncrona dentro del efecto.
export function useFetch(url) {
  const [resultado, setResultado] = useState({ url: null, data: null, error: null })

  useEffect(() => {
    const controladorAbortar = new AbortController()

    fetch(url, { signal: controladorAbortar.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar (${res.status})`)
        return res.json()
      })
      .then((datos) => setResultado({ url, data: datos, error: null }))
      .catch((err) => {
        if (err.name !== 'AbortError') setResultado({ url, data: null, error: err.message })
      })

    return () => controladorAbortar.abort()
  }, [url])

  const loading = resultado.url !== url
  return { data: loading ? null : resultado.data, loading, error: loading ? null : resultado.error }
}

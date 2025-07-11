'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corrige o ícone padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Tipagem do problema
type Issue = {
  id: number
  problem_type: string
  description: string
  location: string
}

// Extensão para incluir as coordenadas
type IssueWithCoords = Issue & {
  lat: number
  lon: number
}

type Report = {
  generated_at: string
  summary_text: string
}

export default function LastReport() {
  const [report, setReport] = useState<Report | null>(null)
  const [issues, setIssues] = useState<IssueWithCoords[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchReportAndIssues = async () => {
      setLoading(true)
      setError(null)

      // Busca o último relatório
      const { data: reportData, error: reportError } = await supabase
        .from('public_reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(1)

      if (reportError) {
        setError('Erro ao buscar o relatório. Tente novamente.')
      } else if (reportData && reportData.length > 0) {
        setReport({
          generated_at: reportData[0].generated_at,
          summary_text: reportData[0].summary_text
        })
      } else {
        setError('Nenhum relatório encontrado.')
      }

      // Busca os problemas
      const { data: issuesData, error: issuesError } = await supabase
        .from('public_issues')
        .select('*')

      if (issuesError) {
        setError('Erro ao buscar os problemas.')
      } else if (issuesData) {
        setIssues(issuesData.map(issue => ({
          ...issue,
          lat: -26.3 + Math.random() * 0.1,
          lon: -48.85 + Math.random() * 0.1,
        })))
      }

      setLoading(false)
    }

    fetchReportAndIssues()
  }, [])

  return (
    <main className="form-container">
      <h1 className="form-title">Relatório dos Problemas Públicos</h1>
      <p className="form-description">
        Aqui está o relatório mais recente gerado automaticamente com base nos últimos registros.
      </p>

      {loading && <p className="form-description">Carregando dados...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && report && (
        <>
          <p className="form-label">
            <strong>Gerado em:</strong> {new Date(report.generated_at).toLocaleString()}
          </p>
          <pre className="form-input" style={{ whiteSpace: 'pre-wrap' }}>
            {report.summary_text}
          </pre>

          <div style={{ height: '500px', width: '100%', marginTop: '2rem', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer center={[-26.3, -48.85]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {issues.map(issue => (
                <Marker key={issue.id} position={[issue.lat, issue.lon]}>
                  <Popup>
                    <strong>{issue.problem_type}</strong><br />
                    {issue.description}<br />
                    <small>{issue.location}</small>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </>
      )}

      <Button
        onClick={() => router.push('/')}
        className="form-button"
        style={{ marginTop: '1rem' }}
      >
        Voltar para o Formulário
      </Button>
    </main>
  )
}

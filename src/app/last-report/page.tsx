'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function LastReport() {
  const [report, setReport] = useState<{
    generated_at: string
    summary_text: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('public_reports')
        .select('*')
        .order('generated_at', { ascending: false })
        .limit(1)

      if (error) {
        setError('Erro ao buscar o relatório. Tente novamente.')
      } else if (data && data.length > 0) {
        setReport({
          generated_at: data[0].generated_at,
          summary_text: data[0].summary_text
        })
      } else {
        setError('Nenhum relatório encontrado.')
      }

      setLoading(false)
    }

    fetchReport()
  }, [])

  return (
    <main className="form-container">
      <h1 className="form-title">Relatório dos Problemas Públicos</h1>
      <p className="form-description">
        Aqui está o relatório mais recente gerado automaticamente com base nos últimos registros.
      </p>

      {loading && <p className="form-description">Carregando relatório...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && report && (
        <>
          <p className="form-label">
            <strong>Gerado em:</strong> {new Date(report.generated_at).toLocaleString()}
          </p>
          <pre className="form-input" style={{ whiteSpace: 'pre-wrap' }}>
            {report.summary_text}
          </pre>
        </>
      )}

      <Button
        onClick={() => router.push('/')}
        className="form-button"
      >
        Voltar para o Formulário
      </Button>
    </main>
  )
}

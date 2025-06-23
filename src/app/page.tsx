'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [formData, setFormData] = useState({
    problemType: '',
    description: '',
    location: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error } = await supabase.from('public_issues').insert([formData])

    if (error) {
      setError('Erro ao enviar o problema. Tente novamente.')
    } else {
      setSuccess(true)
      setFormData({
        problemType: '',
        description: '',
        location: '',
      })
    }
    setLoading(false)
  }

  return (
    <main className="form-container">
      <h1 className="form-title">Formulário de Reporte de Problema Público</h1>
      <p className="form-description">
        Por favor, preencha o formulário abaixo para nos informar sobre um problema público. Nossa equipe irá analisar e encaminhar aos órgãos responsáveis.
      </p>
      <form onSubmit={handleSubmit} className="form-body">
        <label className="form-label">
          Tipo de Problema *
          <select
            name="problemType"
            value={formData.problemType}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="">Selecione...</option>
            <option value="Buraco na rua">Buraco na rua</option>
            <option value="Falta de iluminação">Falta de iluminação</option>
            <option value="Falta de segurança">Falta de segurança</option>
            <option value="Outro">Outro</option>
          </select>
        </label>

        <label className="form-label">
          Descrição detalhada *
          <Textarea
            name="description"
            placeholder="Descreva o problema..."
            value={formData.description}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>

        <label className="form-label">
          Localização *
          <Input
            name="location"
            placeholder="Ex: Rua X, nº Y, Bairro Z"
            value={formData.location}
            onChange={handleChange}
            required
            className="form-input"
          />
        </label>

        <Button type="submit" disabled={loading} className="form-button">
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>

        {success && <p className="form-success">Problema enviado com sucesso!</p>}
        {error && <p className="form-error">{error}</p>}
      </form>
    </main>
  )
}

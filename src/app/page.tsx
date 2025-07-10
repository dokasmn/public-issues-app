'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [formData, setFormData] = useState({
    problem_type: '',
    description: '',
    location: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
        problem_type: '',
        description: '',
        location: '',
      })
    }
    setLoading(false)
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Gestão Pública</h1>
        <Link href="/last-report" className="navbar-link">
          Ver Relatórios
        </Link>
      </nav>

      {/* Formulário */}
      <main className="form-container">
        <h1 className="form-title">Formulário de Reporte de Problema Público</h1>
        <p className="form-description">
          Por favor, preencha o formulário abaixo para nos informar sobre um problema público. Nossa equipe irá analisar e encaminhar aos órgãos responsáveis.
        </p>
        <form onSubmit={handleSubmit} className="form-body">
          <label className="form-label">
            Tipo de Problema *
            <select
              name="problem_type"
              value={formData.problem_type}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Selecione...</option>
              <option value="Problemas na rua">Problemas na rua</option>
              <option value="Problemas de equipamento público">Problemas de equipamento público</option>
              <option value="Problemas de segurança">Problemas de segurança</option>
              <option value="Problemas ambientais">Problemas ambientais</option>
              <option value="Focos de dengue">Focos de dengue</option>
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
    </>
  )
}

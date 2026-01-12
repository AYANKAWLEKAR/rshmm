'use client'

import { useState, useEffect } from 'react'
import { Item } from '@/types/item'

interface ItemFormProps {
  onSubmit: (name: string, description: string) => void
  initialData?: Item | null
  onCancel?: () => void
}

export default function ItemForm({ onSubmit, initialData, onCancel }: ItemFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description || '')
    } else {
      setName('')
      setDescription('')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Name is required')
      return
    }
    onSubmit(name.trim(), description.trim())
    if (!initialData) {
      setName('')
      setDescription('')
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: '1rem' }}>
        {initialData ? 'Edit Item' : 'Create New Item'}
      </h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="name"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
          }}
        >
          Name *
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
          placeholder="Enter item name"
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="description"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '500',
          }}
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '0.5rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
          placeholder="Enter item description (optional)"
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          {initialData ? 'Update' : 'Create'}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

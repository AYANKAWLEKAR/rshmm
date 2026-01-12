'use client'

import { useState, useEffect } from 'react'
import ItemList from '@/components/ItemList'
import ItemForm from '@/components/ItemForm'
import { Item } from '@/types/item'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/api/items`)
      if (!response.ok) throw new Error('Failed to fetch items')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
      alert('Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (name: string, description: string) => {
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })
      if (!response.ok) throw new Error('Failed to create item')
      await fetchItems()
    } catch (error) {
      console.error('Error creating item:', error)
      alert('Failed to create item')
    }
  }

  const handleUpdate = async (id: number, name: string, description: string) => {
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })
      if (!response.ok) throw new Error('Failed to update item')
      await fetchItems()
      setEditingItem(null)
    } catch (error) {
      console.error('Error updating item:', error)
      alert('Failed to update item')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const response = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete item')
      await fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Failed to delete item')
    }
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>CRUD App</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <ItemForm
          onSubmit={editingItem ? (name, desc) => handleUpdate(editingItem.id, name, desc) : handleCreate}
          initialData={editingItem}
          onCancel={() => setEditingItem(null)}
        />
      </div>

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}

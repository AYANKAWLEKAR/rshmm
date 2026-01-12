import { Item } from '@/types/item'

interface ItemListProps {
  items: Item[]
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
}

export default function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return <p style={{ color: '#666' }}>No items yet. Create one above!</p>
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>
              {item.name}
            </h3>
            {item.description && (
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                {item.description}
              </p>
            )}
            <p style={{ fontSize: '0.875rem', color: '#999' }}>
              Created: {new Date(item.created_at).toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
            <button
              onClick={() => onEdit(item)}
              style={{
                padding: '0.5rem 1rem',
                background: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              style={{
                padding: '0.5rem 1rem',
                background: '#e00',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '0.875rem',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

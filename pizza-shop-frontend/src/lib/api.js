export async function getAllItems() {
  const res = await fetch('/api/items')
  return await res.json()
}

export async function createItem(item) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  return await res.json()
}


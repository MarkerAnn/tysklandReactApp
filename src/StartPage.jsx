import { useState, useEffect } from 'react'
import ItemForm from './ItemForm'
import ItemList from './ItemList'
import TotalSummary from './TotalSummary'

const StartPage = () => {
  const [items, setItems] = useState([])
  const [totalWeight, setTotalWeight] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items')) || []
    setItems(savedItems)
    calculateTotals(savedItems)
  }, [])

  const addItem = (newItem) => {
    if (!newItem.amount || !newItem.name || !newItem.price) {
      alert('Please fill out amount, name, and price.')
      return
    }
    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    localStorage.setItem('items', JSON.stringify(updatedItems))
    calculateTotals(updatedItems)
  }

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    localStorage.setItem('items', JSON.stringify(updatedItems))
    calculateTotals(updatedItems)
  }

  const updateItem = (index, newItem) => {
    const updatedItems = [...items]
    updatedItems[index] = newItem
    setItems(updatedItems)
    localStorage.setItem('items', JSON.stringify(updatedItems))
    calculateTotals(updatedItems)
  }

  const calculateTotals = (items) => {
    const totalWeight = items.reduce(
      (total, item) => total + item.amount * getItemWeight(item.type),
      0
    )
    const totalPrice = items.reduce(
      (total, item) => total + item.amount * parseFloat(item.price),
      0
    )
    setTotalWeight(totalWeight)
    setTotalPrice(totalPrice)
  }

  const getItemWeight = (type) => {
    const weights = {
      Flak: 8.5,
      'Flak 3-pack': 25.5,
      Champagneflaska: 1.8,
      'Flaska Liter': 1.7,
      'Flaska 750cl': 1.3,
      Box: 3.2,
    }
    return weights[type] || 0
  }

  return (
    <div className='container mx-auto p-4'>
      <ItemForm addItem={addItem} />
      <ItemList items={items} deleteItem={deleteItem} updateItem={updateItem} />
      <TotalSummary totalWeight={totalWeight} totalPrice={totalPrice} />
    </div>
  )
}

export default StartPage

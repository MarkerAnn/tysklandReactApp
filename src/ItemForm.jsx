import { useState } from 'react'
import PropType from 'prop-types'

const ItemForm = ({ addItem }) => {
  const [newItem, setNewItem] = useState({
    amount: 1,
    name: '',
    type: 'Flak',
    price: '',
    extra: '',
    store: 'Calles',
    online: false,
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNewItem({
      ...newItem,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addItem(newItem)
    setNewItem({
      amount: 1,
      name: '',
      type: 'Flak',
      price: '',
      extra: '',
      store: 'Calles',
      online: false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className='mb-6'>
      <h2 className='text-xl mb-4'>Add New Item</h2>
      {Object.entries(newItem).map(([key, value]) => {
        if (key === 'type' || key === 'store') {
          return (
            <div key={key} className='mb-4'>
              <label className='block mb-2'>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <select
                name={key}
                value={value}
                onChange={handleInputChange}
                className='border p-2 w-full'
              >
                {key === 'type'
                  ? [
                      'Flak',
                      'Flak 3-pack',
                      'Champagneflaska',
                      'Flaska Liter',
                      'Flaska 750cl',
                      'Box',
                    ].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))
                  : ['Calles', 'Bordershop'].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
              </select>
            </div>
          )
        } else if (key === 'online') {
          return (
            <div key={key} className='mb-4'>
              <label className='inline-flex items-center'>
                <input
                  type='checkbox'
                  name={key}
                  checked={value}
                  onChange={handleInputChange}
                  className='mr-2'
                />
                Online Purchase
              </label>
            </div>
          )
        } else {
          return (
            <div key={key} className='mb-4'>
              <label className='block mb-2'>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type={key === 'price' ? 'number' : 'text'}
                name={key}
                value={value}
                onChange={handleInputChange}
                className='border p-2 w-full'
              />
            </div>
          )
        }
      })}
      <button
        type='submit'
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Add Item
      </button>
    </form>
  )
}

export default ItemForm

ItemForm.propTypes = {
  addItem: PropType.func.isRequired,
}

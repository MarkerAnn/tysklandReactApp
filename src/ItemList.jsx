import { useState } from 'react'
import PropType from 'prop-types'

const ItemList = ({ items, deleteItem, updateItem }) => {
  const [editIndex, setEditIndex] = useState(-1)
  const [editFormData, setEditFormData] = useState({})
  const [collapsedGroups, setCollapsedGroups] = useState({})

  const toggleGroup = (groupKey) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }))
  }

  const groupItems = items.reduce((groups, item) => {
    const key = `${item.store}${item.online ? ' (Online)' : ''}`
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {})

  const calculateSubtotals = (group) => {
    const totalWeight = group.reduce(
      (total, item) => total + item.amount * getItemWeight(item.type),
      0
    )
    const totalPrice = group.reduce(
      (total, item) => total + item.amount * parseFloat(item.price),
      0
    )
    return { totalWeight, totalPrice }
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

  const handleEditClick = (item, index) => {
    setEditIndex(index)
    setEditFormData(item)
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData({ ...editFormData, [name]: value })
  }

  const handleSaveClick = () => {
    updateItem(editIndex, editFormData)
    setEditIndex(-1)
  }

  const handleCancelClick = () => {
    setEditIndex(-1)
  }

  return (
    <div>
      {Object.keys(groupItems).map((groupKey) => (
        <div key={groupKey} className='mb-6'>
          <button
            onClick={() => toggleGroup(groupKey)}
            className='text-lg font-bold py-3 px-4 w-full text-left'
          >
            {groupKey} ({collapsedGroups[groupKey] ? 'Show' : 'Hide'})
          </button>
          {!collapsedGroups[groupKey] && (
            <div>
              <table className='min-w-full divide-y divide-gray-200 mt-2'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                      Amount
                    </th>
                    <th className='px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                      Name
                    </th>
                    <th className='px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                      Type
                    </th>
                    <th className='px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                      Price
                    </th>
                    <th className='px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {groupItems[groupKey].map((item, index) => (
                    <tr key={index}>
                      {editIndex === index ? (
                        <EditingRow
                          item={item}
                          editFormData={editFormData}
                          handleEditFormChange={handleEditFormChange}
                          handleSaveClick={handleSaveClick}
                          handleCancelClick={handleCancelClick}
                        />
                      ) : (
                        <DefaultRow
                          item={item}
                          handleEditClick={() => handleEditClick(item, index)}
                          deleteItem={() => deleteItem(items.indexOf(item))}
                        />
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <SubtotalDisplay
                group={groupItems[groupKey]}
                calculateSubtotals={calculateSubtotals}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

const EditingRow = ({
  item,
  editFormData,
  handleEditFormChange,
  handleSaveClick,
  handleCancelClick,
}) => {
  return (
    <>
      {Object.entries(item).map(
        ([key, value]) =>
          key !== 'online' && (
            <td
              key={key}
              className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'
            >
              <input
                type='text'
                name={key}
                value={editFormData[key]}
                onChange={handleEditFormChange}
                className='border p-1 w-full'
              />
            </td>
          )
      )}
      <td className='px-3 py-2 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={handleSaveClick}
          className='text-green-600 hover:text-green-800 mx-2'
        >
          Save
        </button>
        <button
          onClick={handleCancelClick}
          className='text-red-600 hover:text-red-800'
        >
          Cancel
        </button>
      </td>
    </>
  )
}

const DefaultRow = ({ item, handleEditClick, deleteItem }) => {
  return (
    <>
      <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
        {item.amount}
      </td>
      <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
        {item.name}
      </td>
      <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
        {item.type}
      </td>
      <td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
        {item.price} SEK
      </td>
      <td className='px-3 py-2 whitespace-nowrap text-right text-sm font-medium'>
        <button
          onClick={handleEditClick}
          className='text-indigo-600 hover:text-indigo-800 mx-2'
        >
          Edit
        </button>
        <button
          onClick={deleteItem}
          className='text-red-600 hover:text-red-800'
        >
          Delete
        </button>
      </td>
    </>
  )
}

const SubtotalDisplay = ({ group, calculateSubtotals }) => {
  const { totalWeight, totalPrice } = calculateSubtotals(group)
  return (
    <div className='p-4 mt-2 bg-gray-100'>
      <h3 className='font-bold'>Subtotals:</h3>
      <p>Total Weight: {totalWeight.toFixed(2)} kg</p>
      <p>Total Price: {totalPrice.toFixed(2)} SEK</p>
    </div>
  )
}

export default ItemList

ItemList.propTypes = {
  items: PropType.array.isRequired,
  deleteItem: PropType.func.isRequired,
  updateItem: PropType.func.isRequired,
}

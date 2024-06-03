import PropType from 'prop-types'

const TotalSummary = ({ totalWeight, totalPrice }) => {
  return (
    <div className='mt-8'>
      <h2 className='text-xl font-bold'>
        Total Weight: {totalWeight.toFixed(2)} kg
      </h2>
      <h2 className='text-xl font-bold'>
        Total Price: {totalPrice.toFixed(2)} SEK
      </h2>
    </div>
  )
}

export default TotalSummary

TotalSummary.propTypes = {
  totalWeight: PropType.number.isRequired,
  totalPrice: PropType.number.isRequired,
}

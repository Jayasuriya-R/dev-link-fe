import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Messaging = () => {
 
   const params = useParams()
  return (
    <div>
      Messaging
      <button className='bg-primary p-3'>
       {params.targetUserId}
      </button>
    </div>
  )
}

export default Messaging

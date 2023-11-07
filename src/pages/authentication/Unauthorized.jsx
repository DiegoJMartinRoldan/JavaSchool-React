import React from 'react'
import { NavLink } from '../../components/NavLink'



function Unauthorized() {
  return (
    <div>
        <h1>Unauthorized</h1> 
      <button><NavLink to='/'>Back to Home</NavLink></button>
    </div>
  
  )
}

export default Unauthorized
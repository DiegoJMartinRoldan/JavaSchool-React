import React from 'react'
import { NavLink } from '../components/NavLink'

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <button><NavLink to='/catalog'>Catalog</NavLink></button>
      <button><NavLink to='/clientAddress'>ClientsAddress</NavLink></button>
    </div>
    
  )
}

export default Home
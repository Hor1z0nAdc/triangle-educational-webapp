import React from 'react'
import { NavLink } from "react-router-dom"

export const Nav = () => {
  return (
    <div className='nav'>
      <div className='nav'>
        <NavLink to="/" className={({ isActive }) => 
                    (isActive ? "activeLink" : "not-active-class")} style={{ textDecoration: 'none' }}>
          <div className='nav-link'>Otthon</div>
        </NavLink>
      </div>
      <div className='nav'>
        <NavLink to="/bevezetes" className={({ isActive }) => 
                        (isActive ? "activeLink" : "not-active-class")} style={{ textDecoration: 'none' }}>
          <div className='nav-link'>Alapok</div>
        </NavLink>
        <NavLink to="/nevezetesVonalak" className={({ isActive }) => 
                        (isActive ? "activeLink" : "not-active-class")} style={{ textDecoration: 'none' }}>
          <div className='nav-link'>Nevezetes pontok</div>
        </NavLink>
        <NavLink to="/terulet" className={({ isActive }) => 
                        (isActive ? "activeLink" : "not-active-class")} style={{ textDecoration: 'none' }}>
          <div className='nav-link'>Terület</div>
        </NavLink>
        <NavLink to="/pitagorasz" className={({ isActive }) => 
                        (isActive ? "activeLink" : "not-active-class")} style={{ textDecoration: 'none' }}>
          <div className='nav-link'>Pitagorász tétele</div>
        </NavLink>
        <NavLink to="/szerkesztes" className={({ isActive }) => 
                        (isActive ? "activeLink" : "not-active-class")} style={{ textDecoration: 'none' }}>
          <div className='nav-link'>Szerkesztés</div> 
        </NavLink>
      </div>
    </div>
  )
}

export default Nav
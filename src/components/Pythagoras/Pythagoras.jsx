import React from 'react'
import pythagoras from "../../images/pythagoras.gif"
import { NavLink } from 'react-router-dom'
import Canvas from "./Canvas"
import Instruction from "../Instruction"

export const Pythagoras = () => {
  return (
    <div className='eduText'>
       <h1 className='title'>A tétel</h1>
       <p>Bármely derékszögű háromszög leghosszabb oldalának (<span className='highlight'>átfogójának</span>) négyzete 
          megegyezik a másik két oldal (<span className='highlight'>befogók</span>) négyzetösszegével. Tehát: ha egy háromszög 
          derékszögű, akkor a leghosszabb oldalára emelt négyzet területe a másik két 
          oldalra emelt négyzetek területének összegével egyenlő.</p>
        <br />
        <p>A szokásos jelölésekkel (c az átfogó): <span className='highlight'>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></span></p>

        <h1 style={{marginTop: "30px"}} className='title'>Vizuális bizonyítás</h1>
        <div className='imgContainer'>
            <img src={pythagoras} alt="haromszog" />
        </div>

        <h1 className='title'>Tétel alkalmazása</h1>
        <ul>
          <li>Ha adott egy derékszögű háromszög két oldala, a tétel segítségével kiszámítható 
            a harmadik oldal hossza.</li>
          <li>Ha adott egy háromszög három oldala, akkor a tétel segítségével eldönthető, hogy
            a háromszög hegyesszögű, derékszögű vagy tompaszögű.
            "c” jelölje azt oldalt, amelynél nincs nagyobb oldala a háromszögnek.
            <br />
            <br />
            Ha <span className='highlight'>a<sup>2</sup> + b<sup>2</sup> &gt; c<sup>2</sup></span> akkor a a háromszög <span className='highlight'>hegyesszögű</span>.
            <br />
            Ha <span className='highlight'>a<sup>2</sup> + b<sup>2</sup> &lt; c<sup>2</sup></span> akkor a a háromszög <span className='highlight'>tompaszögű</span>.
            <br />
            Ha <span className='highlight'>a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></span> akkor a a háromszög <span className='highlight'>derékszögű</span>.
          </li>
        </ul>

        <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
          <p>Kattints a "Derékszögű generálás" gombra, hogy a program kigeneráljon egy 
            véletlenszerű oldahosszú derékszögű háromszöget. A bal felső sarokban láthatod
            a véletlenszerűen választott a és b oldal hosszát. Majd alatta a pitagorász 
            tételének alkalmazását a háromszög átfogó hosszának meghatározására.</p>
        </Instruction>
        <Canvas />

        <div style={{marginTop: "120px"}} className='testBtn'>
          <NavLink to="/pythagoras_teszt" style={{ textDecoration: 'none' }}>
            <div style={{color: "black"}}>Teszt megkezdése</div>
          </NavLink>
        </div>
    </div>
  )
}

export default Pythagoras
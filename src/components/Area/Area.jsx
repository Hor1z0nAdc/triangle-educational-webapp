import React from 'react'
import area from "../../images/area.png"
import CanvasArea from "./CanvasArea"
import Instruction from "../Instruction"
import { NavLink } from 'react-router-dom'

const Area = () => {
  return (
    <div>
      <div className='eduText'>
        <h1 className='title'>Kerület</h1>
        <p>
          A háromszög kerületének megállapításához annyi a teendőnk, hogy összeadjuk oldalai, 
          azaz a, b és c oldalai hosszát.
          <br />
          <br />
          <span className='highlight'>
          K = a + b + c
          </span>
          < br />
          < br />
          kerület fogalma sokszor előkerül a hétköznapi életben is. Például egy telek körbekerítéséhez 
          kerítés hosszát a telek kerülete adja meg.
        </p>

        <h1 style={{marginTop: "30px"}} className='title'>Terület</h1>
        <p>
         A terület a síkidomok kiterjedését jellemző mennyiség, ami szemléletesen azt mutatja meg, 
         hogy mennyi anyag kell ahhoz, hogy az illető síkidomot lefedjük.
         <br />
         A terület valamely oldal és a hozzá tartozó magasság ismeretében számítható. Az <span className='highlight'>m<sub>a</sub></span> az <span className='highlight'><em>a</em></span> oldalhoz tartozó magasság, 
         az <span className='highlight'>m<sub>b</sub></span> a <span className='highlight'><em>b</em></span> oldalhoz tartozó magasság, míg az <span className='highlight'>m<sub>c</sub></span> a <span className='highlight'><em>c</em></span> oldal magassága.
         <div className='imgContainer'>
          <img src={area} alt="area" />
         </div>
        </p>

        <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
          <p>A gombokra kattintással a program kigenerál egy gombon látható tulajdonságú háromszöget
          és megjeleníti a fehér négyzet területén. Hogy milyen tulajdonságú háromszög látható a négyzet területén,
          azt a bal felső sarokban látható szöveg jelzni. Alatta a program kijelzni az oldalak hosszát és a 
          hozzájuk tartozó szögeket, illetve a magasságvonalainak hosszát, a háromszög kerüeltét és területét.</p>
        </Instruction>
        <CanvasArea />

        <div style={{marginTop: "130px"}} className='testBtn'>
          <NavLink to="/terulet_teszt" style={{ textDecoration: 'none' }}>
            <div style={{color: "black"}}>Teszt megkezdése</div>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Area

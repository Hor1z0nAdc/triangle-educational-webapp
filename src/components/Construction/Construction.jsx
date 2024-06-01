import React from 'react'
import construction from "../../images/construction.png"
import Canvas from "./Canvas"
import Instruction from "../Instruction"
import { NavLink } from "react-router-dom"

export const Construction = () => {
  return (
    <div className='eduText'>
       <h1 className='title'>Háromszög meghatározása</h1>
       <p>Egy háromszög megadásához három olyan adatra van szükségünk, amelyek egyértelműen 
        meghatároznak egy háromszöget. Az oldalak és a szögek segítségével ezt 
        többféleképpen megtehetjük.</p>
        <br />
        <span>Egy háromszöget egyértelműen meghatározza</span>
        <div className='imgContainer'>
            <img src={construction} alt="haromszog" />
        </div>

        <h1 className='title'>Szerkesztés három oldallal</h1>
        Adott a három adott hosszúságú szakasz: a, b és c. Csak olyan szakaszokból 
        szerkeszthető háromszög, amelyek teljesítik a háromszög oldalaira vonatkozó 
        háromszög-egyenlőtlenséget: <span className='highlight'>a háromszögben bármely két oldal összege nagyobb a 
        harmadik oldalnál</span>.
        <h2 style={{margin: "20px"}}>Szerkesztés lépései</h2>
        <ol style={{marginBottom: "20px"}}>
          <li>Vegyünk fel egy A kezdőpontú félegyenest.</li>
          <li>Körzővel A-ból mérjünk a félegyenesre adott c hosszúságú szakaszt. Így megkapjuk a B pontot.</li>
          <li>Rajzoljuk meg az A középpontú, b sugarú kört.</li>
          <li>Rajzoljuk meg a B középpontú, a sugarú kört.</li>
          <li>Jelöljük meg a körök metszéspontját.</li>
          <li>Kössük össze ezt a metszéspontot A-val és B-vel.</li>
        </ol>

        <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
        <p>A gombokra kattintással a program kigenerál egy gombon látható tulajdonságú háromszöget
          és megjeleníti a fehér négyzet területén. Hogy milyen tulajdonságú háromszög látható a négyzet területén,
          azt a bal felső sarokban látható szöveg jelzni. Alatta a program kijelzni az oldalak hosszát és a 
          hozzájuk tartozó szögeket.
        </p>
      </Instruction>
      <Canvas/>

      <div style={{marginTop: "130px"}} className='testBtn'>
          <NavLink to="/szerkesztes_teszt" style={{ textDecoration: 'none' }}>
            <div style={{color: "black"}}>Teszt megkezdése</div>
          </NavLink>
        </div>
    </div>
  )
}

export default Construction

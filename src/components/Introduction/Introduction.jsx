import React from 'react'
import CanvasGen from "./CanvasGen"
import CanvasOwn from "./CavasOwn"
import Instruction from "../Instruction"
import triangle from "../../images/haromszog.jpg"
import { NavLink } from "react-router-dom"

export const Introduction = () => {
  return (
    <div>
      <div className='eduText'>
         <h1 className='title'>A háromszög</h1>
         <p>
            A háromszög egy olyan sokszög, amely 3 oldallal és 3 csúccsal rendelkezik.
            <br />
            A csúcsait nagybetűkkel jelöljük: általában <span className='highlight'>A</span>-val, <span className='highlight'>B</span>-vel és <span className='highlight'>C</span>-vel-vel.
            <br />
            A háromszög oldalait kisbetűkkel kell jelölni. Általánosan <span className='highlight'>a</span>-val, <span className='highlight'>b</span>-vel és <span className='highlight'>c</span>-vel.
         </p>
         <br/>
         <p>
            A háromszög szögeit a görög betűkkel jelöljük.<br />
            Az A csúcsnál levő szög lesz az alfa, jelölése: <span className='highlight'>α</span>.<br />
            A B csúcsnál levő szög a béta, jelölése: <span className='highlight'>ß</span>.<br />
            A C csúcsnál pedig a gamma nevű szög található, jelölése: <span className='highlight'>γ</span>.
         </p>
         <div className='imgContainer'>
            <img src={triangle} alt="haromszog" />
         </div>

          <h1 className='title'>Osztályozás</h1>
          <h2 className='subTitle'>A háromszögek csoportosítása oldalaik hosszúsága szerint:</h2>
     
          <ul>
            <li>Az <span className='highlight'>általános háromszög</span> minden oldala különböző hosszú, és belső szögei is különbözőek</li>
            <li>Az <span className='highlight'>egyenlő szárú háromszögnek</span> két oldala egyenlő hosszúságú, két szöge is egyenlő.</li>
            <li>A <span className='highlight'>szabályos háromszög</span> minden oldala egyenlő hosszúságú, minden szöge 60°</li>
          </ul>

          <h2 className='subTitle'>A háromszögek csoportosítása legnagyobb belső szögük mérete szerint:</h2>
          <div className='centre'>
            <ul>
              <li>A <span className='highlight'>derékszögű háromszögnek</span> van egy 90°-os belső szöge (egy derékszög). 
              A derékszöggel szemközti oldalt <span className='highlight'>átfogónak</span>, a derékszöget közrefogó másik két oldalt <span className='highlight'>befogóknak</span> nevezzük.</li>
              <li>A <span className='highlight'>tompaszögű háromszögnek</span> van egy 90°-nál nagyobb belső szöge (egy tompaszög).</li>
              <li>A <span className='highlight'>hegyesszögű háromszögnek</span> mindhárom szöge 90°-nál kisebb (három hegyesszög)</li>
            </ul>
          </div>

      <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
        <p>A gombokra kattintással a program kigenerál egy gombon látható tulajdonságú háromszöget
          és megjeleníti a fehér négyzet területén. Hogy milyen tulajdonságú háromszög látható a négyzet területén,
          azt a bal felső sarokban látható szöveg jelzni. Alatta a program kijelzni az oldalak hosszát és a 
          hozzájuk tartozó szögeket.
        </p>
      </Instruction>
      <CanvasGen/>

      <div className='bigMarg'> 
        <h1 className='title'>Saját háromszög osztályozása</h1>
        <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
          <p>A kör alakú gombra kattintva válaszd ki, hogy kizárólag oldalhossz, vagy két oldalhossz és szög, esetleg
            oldalhossz és két szög kombinációjával szeretnéd megadni a kirajzolandó és osztályazandó háromszöget.
            Utána kattints az a oldal címkével ellátott mezőre, majd gépeld be az elvárt oldalhoszt.
            Ugyanezt tedd meg a többi mezővel is. Szög esetén fokban add meg az elvárt szöget.
            Miután megadtad az adatokat kattints a generálás gombra. A bal felső sarokban láthatod, hogy a 
            begépelt háromszög oldalai és szögei alapján milyen kategóriába sorolható.</p>
        </Instruction>
        <Instruction openText="Szerkeszthetőség szabályainak megnyitása" closeText="Szerkeszthetőség szabályainak bezárása">
          <p>A háromszög-egyenlőtlenség tétele segítségével megállapítható, hogy a 
            megadott oldalhosszokkal lehet-e háromszöget szerkeszteni.
            <br />
            A háromszög bármely oldalának hossza kisebbnek kell lennie a másik két oldal hosszának összegénél.
            <br />
            Azaz: {"a < b+c  és  b < a+c  és  c < a+b"}
            <br />
            <br />
            Továbbá a program az egyszerűség kedvéért megkövetel néhány további szabályt:
            <br />
            1. A háromszög oldalainak hossza nem lehet kissebb 3-nál.
            <br />
            2. A háromszög oldalainak hossza nem lehet nagyobb 18-nál.
            <br />
            3. A háromszög bármely szöge nem lehet nagyobb 150 foknál.
            <br />
            4. A háromszög bármely szöge nem lehet kisebb 10 foknál.
            <br />
            5. A megadott két szög összege nem lehet nagyobb 170 foknál.
          </p>
        </Instruction>
        <CanvasOwn/>
        <div style={{marginTop: "170px"}} className='testBtn'>
          <NavLink to="/bevezetes_teszt" style={{ textDecoration: 'none' }}>
            <div style={{color: "black"}}>Teszt megkezdése</div>
          </NavLink>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Introduction
import React from 'react'
import CanvasLines from "./CanvasLines"
import circumcenter from "../../images/circumcenter.png"
import centroid from "../../images/centroid.png"
import incircle from "../../images/incircle.png"
import orthocenter from "../../images/orthocenter.png"
import Instruction from "../Instruction"
import { NavLink } from "react-router-dom"

export const Lines = () => {
  return (
    <div>
      <div className='eduText'>
        <h1 className='title'>Oldalfelező merőleges</h1>
        <p>A háromszög <span className='highlight'>felező merőlegesei</span> olyan egyenesek, amik átmennek egy oldal <span className='highlight'>felezőpontján</span> és 
           merőlegesek az oldalra. A három felező merőleges egy pontban találkozik, a háromszög <span className='highlight'>köréírt körének</span> középpontjában. 
           A köréírt kör a háromszög összes csúcsán átmegy.</p>
        <div className='imgContainer'>
          <img src={circumcenter} alt="haromszog" />
         </div>

        <h1 className='title'>Szögfelező</h1>
        <p>A háromszög <span className='highlight'>szögfelezője</span> az a csúcson átmenő egyenes, ami a csúcshoz tartozó szöget kettéosztja. 
        A szögfelező minden pontja a szög melletti oldalaktól egyenlő távolságra van. A három szögfelező 
        egy pontban metszi egymást, a <span className='highlight'>beírt kör</span> középpontjában. A beírt kör a háromszög belsejében található 
        kör, ami mindhárom oldalt belülről érinti.</p>
        <div className='imgContainer'>
            <img src={incircle} alt="haromszog" />
        </div>

        <h1 className='title'>Magasságvonal</h1>
        <p>A háromszög <span className='highlight'>magasságvonalán</span> a csúcspontot a szemközti oldallal derékszögben összekötő vonalat értjük.
           Ezt a szemközti oldalt a magasság <span className='highlight'>alapjának</span>, a magasságvonal és az alap metszéspontját a magasság 
           <span className='highlight'>talppontjának</span> nevezzük. A magasságvonal hossza a csúcspont és az alap közötti távolsággal egyenlő. 
           A három magasságvonal egy pontban metszi egymást, a háromszög <span className='highlight'>magasságpontjában</span>. A magasságpont akkor 
           és csak akkor van a háromszög belsejében, ha a háromszög nem tompaszögű.</p>
        <div className='imgContainer'>
          <img src={orthocenter} alt="haromszog" />
        </div>

        <h1 className='title'>Súlyvonal</h1>
        <p>A háromszög <span className='highlight'>súlyvonala</span> egy csúcspont és a szemközti oldal felezőpontját összekötő szakasz, 
           ami a háromszöget két egyenlő területű részre bontja. A három súlyvonal egy pontban metszi egymást, 
           a metszéspontot a háromszög <span className='highlight'>súlypontjának</span> nevezzük. A súlypont egyben a háromszög tömegközéppontja 
           is: ha a háromszöget például fából legyártanánk, a súlypontot vagy az egész súlyvonalat 
           alátámasztva egyensúlyban lenne. A súlypont 2:1 arányban osztja a súlyvonalat úgy, hogy a 
           csúcstól fekszik távolabb.</p>
        <div className='imgContainer'>
          <img src={centroid} alt="haromszog" />
        </div>
        <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
          <p>A kör alakú gombra kattintva válaszd ki, hogy kizárólag oldalhossz, vagy két oldalhossz és szög, esetleg
            oldalhossz és két szög kombinációjával szeretnéd megadni a kirajzolandó és osztályazandó háromszöget.
            Utána kattints az a oldal címkével ellátott mezőre, majd gépeld be az elvárt oldalhoszt.
            Ugyanezt tedd meg a többi mezővel is. Szög esetén fokban add meg az elvárt szöget.
            Miután megadtad az adatokat kattints a generálás gombra.
            <br />
            Ezután kattints a kigenerálás alatti gombok valamelyikére a gombokról olvasható nevezetes vonalak
            és ponton kirajzolásához, velük kapcsolatos információk kiiratásához.
          </p>
        </Instruction>
        <CanvasLines />
        <div style={{marginTop: "250px"}} className='testBtn1'>
            <NavLink to="/nevezetesVonalak_teszt" style={{ textDecoration: 'none' }}>
              <div style={{color: "black"}}>Teszt megkezdése</div>
            </NavLink>
            </div>
      </div>
    </div>
  )
}

export default Lines

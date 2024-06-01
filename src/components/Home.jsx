import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='eduText'>
      <h1 className='title'>Bemutatás</h1>
      <p>Ez a webalkalmazás általános iskolák felső tagozatos tanulói számára készült. Célja, hogy elősegítse
        a diákok matematikai tudásának fejlesztését a háromszögek témakörének feldolgozásával.
        <br /> 
        <br /> 
        Ez az online felület lehetőséget biztosít a tanulóknak, hogy az átadott anyagrészt maguk is 
        kipróbálják, mialatt interakcióba 
        lépnek a program bizonyos elemeivel. Egyes oldalain gombokra kattintva dönthetik el, hogy mit szeretnének
        kigeneráltatni és megjeleníteni, míg egyes helyeken a tanulók maguk vihetik be a háromszögek paramétereit
        és figyelhetik meg, hogyan változik a megjelenő kimenet.
        <br /> 
        <br /> 
        Ezen kívül minden anyagrész végén található egy teszt, mellyel a tanulók felmérhetik tudásukat és 
        gyakorolhatják az adott anyagrészben foglaltakat azok alkalmazásával. A teszt kiértékelésénél megfigyelhetik,
        hogy mennyi feladatot oldottak meg helyesen, esetleg hol hibáztak, mi lett volna a helyes megoldás.
      </p>

      <h1 style={{marginTop: "50px"}} className='title'>A webalkalmazás használata</h1>
      <p>Az oldal felső részén látható menüpontokra való eljuthatsz a kívánt webhelyre.
        A könnyebb navigálhatóság végett vörös háttér jelzi, hogy jelenleg melyik menüponton tartózkodol.
        <br />
        Valamennyi oldal további insturkciókkal lát el az alkalmazás megfelelő és gördülékeny használatát illetően.
        Az instrukciók megtekintéséhez annyi a dolgod, hogy kattints a vörös hátterű "instrukció megnyitása" felíratú gombra.
      </p>

      <p style={{marginTop: "20px", color: "rgb(248, 88, 88)"}}>Jó szórakozást és hasznos időtöltést kívánok!</p>
      
      <div className='testBtn1'>
          <Link to="/bevezetes" style={{ textDecoration: 'none' }}>
            <div style={{color: "black"}}>Tanulás megkezdése</div>
          </Link>
        </div>
    </div>
  )
}

export default Home

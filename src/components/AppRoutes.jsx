import React from 'react'
import { Routes, Route } from "react-router-dom"
import Area from "./Area/Area"
import Construction from "./Construction/Construction"
import Introduction from "./Introduction/Introduction"
import Lines from "./Lines/Lines"
import Pythagoras from "./Pythagoras/Pythagoras"
import Home from "./Home"
import IntroductionTest from "./Introduction/IntroductionTest"
import LinesTest from "./Lines/LinesTest"
import AreaTest from "./Area/AreaTest"
import PythagorasTest from "./Pythagoras/Test"
import ConstructionTest from "./Construction/Test"

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bevezetes" element={<Introduction />} />
        <Route path="/nevezetesVonalak" element={<Lines />} />
        <Route path="/terulet" element={<Area />} />
        <Route path="/pitagorasz" element={<Pythagoras />} />
        <Route path="/szerkesztes" element={<Construction />} />
        <Route path="/bevezetes_teszt" element={<IntroductionTest />} />
        <Route path="/nevezetesVonalak_teszt" element={<LinesTest />} />
        <Route path="/terulet_teszt" element={<AreaTest />} />
        <Route path="/pythagoras_teszt" element={<PythagorasTest />} />
        <Route path="/szerkesztes_teszt" element={<ConstructionTest />} />
      </Routes>
    </div>
  )
}

export default AppRoutes

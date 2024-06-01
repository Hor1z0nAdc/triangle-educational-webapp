import React from 'react'
import { useRef, useEffect, useState } from 'react'

const CANVAS_W = 500;
const CANVAS_H = 500;
const DRAW_LENGHT_WEIGHT = 15;
const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const MIN_ANGLE = 40;
const MAX_ANGLE = 100;
const errorTexts = ["Az 'a' oldal hossza túl nagy a 'b' és 'c' oldahoz viszonyítva",
                    "Az 'b' oldal hossza túl nagy az 'a' és 'c' oldahoz viszonyítva",
                    "Az 'c' oldal hossza túl nagy az 'a' és 'b' oldahoz viszonyítva",
                    "A megadott háromszög legalább egyik oldala túl nagy",
                    "A megadott háromszög legalább egyik oldala túl kicsi",
                    "A megadott szög túl nagy",
                    "A megadott szög túl kicsi",
                    "A megadott szögek öszzege túl nagy"]

const CavasOwn = () => {
  const [inputType, setInputType] = useState("oldalak");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const aLengthRef = useRef(null);
  const bLengthRef = useRef(null);
  const cLengthRef = useRef(null);
  const AAngleRef = useRef(null);
  const CAngleRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "20px serif";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;
  }, [])

  function onOptionChange(e) {
    const ctx = ctxRef.current;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    setInputType(e.target.value);
    setDisabled(true);
  }

  function onSideChange(e, dataType) {
    //Change ref value
    if(dataType == "a") {
      aLengthRef.current = e.target.value;
    }
    else if(dataType == "b"){
      bLengthRef.current = e.target.value;
    }
    else if(dataType == "c") {
      cLengthRef.current = e.target.value;
    }
    else if(dataType == "A") {
      AAngleRef.current = e.target.value;
    }
    else if(dataType == "C") {
      CAngleRef.current = e.target.value;
    }

    //Disable / enable button based on inputType and given values
    if(inputType == "oldalak") {
        if(!aLengthRef.current || !bLengthRef.current || !cLengthRef.current) {
          setDisabled(true);
        }
        else {
          setDisabled(false);
        }
    }
    else if(inputType == "oldalakSzög") {
      if(!aLengthRef.current || !bLengthRef.current || !CAngleRef.current) {
        setDisabled(true);
      }
      else {
        setDisabled(false);
      }
    }
    else {
      if(!bLengthRef.current || !AAngleRef.current || !CAngleRef.current) {
        setDisabled(true);
      }
      else {
        setDisabled(false);
      }
    }
  }

  function generateTriangle() {
    let point;
    let coords = [];
    let aSide, bSide, cSide;
    let AAngleDegree, BAngleDegree, CAngleDegree;
    let AAngleRadian, BAngleRadian, CAngleRadian;

    let startX, startY, dx, dy;
    let angleClass, sideClass;
    let isASmaller, isBSmaller, isCSmaller;
    let isError = false;

    if(inputType == "oldalak") {
        aSide = parseInt(aLengthRef.current);
        bSide = parseInt(bLengthRef.current);
        cSide = parseInt(cLengthRef.current); 

        //Check if given sides are too small or too big
        if(aSide > MAX_LENGTH || bSide > MAX_LENGTH || cSide > MAX_LENGTH) {
          setError(3);
          isError = true;
        }
        else if(aSide < MIN_LENGTH || bSide < MIN_LENGTH || cSide < MIN_LENGTH) {
          setError(4);
          isError = true;
        }

        if(isError) {
          const ctx = ctxRef.current;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
          return;
        }

        //Triangle inequality - determine, if triangle is valid or not
        isASmaller = aSide < bSide + cSide;
        isBSmaller = bSide < aSide + cSide;
        isCSmaller = cSide < aSide + bSide;
        //if one side isn't smaller than the sum of other sides, then it is not a valid triangle
        if(!isASmaller) {
           setError(0);           
        }
        else if(!isBSmaller) {
          setError(1);  
        }
        else if(!isCSmaller) {
          setError(2);  
        }
        else {
          setError(null);  
        }

        if(!isASmaller || !isBSmaller || !isCSmaller) {
          const ctx = ctxRef.current;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
          return;
        }

        //Calculate all the angles based of sides
        AAngleRadian = Math.acos((Math.pow(bSide,2) + Math.pow(cSide,2) - Math.pow(aSide,2)) / (2 * bSide * cSide));
        BAngleRadian = Math.acos((Math.pow(aSide,2) + Math.pow(cSide,2) - Math.pow(bSide,2)) / (2 * aSide * cSide));
        
        AAngleDegree = AAngleRadian* 180/Math.PI;
        BAngleDegree = BAngleRadian* 180/Math.PI;

        CAngleDegree = 180 - (AAngleDegree + BAngleDegree);

        CAngleRadian = CAngleDegree * (Math.PI/180);
        
    }
    else if(inputType == "oldalakSzög") {
      aSide = parseInt(aLengthRef.current);
      bSide = parseInt(bLengthRef.current);
      CAngleDegree = parseInt(CAngleRef.current);

      //Check if given sides are too small or too big
      if(aSide > MAX_LENGTH || bSide > MAX_LENGTH) {
        setError(3);
        isError = true;
      }
      else if(aSide < MIN_LENGTH || bSide < MIN_LENGTH) {
        setError(4);
        isError = true;
      }
      else if(CAngleDegree > 150) {
        setError(5);
        isError = true;
      }
      else if(CAngleDegree < 10) {
        setError(6);
        isError = true;
      }
      else {
        setError(null);
      }
      
      if(isError) {
        const ctx = ctxRef.current;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        return;
      }

      //Convert degree to radian
      CAngleRadian = CAngleDegree * (Math.PI/180);

      //Calculate missing params
      cSide = Math.sqrt(Math.pow(aSide,2) + Math.pow(bSide,2) - 2*aSide*bSide*Math.cos(CAngleRadian));
      AAngleRadian = Math.acos((Math.pow(bSide,2) + Math.pow(cSide,2) - Math.pow(aSide,2)) / (2 * bSide * cSide));
      AAngleDegree =  AAngleRadian * (180/Math.PI);

      BAngleDegree = 180 - (AAngleDegree + CAngleDegree);
      BAngleRadian = BAngleDegree * (Math.PI/180);

      //Triangle inequality - determine, if triangle is valid or not
      isASmaller = aSide < bSide + cSide;
      isBSmaller = bSide < aSide + cSide;
      isCSmaller = cSide < aSide + bSide;
      //if one side isn't smaller than the sum of other sides, then it is not a valid triangle
      if(!isASmaller) {
        setError(0);  
        isError = true;         
      }
      else if(!isBSmaller) {
        setError(1);
        isError = true;   
      }
      else if(!isCSmaller) {
        setError(2);  
        isError = true;   
      }
      else {
        setError(null);  
      }

      if(isError) {
        const ctx = ctxRef.current;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        return;
      }
    }
    else {
      bSide = parseInt(bLengthRef.current);
      CAngleDegree = parseInt(CAngleRef.current);
      AAngleDegree = parseInt(AAngleRef.current);

      //Check if given sides are too small or too big
      if(bSide > MAX_LENGTH) {
        setError(3);
        isError = true;
      }
      else if(bSide < MIN_LENGTH) {
        setError(4);
        isError = true;
      }
      else if(CAngleDegree > 150 || AAngleDegree > 150) {
        setError(5);
        isError = true;
      }
      else if(CAngleDegree < 10 || AAngleDegree < 10) {
        setError(6);
        isError = true;
      }
      else if(CAngleDegree + AAngleDegree > 170) {
        setError(7);
        isError = true;
      }

      if(isError) {
        const ctx = ctxRef.current;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        return;
      }

      //Convert degree to radian
      CAngleRadian = CAngleDegree * (Math.PI/180);
      AAngleRadian = AAngleDegree * (Math.PI/180);

      //Calculate missing params
      BAngleDegree = 180 - (AAngleDegree + CAngleDegree);
      BAngleRadian = BAngleDegree * (Math.PI/180);
      
      cSide = (Math.sin(CAngleRadian) * bSide) * Math.sin(BAngleRadian);
      aSide = (Math.sin(AAngleRadian) * bSide) * Math.sin(BAngleRadian);

       //Triangle inequality - determine, if triangle is valid or not
       isASmaller = aSide < bSide + cSide;
       isBSmaller = bSide < aSide + cSide;
       isCSmaller = cSide < aSide + bSide;
       //if one side isn't smaller than the sum of other sides, then it is not a valid triangle
       if(!isASmaller) {
         setError(0);           
       }
       else if(!isBSmaller) {
         setError(1);  
       }
       else if(!isCSmaller) {
         setError(2);  
       }
       else {
         setError(null);  
       }
       if(!isASmaller || !isBSmaller || !isCSmaller) {
         const ctx = ctxRef.current;
         ctx.setTransform(1, 0, 0, 1, 0, 0);
         ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
         return;
       }
    }

    //Determine the class of triangle
    if(AAngleDegree > 90 || BAngleDegree > 90 || CAngleDegree > 90) {
        angleClass = "Tompaszögű";
    }
    else if(AAngleDegree == 90 || BAngleDegree == 90 || CAngleDegree == 90) {
      angleClass = "Derékszögű";
    }
    else {
      angleClass = "Hegyesszögű";
    }

    if(aSide == bSide && aSide == cSide) {
      sideClass = "Szabályos";
    }
    else if(aSide == bSide || aSide == cSide || bSide == cSide) {
      sideClass = "Egyenlő szárú";
    }
    else {
      sideClass = "Általános";
    }

    //Calculate points
    startX = -cSide * 0.5;
    startY = 0;
    point = {x: startX, y: startY};
    coords.push(point);

    dx = bSide * Math.cos(AAngleRadian);
    dy = -bSide * Math.sin(AAngleRadian);
    point = {x: startX + dx, y: startY + dy};
    coords.push(point);

    point = {x: startX + cSide, y: startY};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point);
    
    //Prepare for drawing
    const sides = {a: aSide, b: bSide, c: cSide}
    const angles = {a: AAngleRadian, b: BAngleRadian, c: CAngleRadian};
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];
    drawTriangle(coords, sides, angles, vertexText, sideText, angleClass, sideClass);
  }

  const drawTriangle = (triangleCoords, sides, angles, vertexText, sideText, angleClass, sideClass) => {
    const ctx = ctxRef.current;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const aText = "a = " +  sides.a.toFixed(1);
    const bText = "b = " +  sides.b.toFixed(1);
    const cText = "c = " +  sides.c.toFixed(1);
    const aAngleText = "A szög = " +  Math.round(angles.a * (180/Math.PI));
    const bAngleText = "B szög = " +  Math.round(angles.b * (180/Math.PI));
    const cAngleText = "C szög = " +  Math.round(angles.c * (180/Math.PI));

    ctx.fillStyle = "red";
    ctx.font = " bold 20px serif";
    ctx.fillText(sideClass, 10, 30);
    ctx.fillText(angleClass, 10, 60);

    ctx.fillStyle = "black";
    ctx.font = "normal 20px serif";
    ctx.fillText(aText, 10, 90);
    ctx.fillText(bText, 10, 120);
    ctx.fillText(cText, 10, 150);
    ctx.fillText(aAngleText, 10, 180);
    ctx.fillText(bAngleText, 10, 210);
    ctx.fillText(cAngleText, 10, 240);

    ctx.translate(CANVAS_W * 0.5, CANVAS_H * 0.8);
    let coord;
    let nextCoord;
    let dx,dy;
    let sideDX, sideDY;
    let vertex;
    let side;

    for(let i = 0; i < 3; i++) {
      coord = triangleCoords[i];
      nextCoord = triangleCoords[i+1];

      switch(i) {
        case 0:
          vertex = vertexText[i];
          side = sideText[i];
          dx = -20;
          dy = 0;
          sideDX = -20;
          sideDY = 0;
          break;
        case 1:
          vertex = vertexText[i];
          side = sideText[i];
          dx = 0;
          dy = -10;
          sideDX = 10;
          sideDY = 0;
          break;
        case 2:
          vertex = vertexText[i];
          side = sideText[i];
          dx = 10;
          dy = 0;
          sideDX = 0;
          sideDY = 20;
          break;
      }

      ctx.beginPath();
      ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);

      //draw Vertex text
      ctx.fillText(vertex, coord.x * DRAW_LENGHT_WEIGHT + dx, coord.y * DRAW_LENGHT_WEIGHT + dy);
      //draw side text
      ctx.fillText(side, 
                   ((coord.x + nextCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                   ((coord.y + nextCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                  );
      //draw side
      ctx.lineTo(nextCoord.x * DRAW_LENGHT_WEIGHT,nextCoord.y * DRAW_LENGHT_WEIGHT);
      ctx.stroke();
    }
  }

    return (
        <div>
          <span className='errorText'>{ errorTexts[error] }</span>
          <div className='canvasContainer'>
            <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}>
            </canvas> 
            <div>
              <div style={{marginBottom: "15px"}}>
                <div className='radioContainer'>
                  <label style={{marginRight: "10px"}}>Oldalak</label>
                  <input type="radio" value="oldalak" name='inputType' onChange={onOptionChange} checked={inputType === "oldalak"}/>
                </div>
                <div className='radioContainer'>
                  <label style={{marginRight: "10px"}}>Oldalak és szög</label>
                  <input type="radio" value="oldalakSzög" name='inputType' onChange={onOptionChange}/>
                </div>
                <div className='radioContainer'>
                  <label style={{marginRight: "10px"}}>Oldal és szögek</label>
                  <input type="radio" value="oldalSzögek" name='inputType' onChange={onOptionChange}/>
                </div>
              </div>
              {inputType == "oldalak" &&
              <div>
                <span className='sp'>a oldal</span>
                <input className='sideInput' type="number" min={2} max={18} 
                       onChange={(e) =>{onSideChange(e, "a")}}/>
                <span className='sp'>b oldal</span>
                <input className='sideInput' type="number" min={2} max={18}
                       onChange={(e) =>{onSideChange(e, "b")}}/>
                <span className='sp'>c oldal</span>
                <input className='sideInput' type="number" min={2} max={18}
                       onChange={(e) =>{onSideChange(e, "c")}}/>
                <button className='btn' onClick={generateTriangle} disabled={disabled}>kigenerálás</button>
              </div>
              }
              {inputType == "oldalakSzög" &&
              <div>
                <span className='sp'>a oldal</span>
                <input className='sideInput' type="number" min={2} max={18}
                       onChange={(e) =>{onSideChange(e, "a")}}/>
                <span className='sp'>b oldal</span>
                <input className='sideInput' type="number" min={2} max={18}
                       onChange={(e) =>{onSideChange(e, "b")}}/>
                <span className='sp'>C szög</span>
                <input className='sideInput' type="number" min={0} max={160}
                       onChange={(e) =>{onSideChange(e, "C")}}/>
                <button className='btn' onClick={generateTriangle} disabled={disabled}>kigenerálás</button>
              </div>
              }
              {inputType == "oldalSzögek" &&
              <div>
                <span className='sp'>b oldal</span>
                <input className='sideInput' type="number" min={2} max={18}
                       onChange={(e) =>{onSideChange(e, "b")}}/>
                <span className='sp'>A szög</span>
                <input className='sideInput' type="number" min={0} max={160}
                       onChange={(e) =>{onSideChange(e, "A")}}/>
                <span className='sp'>C szög</span>
                <input className='sideInput' type="number" min={0} max={160}
                       onChange={(e) =>{onSideChange(e, "C")}}/>
                <button className='btn' onClick={generateTriangle} disabled={disabled}>kigenerálás</button>
              </div>
              }
            </div>
          </div>
        </div>
      )
}

export default CavasOwn
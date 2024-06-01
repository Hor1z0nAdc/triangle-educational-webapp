import React from 'react'
import { useRef, useEffect } from 'react'

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 15;
const MIN_ANGLE = 40;
const MAX_ANGLE = 100;
const DRAW_LENGHT_WEIGHT = 15;

const Canvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const property = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "20px serif";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;
  }, [])

  const drawTriangle = (triangleCoords, sides, angles, vertexText, sideText) => {
    const ctx = ctxRef.current;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const aText = "a = " +  sides.a.toFixed(1);
    const bText = "b = " +  sides.b.toFixed(1);
    const cText = "c = " +  sides.c.toFixed(1);
    const aAngleText = "A szög = " +  Math.round(angles.a * (180/Math.PI));
    const bAngleText = "B szög = " +  Math.round(angles.b * (180/Math.PI));
    const cAngleText = "C szög = " +  Math.round(angles.c * (180/Math.PI));
    ctx.fillText(property.current, 10, 30);
    ctx.fillText(aText, 10, 60);
    ctx.fillText(bText, 10, 90);
    ctx.fillText(cText, 10, 120);
    ctx.fillText(aAngleText, 10, 150);
    ctx.fillText(bAngleText, 10, 180);
    ctx.fillText(cAngleText, 10, 210);

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

  function generateScalene() {
    property.current = "Általános"
    let coords = [];
    let point;
    let dx,dy;

    //generate random side lengths;
    let aSideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    let bSideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);

    //generate c side angle in degree and convert it to radian
    let CAngle = randomIntFromInterval(MIN_ANGLE, MAX_ANGLE);
    CAngle = CAngle * (Math.PI/180);
    
    //define the c side length base on a,b side length and c angle
    let cSideLength = Math.sqrt(Math.pow(aSideLength,2) + Math.pow(bSideLength,2) - 2*aSideLength*bSideLength*Math.cos(CAngle));
    
    //define the A, B verticies angles in radian
    let AAngle = (Math.sin(CAngle) * aSideLength) / cSideLength;
    let BAngle = 180 - (AAngle * 180/Math.PI + CAngle * 180/Math.PI );
    BAngle = BAngle * Math.PI/180;
    //let BAngle = (Math.sin(CAngle) * bSideLength) / cSideLength;

    //Calculate positions 
    let startX = -cSideLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    coords.push(point); 
    
    dx = bSideLength * Math.cos(AAngle);
    dy = -bSideLength * Math.sin(AAngle);
    point = {x: startX + dx, y: startY + dy};
    coords.push(point);

    point = {x: startX + cSideLength, y: startY};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point); 

    let sides = {a: aSideLength, b: bSideLength, c: cSideLength}
    let angles = {a: AAngle, b: BAngle, c: CAngle};
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];
    drawTriangle(coords, sides, angles, vertexText, sideText);
  }

  function generateEquilateral() {
    property.current = "Egyenlő oldalú"
    let coords = [];
    let angle = 1.0471975512;
    let point;

    //generate sides length
    let sideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    
    //Calculate positions 
    let startX = -sideLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    coords.push(point); 

    let dx = sideLength * Math.cos(angle);
    let dy = -sideLength * Math.sin(angle);
    point = {x: startX + dx, y: startY + dy};
    coords.push(point);

    point = {x: startX + sideLength, y: 0};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point); 

    let sides = {a: sideLength, b: sideLength, c: sideLength}
    let angles = { a: 1.0471975512 , b: 1.0471975512, c: 1.0471975512 };
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];
    drawTriangle(coords, sides, angles, vertexText, sideText);
  }

  function generateIsosceles() {
    property.current = "Egyenlő szárú"
    let coords = [];
    let point;

    //Generate sides and equal angle
    let equalSidesLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    let equalAngle = randomIntFromInterval(30, 80);
    equalAngle = equalAngle * (Math.PI/180);

    //determine base side length and C angle
    let CAngle = 180 - (equalAngle* 180/Math.PI + equalAngle * 180/Math.PI );
    CAngle = CAngle * (Math.PI/180);
    let cSideLength = Math.sqrt(Math.pow(equalSidesLength,2) + Math.pow(equalSidesLength,2) - 2*equalSidesLength*equalSidesLength*Math.cos(CAngle));

    //Calculate positions 
    let startX = -cSideLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    coords.push(point); 

    let dx = equalSidesLength * Math.cos(equalAngle);
    let dy = -equalSidesLength * Math.sin(equalAngle);
    point = {x: startX + dx, y: startY + dy};
    coords.push(point);

    point = {x: startX + cSideLength, y: 0};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point); 


    let sides = {a: equalSidesLength, b: equalSidesLength, c: cSideLength}
    let angles = { a: equalAngle , b: equalAngle, c: CAngle };
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];
    drawTriangle(coords, sides, angles, vertexText, sideText);
  }

  function generateAcuteAngled() {
    property.current = "Hegyesszögű"
    let coords = [];
    let cSideLength, aSideLength, bSideLength;
    let AAngle, BAngle, CAngle;
    let point;
    let dx,dy;
    let isASmaller, isBSmaller, isCSmaller;

     //Generate base side length and A,B angles until it's a valid triangle
     do {
      cSideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
      AAngle = randomIntFromInterval(46,85);
      BAngle = randomIntFromInterval(46,85);
      AAngle = AAngle * (Math.PI/180);
      BAngle = BAngle * (Math.PI/180);
  
      //Calculate C angle
      CAngle = 180 - (AAngle * 180/Math.PI + BAngle * 180/Math.PI );
      CAngle = CAngle * (Math.PI/180);
  
      //Calculate a,b side lengths
      aSideLength = (Math.sin(AAngle) * cSideLength) * Math.sin(CAngle);
      bSideLength = (Math.sin(BAngle) * cSideLength) * Math.sin(CAngle);

      isASmaller = aSideLength < bSideLength + cSideLength;
      isBSmaller = bSideLength < aSideLength + cSideLength;
      isCSmaller = cSideLength < aSideLength + bSideLength;

    } while((!isASmaller || !isBSmaller || !isCSmaller))


    //Calculate positions 
    let startX = -cSideLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    coords.push(point); 
    
    dx = bSideLength * Math.cos(AAngle);
    dy = -bSideLength * Math.sin(AAngle);
    point = {x: startX + dx, y: startY + dy};
    coords.push(point);

    point = {x: startX + cSideLength, y: startY};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point); 

    const sides = {a: aSideLength, b: bSideLength, c: cSideLength}
    const angles = {a: AAngle, b: BAngle, c: CAngle};
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];
    drawTriangle(coords, sides, angles, vertexText, sideText);
  }

  function generateRightAngled() {
    property.current = "Derékszögű"
    let coords = [];
    let point

    let CAngle = 90;
    CAngle = CAngle * (Math.PI/180);

    //Get side lengths
    let aLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    let bLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    let cLength = Math.sqrt(Math.pow(aLength,2) + Math.pow(bLength,2))

    //Get side angles
    let BAngle = (Math.sin(CAngle) * bLength) / cLength;
    let AAngle = 180 - (BAngle* 180/Math.PI + CAngle * 180/Math.PI );;
    AAngle = AAngle * (Math.PI/180);
    
    //Determine positions
    let startX = -aLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    coords.push(point);

    point = {x: startX, y: -bLength};
    coords.push(point);

    point = {x: startX + aLength, y: startY};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point); 


    const sides = {a: aLength, b: bLength, c: cLength};
    const angles = { a: AAngle , b: BAngle, c: CAngle };
    const vertexText = ["C","A","B"]
    const sideText = ["b", "c", "a"]
    drawTriangle(coords, sides, angles, vertexText, sideText);
  }

  function generateObtuseAngled() {
    property.current = "Tompaszögű"
    let coords = [];
    let point;
    let dx,dy;

    //Generate A angle, b,c side lengths
    let AAngle = randomIntFromInterval(95, 150);
    AAngle = AAngle * (Math.PI/180);
    let bSideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    let cSideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);

    let aSideLength  =Math.sqrt(Math.pow(bSideLength,2) + Math.pow(cSideLength,2) - 2*bSideLength*cSideLength*Math.cos(AAngle));
    let BAngle = bSideLength * Math.sin(AAngle) / aSideLength;
    let CAngle = 180 - (AAngle * 180/Math.PI + BAngle* 180/Math.PI);
    CAngle = CAngle * Math.PI/180;

    //Calculate positions 
    let startX = -cSideLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    coords.push(point); 
    
    dx = bSideLength * Math.cos(AAngle);
    dy = -bSideLength * Math.sin(AAngle);
    point = {x: startX + dx, y: startY + dy};
    coords.push(point);

    point = {x: startX + cSideLength, y: startY};
    coords.push(point);

    point = {x: startX, y: startY};
    coords.push(point); 

    const sides = {a: aSideLength, b: bSideLength, c: cSideLength};
    const angles = { a: AAngle , b: BAngle, c: CAngle };
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];
    drawTriangle(coords, sides, angles, vertexText, sideText);
  }

  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  return (
    <div>
      <div className='canvasContainer'>
        <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}>
        </canvas> 
        <div>
          <div>
              <div className='generateBtn' onClick={generateScalene}>Általános</div>
              <div className='generateBtn' onClick={generateIsosceles}>Egyenlő szárú</div>
              <div className='generateBtn' onClick={generateEquilateral}>Szabályos</div>
          </div>
          <div>
              <div className='generateBtn' onClick={generateRightAngled}>Derékszögű</div>
              <div className='generateBtn' onClick={generateObtuseAngled}>Tompaszögű</div>
              <div className='generateBtn' onClick={generateAcuteAngled}>Hegyesszögű</div>
          </div>
       </div>
      </div>
    </div>
  )
}

export default Canvas

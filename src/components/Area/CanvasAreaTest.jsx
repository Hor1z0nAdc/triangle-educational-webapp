import React from 'react'
import { useRef, useEffect, useState } from 'react';
import Instruction from "../Instruction"
import AreaResults from "./AreaResults"

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 13;
const DRAW_LENGHT_WEIGHT = 15;
const NUM_OF_TASKS = 5;

const CanvasAreaTest = () => {
  const [taskNum, setTaskNum] = useState(1);
  const [disabled, setDisabled] = useState(true);
  const [correctNum, setCorrectNum] = useState(0);
  const [tasks, setTasks] = useState([]);
  const answerPeri = useRef(null);
  const answerArea = useRef(null);
  const [answer, setAnswer] = useState({peri: 0, area: 0});
  const currentTaskRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    //Canvas initialization
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "20px serif";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;

    //create task and store it
    let newTask = generateTask();
    currentTaskRef.current = newTask;
    drawTriangle();
}, [])

  function onNext() {
    let currentCorrectNum = correctNum;
    let isCorrect = false;
    let currentTask = currentTaskRef.current;

    //when the user gives correct answers
    if(currentTask.perimeter == answerPeri.current && currentTask.area == answerArea.current) {
      isCorrect = true;
      currentCorrectNum++;
    }                           

    //modify current task by user input
    currentTask["isCorrect"] = isCorrect;
    currentTask["userInput"] = { perimeter: answerPeri.current, area: answerArea.current };
    //save current task to array for future use
    setTasks(currentArray => [...currentArray, currentTask]);

    //get ready for next task
    setCorrectNum(currentCorrectNum);
    setTaskNum(taskNum + 1);

    if(taskNum <= 5) {
      let newTask = generateTask();
      currentTaskRef.current = newTask;

      answerArea.current = null;
      answerPeri.current = null;
      setAnswer({peri: 0, area: 0});
      setDisabled(true);
      drawTriangle();
    }
  }

  function onInputChange(e, type) {
    if(type == "perimeter") {
      answerPeri.current = parseInt(e.target.value);
      let answerTemp = {...answer}
      answerTemp["peri"] = answerPeri.current;
      setAnswer(answerTemp);
    }
    else {
      answerArea.current = parseInt(e.target.value);
      let answerTemp = {...answer}
      answerTemp["area"] = answerArea.current;
      setAnswer(answerTemp);
    }

    if(answerPeri.current && answerArea.current) {
      setDisabled(false);
    }
    else {
      setDisabled(true)
    }
  }

  function generateTask() {
    let newTriangleObject;
    let rndType = randomIntFromInterval(1,5);

    //20% chance for right angled
    if(rndType == 1) {
      newTriangleObject = generateRightAngled();
    }
    //40% chance for acute angled
    else if(rndType < 4) {
      newTriangleObject = generateAcuteAngled();
    }
    //40% chance for obtuse angles
    else {
      newTriangleObject = generateObtuseAngled();
    }

    return newTriangleObject;
  }

  function generateAcuteAngled() {
    let newObject;
    let newCoords = [];
    let point;
    let dx,dy;

    //Generate base side length and A,B angles
    let cSideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
    let AAngle = randomIntFromInterval(46,85);
    let BAngle = randomIntFromInterval(46,85);
    AAngle = AAngle * (Math.PI/180);
    BAngle = BAngle * (Math.PI/180);

    //Calculate C angle
    let CAngle = 180 - (AAngle * 180/Math.PI + BAngle * 180/Math.PI );
    CAngle = CAngle * (Math.PI/180);

    //Calculate a,b side lengths
    let aSideLength = (Math.sin(AAngle) * cSideLength) * Math.sin(CAngle);
    let bSideLength = (Math.sin(BAngle) * cSideLength) * Math.sin(CAngle);

    //Calculate positions 
    let startX = -cSideLength * 0.5;
    let startY = 0;
    point = {x: startX, y: startY};
    newCoords.push(point); 
    
    dx = bSideLength * Math.cos(AAngle);
    dy = -bSideLength * Math.sin(AAngle);
    point = {x: startX + dx, y: startY + dy};
    newCoords.push(point);

    point = {x: startX + cSideLength, y: startY};
    newCoords.push(point);

    point = {x: startX, y: startY};
    newCoords.push(point); 

    //convert radian to degree and define constants for drawing texts
    let AAngleDegree = AAngle * (180/Math.PI);
    let BAngleDegree = BAngle * (180/Math.PI);
    let CAngleDegree = CAngle * (180/Math.PI);
    const sides = {a: aSideLength, b: bSideLength, c: cSideLength}
    const angles = {a: AAngle, b: BAngle, c: CAngle};
    const vertexText = ["A","C","B"];
    const sideText = ["b", "a", "c"];

    //calculate triangle's parameters and create object for future use
    const perimeter = Math.round(getPerimeter(sides));
    const area = Math.round(getArea(sides));

    newObject = {coords: newCoords, sides, angles, vertexText, sideText, perimeter, area};
    return newObject;
}

function generateRightAngled() {
  let newObject;
  let newCoords = [];
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
  newCoords.push(point);

  point = {x: startX, y: -bLength};
  newCoords.push(point);

  point = {x: startX + aLength, y: startY};
  newCoords.push(point);

  point = {x: startX, y: startY};
  newCoords.push(point); 

  //convert radian to degree and define constants for drawing texts
  let AAngleDegree = AAngle * (180/Math.PI);
  let BAngleDegree = BAngle * (180/Math.PI);
  let CAngleDegree = CAngle * (180/Math.PI);
  const sides = {a: aLength, b: bLength, c: cLength};
  const angles = { a: AAngle , b: BAngle, c: CAngle };
  const vertexText = ["C","A","B"];
  const sideText = ["b", "c", "a"];

  //calculate triangle's parameters and create object for future use
  const perimeter = Math.round(getPerimeter(sides));
  const area = Math.round(getArea(sides));

  newObject = {coords: newCoords, sides, angles, vertexText, sideText, perimeter, area};
  return newObject;
}

function generateObtuseAngled() {
  let newCoords = [];
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
  newCoords.push(point); 
  
  dx = bSideLength * Math.cos(AAngle);
  dy = -bSideLength * Math.sin(AAngle);
  point = {x: startX + dx, y: startY + dy};
  newCoords.push(point);

  point = {x: startX + cSideLength, y: startY};
  newCoords.push(point);

  point = {x: startX, y: startY};
  newCoords.push(point); 

  const sides = {a: aSideLength, b: bSideLength, c: cSideLength};
  const angles = { a: AAngle , b: BAngle, c: CAngle };
  const vertexText = ["A","C","B"];
  const sideText = ["b", "a", "c"];

  //calculate triangle's parameters and create object for future use
  const perimeter = Math.round(getPerimeter(sides));
  const area = Math.round(getArea(sides));

  let newObject = {coords: newCoords, sides, angles, vertexText, sideText, perimeter, area};
  return newObject;
}

const drawTriangle = () => {
  const ctx = ctxRef.current;
  const triangleCoords = currentTaskRef.current.coords;
  const sides = currentTaskRef.current.sides;
  const angles = currentTaskRef.current.angles;
  const vertexText = currentTaskRef.current.vertexText;
  const sideText = currentTaskRef.current.sideText;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  const aText = "a = " +  sides.a.toFixed(1);
  const bText = "b = " +  sides.b.toFixed(1);
  const cText = "c = " +  sides.c.toFixed(1);
  const aAngleText = "A szög = " +  Math.round(angles.a * (180/Math.PI));
  const bAngleText = "B szög = " +  Math.round(angles.b * (180/Math.PI));
  const cAngleText = "C szög = " +  Math.round(angles.c * (180/Math.PI));
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

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getPerimeter(sides) {
  return sides.a + sides.b + sides.c;
}

function getArea(sides) {
  const altitudes = calcAltitudesLength(sides);
  const area = (sides.a * altitudes.Ha) / 2;

  return area;
}

function calcAltitudesLength(sides) {
  const aLength = sides.a;
  const bLength = sides.b;
  const cLength = sides.c;

  //Calculate lengths of altitudes using Heron's formula
  const semiperimeter = (aLength + bLength + cLength) / 2;
  const commonExpression = Math.sqrt(semiperimeter*(semiperimeter-aLength)*(semiperimeter-bLength)*(semiperimeter-cLength));
  const Ha = (2/aLength) * commonExpression;
  const Hb = (2/bLength) * commonExpression;
  const Hc = (2/cLength) * commonExpression;

  return {Ha,Hb,Hc};
}

  if(taskNum <= 5) {
    return (
    <div>
        <div style={{marginBottom: "20px"}}>
            <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
                <p>A fehér négyzet bal felső sarkában látható adatok alapján számold ki a  háromszög területés és kerületét.
                  Majd vidd be az adatokat kerekítve a kerület melletti mezőbe és a terület melleti mezőbe külön-külön.
                  A következp (utolsó feladatanál befejezés) gombra kattintva véglegesítheted a válaszodat. Ahhoz, hogy
                  továbbléphes, először meg kell adnod a kívánt, előbb is említett kerületet és területet.
                </p>
            </Instruction>
        </div>
        <h1 className='title'>{taskNum+"/"+NUM_OF_TASKS} feladat</h1>
      
        <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}></canvas>
        <div>
          <div style={{marginBottom: "15px"}}>
            <span className='sp'>Kerület</span>
            <input className='sideInput' type="number" value={answer.peri} min={0} max={200}
                    onChange={(e) =>{onInputChange(e, "perimeter")}}/>
            <span className='sp'>Terület</span>
            <input className='sideInput' type="number" value={answer.area} min={0} max={200}
                    onChange={(e) =>{onInputChange(e, "area")}}/>
          </div>
        </div>
        <button className='nextBtn' onClick={onNext} disabled={disabled}>{taskNum != NUM_OF_TASKS ? "Következő" : "Befejezés"}</button>
    </div>
    )
  }
  else {
      return (
        <div>
          <AreaResults tasks={tasks} correctNum={correctNum} />
        </div>
      )
  }
}

export default CanvasAreaTest
import React from 'react'
import { useRef, useEffect, useState } from 'react';
import Instruction from "../Instruction"
import Results from "./Results"

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 13;
const DRAW_LENGHT_WEIGHT = 15;
const NUM_OF_TASKS = 5;
const TASK_TEXTS = ["Határozd meg az alább látható háromszög átfogójának hosszát (c oldal) pitagorász tételével",
                    "Határozd meg az alább látható háromszög átfogójának hosszát (c oldal) pitagorász tételével",
                    "Határozd meg az alább látható háromszög egyik befogójának, az 'a' oldal hosszát pitagorász tételével",
                    "Határozd meg az alább látható háromszög egyik befogójának, a 'b' oldal hosszát pitagorász tételével",
                    "Határozd meg, hogy az alábbi háromszög milyen szögű pitagorász tételének alkalmazásával",
                    "Határozd meg, hogy az alábbi háromszög milyen szögű pitagorász tételének alkalmazásával",
                    "Határozd meg, hogy az alábbi háromszög milyen szögű pitagorász tételének alkalmazásával"]

const CanvasTest = () => {
  const [taskNum, setTaskNum] = useState(1);
  const [disabled, setDisabled] = useState(true);
  const [correctNum, setCorrectNum] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [userInput, setUserInput] = useState(null);
  const [text, setText] = useState(null);
  const typeRef = useRef(null);
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
    let type = typeRef.current;
    currentTaskRef.current = newTask;
    console.log(type)
    if(type == "side") {
      drawTriangle();
    }
    else if(type == "angle") {
      drawAngle();
    }
}, [])

  function onTypeChange(e) {
    const val = e.target.value
    setUserInput(e.target.value);
    if(val) {
      setDisabled(false);
    }
  }

  function onLengthChange(e) {
    const val = e.target.value
    setUserInput(e.target.value);
    if(val) {
      setDisabled(false);
    }
  }

  function onNext() {
    let currentCorrectNum = correctNum;
    let isCorrect = false;
    let currentTask = currentTaskRef.current;
    let answer = currentTask.answer.param;

    //when the user gives correct answers
    if(answer == userInput) {
      isCorrect = true;
      currentCorrectNum++;
    }

    //modify current task by user input
    currentTask["isCorrect"] = isCorrect;
    currentTask["userInput"] = userInput;
    //save current task to array for future use
    setTasks(currentArray => [...currentArray, currentTask]);

    //get ready for next task
    setCorrectNum(currentCorrectNum);
    setTaskNum(taskNum + 1);
    
    
    if(taskNum <= 5) {
      let newTask = generateTask();
      const type = typeRef.current;
      currentTaskRef.current = newTask;
      console.log(type)
      if(type == "side") {
        setUserInput(0);
        setDisabled(true);
        drawTriangle();
      }
      else if(type == "angle") {
        setDisabled(true);
        setUserInput(null);
        drawAngle();
      }
    }
  }

  function drawAngle() {
    const ctx = ctxRef.current;
    const task = currentTaskRef.current;
    const sides = task.sides;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const aText = "a = " + sides.a.toFixed(1);
    const bText = "b = " + sides.b.toFixed(1);
    const cText = "c = " +  sides.c.toFixed(1);
    ctx.fillText(aText, 10, 20);
    ctx.fillText(bText, 10, 50);
    ctx.fillText(cText, 10, 80);
  }

  const drawTriangle = () => {
    const task = currentTaskRef.current;
    const triangleCoords = task.coords;
    const sides = task.sides;
    const vertexText = task.vertexText;
    const sideText = task.sideText;
    const ctx = ctxRef.current;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    let aText, bText, cText;

    if(task.answer.type == "a") {
       aText = "a = ?";
       bText = "b = " +  sides.b.toFixed(1);
       cText = "c = " +  sides.c.toFixed(1);

    }
    else if(task.answer.type == "b") {
      aText = "a = " + sides.a.toFixed(1);
      bText = "b = ?";
      cText = "c = " +  sides.c.toFixed(1);
    }
    else if(task.answer.type == "c") {
      aText = "a = " + sides.a.toFixed(1);
      bText = "b = " +  sides.b.toFixed(1);
      cText = "c = ?";
    }

    ctx.fillText(aText, 10, 20);
    ctx.fillText(bText, 10, 50);
    ctx.fillText(cText, 10, 80);

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

  function generateTask() {
    let triangleObject;
    let taskType;
    const rndType = randomIntFromInterval(1,7);
    const taskText = TASK_TEXTS[rndType - 1];

    console.log(rndType)
    
    if(rndType <= 2) {
       triangleObject = generateRightAngled();
       triangleObject["answer"] = {param: triangleObject.sides.c.toFixed(1), type: "c"};
       taskType = "side";
    }
    else if(rndType == 3) {
      triangleObject = generateRightAngled();
      triangleObject["answer"] = {param: triangleObject.sides.a.toFixed(1), type: "a"};
      taskType = "side";
    }
    else if(rndType == 4) {
      triangleObject = generateRightAngled();
      triangleObject["answer"] = {param: triangleObject.sides.b.toFixed(1), type: "b"};
      taskType = "side";
    }
    else if(rndType == 5) {
      triangleObject = generateRightAngled();
      triangleObject["answer"] = {param: "derékszögű", type: "angle"};
      taskType = "angle";
    }
    else if(rndType == 6) {
      triangleObject = generateAcuteAngled();
      triangleObject["answer"] = {param: "hegyesszögű", type: "angle"};
      taskType = "angle";
    }
    else {
      triangleObject = generateObtuseAngled();
      triangleObject["answer"] = {param: "tompaszögű", type: "angle"};
      taskType = "angle";
    }
    
    console.log({taskType})
    triangleObject["text"] = taskText;
    setText(taskText);
    typeRef.current = taskType;
    return triangleObject;
  }

  function generateRightAngled() {
      let coords = [];
      let point

      let CAngle = 90;
      CAngle = CAngle * (Math.PI/180);

      //Get side lengths
      let aLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
      let bLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
      let cLength = Math.sqrt(Math.pow(aLength,2) + Math.pow(bLength,2))
      
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
      const vertexText = ["C","A","B"];
      const sideText = ["b", "c", "a"];

      const obj = {coords, sides, vertexText, sideText};
      return obj;
  }

  function generateAcuteAngled() {
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

    const obj = {coords, sides, vertexText, sideText};
    return obj;
  }

  function generateObtuseAngled() {
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

    const obj = {coords, sides, vertexText, sideText};
    return obj;
  }

  function randomIntFromInterval(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
  }

  if(taskNum <= 5) {
    return (
    <div>
        <div style={{marginBottom: "20px"}}>
            <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
                <p>A következő feliratú gombbal tudod véglegesíteni a megadott válaszaidat. Míg nem
                  adsz választ, nem léphetsz tovább a következő feladatra. A fehér négyzet felett
                  lévő szöveg határozza meg a jelenlegi feladatot. Az esetben, ha a fehér négyzeten
                  látható háromszög hiányzó oldal
                  hosszát kéri a feladat, egy tizedesjegy pontosságal add meg a választ ponttal elválasztva 
                  (például 10.5). Ha egész számra jön ki a megoldás, akkor is egy tizedesjegy 
                  pontossággal add meg a válaszodat (például 5.0).
                  Amennyiben a hármszöget a szögei alapján kell osztályoznod, a kör alakú gomb egyikére
                  kattintva teheted ezt meg. Ez esetben a fehér négyzet nem jeleníti meg a háromszöget, 
                  különben túl könnyű dolgod lenne. Mindkét esetben a pitagorászt tételét szükséges alkalmaznod.
                  A megoldáshoz szükséges paramétereket a fehér négyzet bal felső sarkában találod meg. 
                </p>
            </Instruction>
        </div>
        <h1 className='title'>{taskNum+"/"+NUM_OF_TASKS} feladat</h1>
        <h2>{text}</h2>
        <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}></canvas>
        <div>
          <div style={{marginBottom: "15px"}}>
              {typeRef.current == "side" && 
                <div>
                 <span className='sp'>hiányzó oldal hossza</span>
                 <input className='sideInput' value={userInput} type="number" min={MIN_LENGTH} max={MAX_LENGTH}
                       onChange={(e) =>{onLengthChange(e)}}/>
                </div>}
              {typeRef.current == "angle" &&
                <div>
                  <div className='radioContainer'>
                    <span style={{marginRight: "10px"}}>Derékszögű</span>
                    <input type="radio" name="angle" value="derékszögű" onChange={(e) => {onTypeChange(e, "angle")}} />
                  </div>
                  <div className='radioContainer'> 
                      <span style={{marginRight: "10px"}}>Tompaszögű</span>
                      <input type="radio" name="angle" value="tompaszögű" onChange={(e) => {onTypeChange(e, "angle")}} />
                  </div>
                  <div className='radioContainer'>
                      <span style={{marginRight: "10px"}}>Hegyesszögű</span>
                      <input type="radio" name="angle" value="hegyesszögű" onChange={(e) => {onTypeChange(e, "angle")}} />
                  </div>
                </div>
              }  
          </div>
        </div>
        <button className='nextBtn' onClick={onNext} disabled={disabled}>{taskNum != NUM_OF_TASKS ? "Következő" : "Befejezés"}</button>
    </div>
    )
  }
  else {
      return (
        <div>
          <Results tasks={tasks} correctNum={correctNum} />
        </div>
      )
  }
}

export default CanvasTest
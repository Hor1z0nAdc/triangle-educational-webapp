import React from 'react'
import Results from "./Results"
import Instruction from "../Instruction"
import { useRef, useEffect, useState } from 'react';

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const MIN_ANGLE = 40;
const MAX_ANGLE = 130;
const DRAW_LENGHT_WEIGHT = 15;
const NUM_OF_TASKS = 5;

const CanvasTest = () => {
    const [taskNum, setTaskNum] = useState(1);
    const [disabled, setDisabled] = useState(true);
    const [correctNum, setCorrectNum] = useState(0);
    const [tasks, setTasks] = useState([]);
    const currentTaskRef = useRef([]);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const sideClassRef = useRef(null);
    const angleClassRef = useRef(null); 
    const currentTypeRef = useRef(null);

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
    }, [])

    function onNext() {
        //variables for changing state
        let currentCorrectNum = correctNum;
        let isCorrect = false;
        const currentTask = currentTaskRef.current;
        const currentSideClass = currentTypeRef.current.sideClass;
        const currentAngleClass = currentTypeRef.current.angleClass;

        //when the user gives correct answers
        if(sideClassRef.current == currentSideClass && angleClassRef.current == currentAngleClass) {
            isCorrect = true;
            currentCorrectNum++;
        }

        //store the current task with it's type and user's answer 
        currentTask["isCorrect"] = isCorrect;
        //store the user given class input
        currentTask["userClass"] = {side: sideClassRef.current, angle: angleClassRef.current};
        setTasks(currentArray => [...currentArray, currentTask]);
        
        //get ready for next task
        setCorrectNum(currentCorrectNum);
        setTaskNum(taskNum + 1);

        if(taskNum <= 5) {
            let newTask = generateTask();
            currentTaskRef.current = newTask;
        }
    }

    function onTypeChange(e, type) {
        //Change user input class
        if(type == "side") {
            sideClassRef.current = e.target.value;
        }
        else {
            angleClassRef.current = e.target.value;
        }
        
        //when both class is given by user enable next button
        if(sideClassRef.current && angleClassRef.current) {
            setDisabled(false);
        }
    }

    //returns an object about newly generated task with it's properties
    function generateTask() {
        let newObject;
        let typeRnd = randomIntFromInterval(1, 4);

        switch(typeRnd) {
            case 1:
                newObject = generateScalene();
                break;
            case 2:
                newObject = generateEquilateral();
                break;
            case 3:
                newObject = generateIsosceles();
                break;    
            case 4:
                newObject = generateRightAngled();
                break;
        }

        newObject["class"] = currentTypeRef.current;
        newObject["id"] = Math.random() * 1000;
     
        return newObject;
    }

    function classify(AAngleDegree, BAngleDegree, CAngleDegree, aSide, bSide, cSide) {
        let angleClass, sideClass;

        //Determine angle class
        if(AAngleDegree > 90 || BAngleDegree > 90 || CAngleDegree > 90) {
            angleClass = "tompaszögű";
        }
        else if(AAngleDegree == 90 || BAngleDegree == 90 || CAngleDegree == 90) {
        angleClass = "derékszögű";
        }
        else {
        angleClass = "hegyesszögű";
        }

        //Determine side class
        if(aSide == bSide && aSide == cSide) {
        sideClass = "szabályos";
        }
        else if(aSide == bSide || aSide == cSide || bSide == cSide) {
        sideClass = "egyenlőszárú";
        }
        else {
        sideClass = "általános";
        }

        currentTypeRef.current = {sideClass: sideClass, angleClass: angleClass};
    }

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
    
        ctx.fillStyle = "black";
        ctx.font = "normal 20px serif";
        ctx.fillText(aText, 10, 30);
        ctx.fillText(bText, 10, 60);
        ctx.fillText(cText, 10, 90);
        ctx.fillText(aAngleText, 10, 120);
        ctx.fillText(bAngleText, 10, 150);
        ctx.fillText(cAngleText, 10, 180);
    
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
        let newObject;
        let newCoords = [];
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

        //determine class of triangle and create object for storing
        classify(AAngleDegree, BAngleDegree, CAngleDegree, aSideLength, bSideLength, cSideLength);
        newObject = {coords: newCoords, sides, angles, vertexText, sideText, class: currentTypeRef.current};

        drawTriangle(newCoords, sides, angles, vertexText, sideText);
        return newObject;
    }
    
    function generateEquilateral() {
        let newObject;
        let newCoords = [];
        let angle = 1.0471975512;
        let point;

        //generate sides length
        let sideLength = randomIntFromInterval(MIN_LENGTH, MAX_LENGTH);
        
        //Calculate positions 
        let startX = -sideLength * 0.5;
        let startY = 0;
        point = {x: startX, y: startY};
        newCoords.push(point); 

        let dx = sideLength * Math.cos(angle);
        let dy = -sideLength * Math.sin(angle);
        point = {x: startX + dx, y: startY + dy};
        newCoords.push(point);

        point = {x: startX + sideLength, y: 0};
        newCoords.push(point);

        point = {x: startX, y: startY};
        newCoords.push(point); 

        //convert radian to degree and define constants for drawing texts
        let AAngleDegree = 60;
        let BAngleDegree = 60;
        let CAngleDegree = 60;
        let sides = {a: sideLength, b: sideLength, c: sideLength}
        let angles = { a: 1.0471975512 , b: 1.0471975512, c: 1.0471975512 };
        const vertexText = ["A","C","B"];
        const sideText = ["b", "a", "c"];

        //determine class of triangle and create object for storing
        classify(AAngleDegree, BAngleDegree, CAngleDegree, sideLength, sideLength, sideLength);
        newObject = {coords: newCoords, sides, angles, vertexText, sideText, class: currentTypeRef.current};

        drawTriangle(newCoords, sides, angles, vertexText, sideText);
        return newObject;
    }

    function generateIsosceles() {
        let newObject;
        let newCoords = [];
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
        newCoords.push(point); 

        let dx = equalSidesLength * Math.cos(equalAngle);
        let dy = -equalSidesLength * Math.sin(equalAngle);
        point = {x: startX + dx, y: startY + dy};
        newCoords.push(point);

        point = {x: startX + cSideLength, y: 0};
        newCoords.push(point);

        point = {x: startX, y: startY};
        newCoords.push(point); 

        //convert radian to degree and define constants for drawing texts
        let AAngleDegree = equalAngle * (180/Math.PI);
        let BAngleDegree = equalAngle * (180/Math.PI);
        let CAngleDegree = CAngle * (180/Math.PI);
        let sides = {a: equalSidesLength, b: equalSidesLength, c: cSideLength}
        let angles = { a: equalAngle , b: equalAngle, c: CAngle };
        const vertexText = ["A","C","B"];
        const sideText = ["b", "a", "c"];

        //determine class of triangle and create object for storing
        classify(AAngleDegree, BAngleDegree, CAngleDegree, equalSidesLength, equalSidesLength, cSideLength);
        newObject = {coords: newCoords, sides, angles, vertexText, sideText, class: currentTypeRef.current};

        drawTriangle(newCoords, sides, angles, vertexText, sideText);
        return newObject;
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

        //determine class of triangle and create object for storing
        classify(AAngleDegree, BAngleDegree, CAngleDegree, aSideLength, bSideLength, cSideLength);
        newObject = {coords: newCoords, sides, angles, vertexText, sideText, class: currentTypeRef.current};

        drawTriangle(newCoords, sides, angles, vertexText, sideText);
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

        //determine class of triangle and create object for storing
        classify(AAngleDegree, BAngleDegree, CAngleDegree, aLength, bLength, cLength);
        newObject = {coords: newCoords, sides, angles, vertexText, sideText, class: currentTypeRef.current};

        drawTriangle(newCoords, sides, angles, vertexText, sideText);
        return newObject;
    }

    function generateObtuseAngled() {
        let newObject;
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

        //convert radian to degree and define constants for drawing texts
        let AAngleDegree = AAngle * (180/Math.PI);
        let BAngleDegree = BAngle * (180/Math.PI);
        let CAngleDegree = CAngle * (180/Math.PI);
        const sides = {a: aSideLength, b: bSideLength, c: cSideLength};
        const angles = { a: AAngle , b: BAngle, c: CAngle };
        const vertexText = ["A","C","B"];
        const sideText = ["b", "a", "c"];

        //determine class of triangle and create object for storing
        classify(AAngleDegree, BAngleDegree, CAngleDegree, aSideLength, bSideLength, cSideLength);
        newObject = {coords: newCoords, sides, angles, vertexText, sideText, class: currentTypeRef.current};

        drawTriangle(newCoords, sides, angles, vertexText, sideText);
        return newObject;
    }
    
    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    if(taskNum <= 5) {
        return (
        <div>
            <div style={{marginBottom: "20px"}}>
                <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
                    <p>A következő feliratú gombbal tudod véglegesíteni a megadott válaszaidat. Míg nem osztályozod
                        a megadott feladatban szereplő háromszöget, addíg nem léphetsz a következő feladatra.
                        Az oldalak hossza és szögek alapján külön-külön kell osztályoznod a háromszögeket. Ehhez 
                        kattints a kör alakú gombokra. kirajzolt háromszög alatti első sorban való gombra kattintással
                        a háromszöget az oldalainak hossza, míg a második sorban a szögei alapján tudod osztályozni.
                    </p>
                </Instruction>
            </div>
            <h1 className='title'>{taskNum+"/"+NUM_OF_TASKS} feladat</h1>
            <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}></canvas>
            <div>
                <div className='radioContainer'>
                    <span style={{marginRight: "10px"}}>Általános</span>
                    <input type="radio" name="side" value="általános" onChange={(e) => {onTypeChange(e, "side")}} />
                </div>
                <div className='radioContainer'>
                    <span style={{marginRight: "10px"}}>Egyenlő szárú</span>
                    <input type="radio" name="side" value="egyenlőszárú" onChange={(e) => {onTypeChange(e, "side")}} />
                </div>
                <div className='radioContainer'>
                    <span style={{marginRight: "10px"}}>Szabályos</span>
                    <input type="radio" name="side" value="szabályos" onChange={(e) => {onTypeChange(e, "side")}}/>
                </div>
            </div>
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
            <button className='nextBtn' onClick={onNext} disabled={disabled}>{taskNum != NUM_OF_TASKS ? "Következő" : "Befejezés"}</button>
        </div>
        )
    }
    else {
        return (
           <div>
                <Results tasks={tasks} correctNum={correctNum}/>
           </div>
        )
    }
}

export default CanvasTest
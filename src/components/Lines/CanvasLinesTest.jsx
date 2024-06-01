import React from 'react'
import Instruction from "../Instruction"
import LinesResults from "./LinesResults"
import { useRef, useEffect, useState } from 'react';

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const MIN_ANGLE = 40;
const MAX_ANGLE = 100;
const DRAW_LENGHT_WEIGHT = 20;
const DRAW_POINT_RADIUS = 4;
const NUM_OF_TASKS = 5;

const Type1 = "oldalfelező";
const Type2 = "szögfelező"
const Type3 = "magasságvonal"
const Type4 = "súlyvonal"
const Type5 = "köréírt"
const Type6 = "beírt"
const Type7 = "magasságpont"
const Type8 = "súlypont"
const TASK_TYPES = [Type1, Type2, Type3, Type4, Type5, Type6, Type7, Type8];
const TASK_TEXTS = ["A háromszög milyen vonalai láthatóak az alábbi kirajzolt háromszögön?",
                    "A háromszög milyen vonalai láthatóak az alábbi kirajzolt háromszögön?",
                    "A háromszög milyen vonalai láthatóak az alábbi kirajzolt háromszögön?",
                    "A háromszög milyen vonalai láthatóak az alábbi kirajzolt háromszögön?",
                    "A háromszög köré írt körének centrumát melyik nevezetes vonalak metszéspontja határozza meg?",
                    "A háromszög beírt körének centrumát melyik nevezetes vonalak metszéspontja határozza meg?",
                    "Az alábbi pontot a háromszög milyen vonalainak a metszéspontja határozza meg?",
                    "Az alábbi pontot a háromszög milyen vonalainak a metszéspontja határozza meg?"]

const CanvasLinesTest = () => {
  const [taskNum, setTaskNum] = useState(1);
  const [taskText, setTaskText] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [correctNum, setCorrectNum] = useState(0);
  const [tasks, setTasks] = useState([]);
  const currentTaskRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const answerRef = useRef(null);
  const usedTasks = useRef([]);

  useEffect(() => {
    //Canvas initialization
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "20px serif";
    ctx.lineWidth = 5;
    ctxRef.current = ctx;

    //create task and store it in ref
    generateTask();
}, [])

function onAnswerChange(e) {
  answerRef.current = e.target.value;
  if(answerRef.current) {
    setDisabled(false);
  }
}

function onNext() {
    //variables for changing state
    let currentCorrectNum = correctNum;
    let isCorrect = false;
    const currentTask = currentTaskRef.current;;
    const input = answerRef.current

    //when the user gives correct answers
    if(input == currentTask.answer) {
        isCorrect = true;
        currentCorrectNum++;
    }

    //store the current task with it's type and user's answer 
    currentTask["isCorrect"] = isCorrect;
    //store the user given class input
    currentTask["userInput"] = input;
    setTasks(currentArray => [...currentArray, currentTask]);
    
    //get ready for next task
    setCorrectNum(currentCorrectNum);
    setTaskNum(taskNum + 1);

    if(taskNum <= 5) {
        generateTask();
    }
  }

  function generateTask() {
    let triangleObject;
    let randomTaskTypeIndex;

    //get random index of unique task
    do {
      randomTaskTypeIndex = randomIntFromInterval(0, TASK_TYPES.length - 1);
    } while(usedTasks.current.includes(randomTaskTypeIndex));
    usedTasks.current.push(randomTaskTypeIndex)
    
    //Set type of current task
    const randomTaskType = TASK_TYPES[randomTaskTypeIndex];
    const taskText = TASK_TEXTS[randomTaskTypeIndex];
    setTaskText(taskText);

    //Generate triangle for current task
    let randomTypeOfTriangle = randomIntFromInterval(1, 5);
    if(randomTypeOfTriangle == 5) {
      triangleObject = generateRightAngled();
    }
    else {
      triangleObject = generateScalene();
    }
    //Save current task for drawing
    currentTaskRef.current = triangleObject;
    
    //calc and draw the task 
    switch(randomTaskTypeIndex) {
      case 0:
        triangleObject["answer"] = Type1;
        circumcenter();
        break;
      case 1:
        triangleObject["answer"] = Type2;
        bisectors();
        break;
      case 2:
        triangleObject["answer"] = Type3;
        orthocenter();
        break;
      case 3:
        triangleObject["answer"] = Type4;
        centroid();
        break;
      case 4:
        triangleObject["answer"] = Type1;
        circumcenter();
        break;
      case 5:
        triangleObject["answer"] = Type2;
        bisectors();
        break;
      case 6:
        triangleObject["answer"] = Type3;
        orthocenter();
        break;
      case 7:
        triangleObject["answer"] = Type4;
        centroid();
        break;
    }

    //Update current task by adding correct answer
    triangleObject["text"] = TASK_TEXTS[randomTaskTypeIndex];
    currentTaskRef.current = triangleObject;
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
    newObject = {coords: newCoords, sides, angles, vertexText, sideText};

    drawTriangle(newObject);
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
  newObject = {coords: newCoords, sides, angles, vertexText, sideText};

  drawTriangle(newObject);
  return newObject;
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

  let sides = {a: aSideLength, b: bSideLength, c: cSideLength}
  let angles = {a: AAngle, b: BAngle, c: CAngle};
  const vertexText = ["A","C","B"];
  const sideText = ["b", "a", "c"];
  newObject = {coords: newCoords, sides, angles, vertexText, sideText};

  drawTriangle(newObject);
  return newObject;
}

  const drawTriangle = (triangleObject) => {
    const ctx = ctxRef.current;
    const triangleCoords = triangleObject.coords;
    const sides = triangleObject.sides;
    const angles = triangleObject.angles;
    const vertexText = triangleObject.vertexText;
    const sideText = triangleObject.sideText;

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

      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
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

  function circumcenter() {
    const ctx = ctxRef.current;
    const coords = currentTaskRef.current.coords
    let currentPoint, nextPoint;
    let halfX, halfY;
    let halfPoints = [];

    drawTriangle(currentTaskRef.current);
    //iterate through traingle vertices
    for(let i = 0; i < 3; i++) {
      currentPoint = coords[i];
      nextPoint = coords[i+1];

      //calc the half point between two vertices
      halfX = (currentPoint.x + nextPoint.x) / 2;
      halfY = (currentPoint.y + nextPoint.y) / 2;
      halfPoints.push({x: halfX, y: halfY});

      //draw half points
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.lineWidth = 3;
      ctx.arc(halfX * DRAW_LENGHT_WEIGHT, halfY * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }

    //change vertex objects to array for function
    let P = [];
    let Q = [];
    let R = [];
    P.push(coords[0].x);
    P.push(coords[0].y);
    Q.push(coords[1].x);
    Q.push(coords[1].y);
    R.push(coords[2].x);
    R.push(coords[2].y);

    //get the circumcenter in object form
    let circumcenterPoint =  findCircumCenter(P, Q, R);

    
    //get distance from vertices to circumcenter
    let distance = distanceFromPoint(coords[0], circumcenterPoint);
    
    //draw circle
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.arc(circumcenterPoint.x * DRAW_LENGHT_WEIGHT, circumcenterPoint.y * DRAW_LENGHT_WEIGHT, distance * DRAW_LENGHT_WEIGHT, 0, 2 * Math.PI);
    ctx.stroke();
    
    //draw lines
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    for(let i = 0; i < 3; i++) {
      const startP = {x: halfPoints[i].x * DRAW_LENGHT_WEIGHT, y: halfPoints[i].y * DRAW_LENGHT_WEIGHT};
      const endP = {x: circumcenterPoint.x * DRAW_LENGHT_WEIGHT, y: circumcenterPoint.y * DRAW_LENGHT_WEIGHT};
      const newEndP = getLineXY(startP, endP, 2)
      
      ctx.beginPath();
      ctx.moveTo(halfPoints[i].x * DRAW_LENGHT_WEIGHT, halfPoints[i].y * DRAW_LENGHT_WEIGHT);
      ctx.lineTo(newEndP.x, newEndP.y);
      ctx.stroke();
    }
    
    //draw circumcenter
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "blue";
    ctx.lineWidth = 3;
    ctx.arc(circumcenterPoint.x * DRAW_LENGHT_WEIGHT, circumcenterPoint.y * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    
    //draw text
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    let distanceText = "Köré írt kör sugara = " + distance.toFixed(1);
    ctx.fillStyle = "black";
    ctx.fillText(distanceText, 10, 210);
    
    ctx.translate(CANVAS_W * 0.5, CANVAS_H * 0.8);
  }
  
  function orthocenter() {
    const ctx = ctxRef.current;
    const coords = currentTaskRef.current.coords;
    const angles = currentTaskRef.current.angles;
    let AM, BM, CM;

    //convert rad to deg
    let AAngle = angles.a * (180/Math.PI);
    let BAngle = angles.a * (180/Math.PI);
    let CAngle = angles.a * (180/Math.PI);
    
    drawTriangle(currentTaskRef.current);
    //calculate H lengths
    const altitudesLength = calcAltitudesLength();

    //calculate orthocenter points
    const centerX = (coords[0].x * Math.tan(angles.a) + coords[1].x * Math.tan(angles.c) + coords[2].x * Math.tan(angles.b)) / (Math.tan(angles.a) + Math.tan(angles.b) + Math.tan(angles.c));
    const centerY = (coords[0].y * Math.tan(angles.a) + coords[1].y * Math.tan(angles.c) + coords[2].y * Math.tan(angles.b)) / (Math.tan(angles.a) + Math.tan(angles.b) + Math.tan(angles.c));
    const center = {x: centerX, y: centerY};

    //Preparation for calculating intersection points
    AM = getLineXY(coords[0], center, 4);
    CM = getLineXY(coords[1], center, 4);
    BM = getLineXY(coords[2], center, 4);

    //calculating intersection points
    const intersectPointAM = calculateIntersection(coords[1], coords[2], coords[0], AM);
    const intersectPointCM = calculateIntersection(coords[0], coords[2], coords[1], CM);
    const intersectPointBM = calculateIntersection(coords[0], coords[1], coords[2], BM);
    const intersectPoints = [intersectPointAM, intersectPointCM, intersectPointBM];

    //draw text
    let HaText = "Ha = " + altitudesLength.Ha.toFixed(1);
    let HbText = "Hb = " + altitudesLength.Hb.toFixed(1);
    let HcText = "Hc = " + altitudesLength.Hc.toFixed(1);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "black";
    ctx.fillText(HaText, 10, 210);
    ctx.fillText(HbText, 10, 240);
    ctx.fillText(HcText, 10, 270);
    ctx.translate(CANVAS_W * 0.5, CANVAS_H * 0.8);

    //draw altitudes and it's points
    let startX, startY, endX,endY;
    for(let i = 0; i < 3; i++) {
      startX = coords[i].x * DRAW_LENGHT_WEIGHT;
      startY = coords[i].y * DRAW_LENGHT_WEIGHT;
      endX = intersectPoints[i].x * DRAW_LENGHT_WEIGHT;
      endY = intersectPoints[i].y * DRAW_LENGHT_WEIGHT;

      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.arc(startX, startY, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(endX, endY, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
    }

    //draw intersection point
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.arc(centerX * DRAW_LENGHT_WEIGHT, centerY* DRAW_LENGHT_WEIGHT, 4, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  function bisectors() {
    const ctx = ctxRef.current;
    const task = currentTaskRef.current;
    const coords = task.coords;
    const sides = task.sides;
    const aLength = sides.a;
    const bLength = sides.b;
    const cLength = sides.c;
    const A = coords[0];
    const B = coords[2];
    const C = coords[1];

    ctx.lineWidth = 3;
    drawTriangle(currentTaskRef.current);

    //incircle parameters
    const perimeter = aLength + bLength + cLength;
    const semiperimeter = perimeter / 2;
    const radius = Math.sqrt(((semiperimeter-aLength)*(semiperimeter-bLength)*(semiperimeter-cLength)) / semiperimeter);
    const centerX = (A.x * aLength + B.x * bLength + C.x * cLength) / perimeter;
    const centerY = (A.y * aLength + B.y * bLength + C.y * cLength) / perimeter;
    
    //draw incircle
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.arc(centerX * DRAW_LENGHT_WEIGHT, centerY * DRAW_LENGHT_WEIGHT, radius * DRAW_LENGHT_WEIGHT, 0, 2 * Math.PI);
    ctx.stroke();

    //draw bisectors
    let endPoint;
    let startPoint;
    for(let i = 0; i < 3; i++) {
      startPoint = coords[i];
      endPoint = getLineXY(startPoint, {x: centerX, y: centerY}, 1.5);

      //draw bisector starting points
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.lineWidth = 1;
      ctx.arc(startPoint.x * DRAW_LENGHT_WEIGHT, startPoint.y * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      //draw bisector lines
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.moveTo(startPoint.x * DRAW_LENGHT_WEIGHT, startPoint.y * DRAW_LENGHT_WEIGHT);
      ctx.lineTo(endPoint.x * DRAW_LENGHT_WEIGHT, endPoint.y * DRAW_LENGHT_WEIGHT);
      ctx.stroke();
    }

    //draw intersection of the angle biscetors
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "blue";
    ctx.arc(centerX * DRAW_LENGHT_WEIGHT, centerY * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  function centroid() {
    const ctx = ctxRef.current;
    let coords = currentTaskRef.current.coords;
    let toVertex;
    let currentPoint, nextPoint;
    let halfX, halfY;
    let halfPoints = [];

    drawTriangle(currentTaskRef.current);
    
    for(let i = 0; i < 3; i++) {
      currentPoint = coords[i];
      nextPoint = coords[i+1];

      switch(i) {
        case 0:
          toVertex = 2;
          break;
        case 1:
          toVertex = 0;
          break;
        case 2:
          toVertex = 1;
          break;
      }

      //calc the half point between two vertices
      halfX = (currentPoint.x + nextPoint.x) / 2;
      halfY = (currentPoint.y + nextPoint.y) / 2;
      halfPoints.push({x: halfX, y: halfY});

      //draw half points
      ctx.beginPath();
      ctx.strokeStyle = "red";
      ctx.fillStyle = "red";
      ctx.lineWidth = 3;
      ctx.arc(halfX * DRAW_LENGHT_WEIGHT, halfY * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(coords[toVertex].x * DRAW_LENGHT_WEIGHT, coords[toVertex].y * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();

      //draw medians
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.moveTo(halfX * DRAW_LENGHT_WEIGHT, halfY * DRAW_LENGHT_WEIGHT);
      ctx.lineTo(coords[toVertex].x * DRAW_LENGHT_WEIGHT, coords[toVertex].y * DRAW_LENGHT_WEIGHT);
      ctx.stroke();

      //calc centroid point
      const centroidX = (coords[0].x + coords[1].x + coords[2].x) / 3;
      const centroidY = (coords[0].y + coords[1].y + coords[2].y) / 3;

      //draw centroid point
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      ctx.fillStyle = "blue";
      ctx.arc(centroidX * DRAW_LENGHT_WEIGHT, centroidY * DRAW_LENGHT_WEIGHT, DRAW_POINT_RADIUS, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
  }

  function calculateIntersection(p1, p2, p3, p4) {

    var c2x = p3.x - p4.x; // (x3 - x4)
  	var c3x = p1.x - p2.x; // (x1 - x2)
  	var c2y = p3.y - p4.y; // (y3 - y4)
  	var c3y = p1.y - p2.y; // (y1 - y2)
  
  	// down part of intersection point formula
  	var d  = c3x * c2y - c3y * c2x;
  
  	if (d == 0) {
    	return null;
    }
  
  	// upper part of intersection point formula
  	var u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
  	var u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)
  
  	// intersection point formula
  	
  	var px = (u1 * c2x - c3x * u4) / d;
  	var py = (u1 * c2y - c3y * u4) / d;
  	
  	var p = { x: px, y: py };
  
  	return p;
}

  // Function to find the line given two points
function lineFromPoints(P, Q)
{
    let a = Q[1] - P[1];
    let b = P[0] - Q[0];
    let c = a*(P[0])+ b*(P[1]);
    return [a, b, c];
}
 
// Function which converts the input line to its
// perpendicular bisector. It also inputs the points
// whose mid-point lies on the bisector
function perpendicularBisectorFromLine(P, Q, a, b, c)
{
    let mid_point = [(P[0] + Q[0])/2, (P[1] + Q[1])/2];
 
    // c = -bx + ay
    c = -b*(mid_point[0]) + a*(mid_point[1]);
 
    let temp = a;
    a = -b;
    b = temp;
    return [a, b, c];
}
 
// Returns the intersection point of two lines
function lineLineIntersection(a1, b1, c1, a2, b2, c2)
{
    let determinant = a1*b2 - a2*b1;
    if (determinant == 0)
    {
        // The lines are parallel. This is simplified
        // by returning a pair of FLT_MAX
        return  [(10.0)**19, (10.0)**19];
    }
 
    else
    {
        let x = (b2*c1 - b1*c2)/determinant;
        let y = (a1*c2 - a2*c1)/determinant;
        return [x, y];
    }
}
 
function findCircumCenter(P, Q, R)
{
    // Line PQ is represented as ax + by = c
    let PQ_line = lineFromPoints(P, Q);
    let a = PQ_line[0];
    let b = PQ_line[1];
    let c = PQ_line[2];
    
    // Line QR is represented as ex + fy = g
    let QR_line = lineFromPoints(Q, R);
    let e = QR_line[0];
    let f = QR_line[1];
    let g = QR_line[2];
     
    // Converting lines PQ and QR to perpendicular
    // vbisectors. After this, L = ax + by = c
    // M = ex + fy = g
    let PQ_perpendicular = perpendicularBisectorFromLine(P, Q, a, b, c);
    a = PQ_perpendicular[0];
    b = PQ_perpendicular[1];
    c = PQ_perpendicular[2];
     
    let QR_perpendicular = perpendicularBisectorFromLine(Q, R, e, f, g);
    e = QR_perpendicular[0];
    f = QR_perpendicular[1];
    g = QR_perpendicular[2];
     
    // The point of intersection of L and M gives
    // the circumcenter
    let circumcenter = lineLineIntersection(a, b, c, e, f, g);
 
    if (circumcenter[0] == (10.0)**19 && circumcenter[1] == (10.0)**19){

    }
    else{
        return {x: circumcenter[0], y: circumcenter[1]};
    }
}

function distanceFromPoint(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function getLineXY(startPt, endPt, extent) {
  var dx = endPt.x - startPt.x;
  var dy = endPt.y - startPt.y;
  var X = startPt.x + dx * extent;
  var Y = startPt.y + dy * extent;
  return ({
      x: X,
      y: Y
  });
}

function calcAltitudesLength() {
  const aLength = parseFloat(currentTaskRef.current.sides.a);
  const bLength = parseFloat(currentTaskRef.current.sides.b);
  const cLength = parseFloat(currentTaskRef.current.sides.c);

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
                    <p>A következő feliratú gombbal tudod véglegesíteni a megadott válaszaidat. Míg nem osztályozod
                        a megadott feladatban szereplő háromszöget, addíg nem léphetsz a következő feladatra.
                        Az oldalak hossza és szögek alapján külön-külön kell osztályoznod a háromszögeket. Ehhez 
                        kattints a kör alakú gombokra. kirajzolt háromszög alatti első sorban való gombra kattintással
                        a háromszöget az oldalainak hossza, míg a második sorban a szögei alapján tudod osztályozni.
                    </p>
                </Instruction>
            </div>
            <h1 className='title'>{taskNum+"/"+NUM_OF_TASKS} feladat</h1>
            <h2>{taskText}</h2>
            <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}></canvas>
            <div>
              <div style={{marginBottom: "15px"}}>
                  <div className='radioContainer'>
                    <label style={{marginRight: "10px"}}>Oldalfelező merőleges</label>
                    <input type="radio" value={Type1} name='inputType' onChange={onAnswerChange}/>
                  </div>
                  <div className='radioContainer'>
                    <label style={{marginRight: "10px"}}>Szögfelező</label>
                    <input type="radio" value={Type2} name='inputType' onChange={onAnswerChange}/>
                  </div>
                  <div className='radioContainer'>
                    <label style={{marginRight: "10px"}}>Magasságvonal </label>
                    <input type="radio" value={Type3} name='inputType' onChange={onAnswerChange}/>
                  </div>
                  <div className='radioContainer'>
                    <label style={{marginRight: "10px"}}>Súlyvonal </label>
                    <input type="radio" value={Type4} name='inputType' onChange={onAnswerChange}/>
                  </div>
              </div>
            </div>
            <button className='nextBtn' onClick={onNext} disabled={disabled}>{taskNum != NUM_OF_TASKS ? "Következő" : "Befejezés"}</button>
        </div>
        )
    }
    else {
        return (
           <div>
            <LinesResults tasks={tasks} correctNum={correctNum} />
           </div>
        )
    }
}

export default CanvasLinesTest

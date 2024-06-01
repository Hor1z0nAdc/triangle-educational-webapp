import React from 'react'
import { useRef, useEffect, useState } from 'react'

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const DRAW_LENGHT_WEIGHT = 20;
const DRAW_POINT_RADIUS = 4;
const errorTexts = ["Az 'a' oldal hossza túl nagy a 'b' és 'c' oldahoz viszonyítva",
                    "Az 'b' oldal hossza túl nagy az 'a' és 'c' oldahoz viszonyítva",
                    "Az 'c' oldal hossza túl nagy az 'a' és 'b' oldahoz viszonyítva",
                    "A megadott háromszög legalább egyik oldala túl nagy",
                    "A megadott háromszög legalább egyik oldala túl kicsi",
                    "A megadott szög túl nagy",
                    "A megadott szög túl kicsi",
                    "A megadott szögek öszzege túl nagy"]

const CanvasLines = () => {
  const [inputType, setInputType] = useState("oldalak");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [canDrawLines, setCanDrawLines] = useState(false);
  const triangleObjectRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const aLengthRef = useRef(null);
  const bLengthRef = useRef(null);
  const cLengthRef = useRef(null);
  const AAngleRef = useRef(null);
  const CAngleRef = useRef(null);
  const coordsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "20px serif";
    ctx.lineWidth = 3;
    ctxRef.current = ctx;
  }, [])

  function onOptionChange(e) {
    const ctx = ctxRef.current;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    setInputType(e.target.value);
    setCanDrawLines(false);
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
        setCanDrawLines(false);
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

  function circumcenter() {
    const ctx = ctxRef.current;
    const coords = coordsRef.current
    let currentPoint, nextPoint;
    let halfX, halfY;
    let halfPoints = [];

    drawTriangle();
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
    const coords = triangleObjectRef.current.coords;
    const angles = triangleObjectRef.current.angles
    let AM, BM, CM;

    //convert rad to deg
    let AAngle = angles.a * (180/Math.PI);
    let BAngle = angles.a * (180/Math.PI);
    let CAngle = angles.a * (180/Math.PI);
    
    drawTriangle();
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
    const coords = triangleObjectRef.current.coords;
    const aLength = parseFloat(aLengthRef.current);
    const bLength = parseFloat(bLengthRef.current);
    const cLength = parseFloat(cLengthRef.current);
    const A = coords[0];
    const B = coords[2];
    const C = coords[1];

    ctx.lineWidth = 3;
    drawTriangle();

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
    let coords = coordsRef.current;
    let toVertex;
    let currentPoint, nextPoint;
    let halfX, halfY;
    let halfPoints = [];

    drawTriangle();
    
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

  function calcAltitudesLength() {
    const aLength = parseFloat(aLengthRef.current);
    const bLength = parseFloat(bLengthRef.current);
    const cLength = parseFloat(cLengthRef.current);

    //Calculate lengths of altitudes using Heron's formula
    const semiperimeter = (aLength + bLength + cLength) / 2;
    const commonExpression = Math.sqrt(semiperimeter*(semiperimeter-aLength)*(semiperimeter-bLength)*(semiperimeter-cLength));
    const Ha = (2/aLength) * commonExpression;
    const Hb = (2/bLength) * commonExpression;
    const Hc = (2/cLength) * commonExpression;

    return {Ha,Hb,Hc};
  }

  function calcPerpendicularSlope(p1, p2) {
    const slopeP = (p2.y - p1.y) / (p2.x - p1.x);
    const perpendicularSlope = -1/slopeP;

    return perpendicularSlope;
  }

  function generateTriangle() {
    let point;
    let coords = [];
    let aSide, bSide, cSide;
    let AAngleDegree, BAngleDegree, CAngleDegree;
    let AAngleRadian, BAngleRadian, CAngleRadian;

    let startX, startY, dx, dy;
    let isASmaller, isBSmaller, isCSmaller;
    let isError = false;

    if(inputType == "oldalak") {
        aSide = parseFloat(aLengthRef.current);
        bSide = parseFloat(bLengthRef.current);
        cSide = parseFloat(cLengthRef.current); 

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

    setCanDrawLines(true);
    coordsRef.current = coords;
    triangleObjectRef.current = {coords, sides, angles, vertexText, sideText};
    drawTriangle();
  }

  const drawTriangle = () => {
    const ctx = ctxRef.current;
    const triangleCoords = triangleObjectRef.current.coords;
    const sides = triangleObjectRef.current.sides; 
    const angles = triangleObjectRef.current.angles;
    const vertexText = triangleObjectRef.current.vertexText;
    const sideText = triangleObjectRef.current.sideText;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const aText = "a = " +  sides.a.toFixed(1);
    const bText = "b = " +  sides.b.toFixed(1);
    const cText = "c = " +  sides.c.toFixed(1);
    const aAngleText = "A szög = " +  Math.round(angles.a * (180/Math.PI));
    const bAngleText = "B szög = " +  Math.round(angles.b * (180/Math.PI));
    const cAngleText = "C szög = " +  Math.round(angles.c * (180/Math.PI));

    ctx.lineWidth = 3;
    ctx.fillStyle = "black";
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


  function calculateIntersection(p1, p2, p3, p4) {

    var c2x = p3.x - p4.x; // (x3 - x4)
  	var c3x = p1.x - p2.x; // (x1 - x2)
  	var c2y = p3.y - p4.y; // (y3 - y4)
  	var c3y = p1.y - p2.y; // (y1 - y2)
  
  	// down part of intersection point formula
  	var d  = c3x * c2y - c3y * c2x;
  
  	if (d == 0) {
    	throw new Error('Number of intersection points is zero or infinity.');
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
              <div style={{marginTop: "20px"}}>
                <button className='generateBtn' onClick={circumcenter} disabled={!canDrawLines}>Oldalfelező</button>
                <button className='generateBtn' onClick={bisectors} disabled={!canDrawLines}>Szögfelező</button>
                <button className='generateBtn' onClick={orthocenter} disabled={!canDrawLines}>Magasságvonal</button>
                <button className='generateBtn' onClick={centroid} disabled={!canDrawLines}>Súlyvonal</button>
              </div>
            </div>
          </div>
        </div>
  )
}

export default CanvasLines
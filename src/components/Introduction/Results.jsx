import React from 'react'
import { useRef, useEffect, useState } from 'react';

const DRAW_LENGHT_WEIGHT = 15;
const CANVAS_W = 500;
const CANVAS_H = 500;

const Results = ({tasks, correctNum}) => {
  const canvasListRef = useRef([]);
  const ctxListRef = useRef([]);
  canvasListRef.current = [];
  ctxListRef.current = [];

  useEffect(() => {
    //Canvas initialization - create ctx ref for every canvas
    const canvasList = canvasListRef.current;
    canvasList.forEach(canvas => {
      const ctx = canvas.getContext("2d");
      ctx.font = "20px serif";
      ctx.lineWidth = 5;
      addToCtxRefs(ctx);
  });

    //draw triangles
    ctxListRef.current.forEach((ctx, index) => {
      let triangleObject = tasks[index];
      drawTriangle(triangleObject, ctx)
    })
  }, [])

  function addToCanvasRefs(el) {
    if(el && !canvasListRef.current.includes(el)) {
      canvasListRef.current.push(el);
    }
  }

  function addToCtxRefs(el) {
    if(el && !ctxListRef.current.includes(el)) {
      ctxListRef.current.push(el);
    }
  }

  const drawTriangle = (triangleObject, ctx) => {
    const triangleCoords = triangleObject.coords;
    const sides = triangleObject.sides;
    const angles = triangleObject.angles;
    const vertexText = triangleObject.vertexText;
    const sideText = triangleObject.sideText;

    //clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    //Text to draw
    const aText = "a = " +  sides.a.toFixed(1);
    const bText = "b = " +  sides.b.toFixed(1);
    const cText = "c = " +  sides.c.toFixed(1);
    const aAngleText = "A szög = " +  Math.round(angles.a * (180/Math.PI));
    const bAngleText = "B szög = " +  Math.round(angles.b * (180/Math.PI));
    const cAngleText = "C szög = " +  Math.round(angles.c * (180/Math.PI));

    //Drawing texts
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

    //determine position difference for drawing
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
    <div className="resultContainer">
      <h1>Helyes megoldások száma {correctNum}/5</h1>
      {tasks.map((element) => (
        <div key={element.id} className={element.isCorrect? "correct" : "wrong"}>
          <div>
          
            <div>
              <span>Helyes megoldás: </span>
              <span>{element.class.sideClass},</span>
              <span>{element.class.angleClass}</span>
            </div>
            <div>
              <span>Megadott megoldás: </span>
              <span>{element.userClass.side},</span>
              <span>{element.userClass.angle}</span>
            </div>
          </div>
          <canvas className='canvas' style={{margin: "30px 15px"}} width={CANVAS_W} height={CANVAS_H} ref={addToCanvasRefs}></canvas>
        </div>))}
    </div>
  )
}

export default Results
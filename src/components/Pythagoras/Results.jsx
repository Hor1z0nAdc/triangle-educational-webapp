import React from 'react'
import { useRef, useEffect } from 'react';

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

      if(triangleObject.answer.type == "side") {
        drawTriangle(triangleObject, ctx)
      }
      else {
        drawAngle(triangleObject,ctx);
      }
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

  function drawAngle(obj, ctx) {
    const sides = obj.sides;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const aText = "a = " + sides.a.toFixed(1);
    const bText = "b = " + sides.b.toFixed(1);
    const cText = "c = " +  sides.c.toFixed(1);
    ctx.fillText(aText, 10, 20);
    ctx.fillText(bText, 10, 50);
    ctx.fillText(cText, 10, 80);
  }

  const drawTriangle = (obj, ctx) => {
    const triangleCoords = obj.coords;
    const sides = obj.sides;
    const vertexText = obj.vertexText;
    const sideText = obj.sideText;
    const type = obj.answer.type;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    let aText, bText, cText;

    if(type == "a") {
       aText = "a = ?";
       bText = "b = " +  sides.b.toFixed(1);
       cText = "c = " +  sides.c.toFixed(1);

    }
    else if(type == "b") {
      aText = "a = " + sides.a.toFixed(1);
      bText = "b = ?";
      cText = "c = " +  sides.c.toFixed(1);
    }
    else if(type == "c") {
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

  return (
    <div className="resultContainer">
    <h1>Helyes megoldások száma {correctNum}/5</h1>
    {tasks.map((element) => (
      <div key={element.id} className={element.isCorrect? "correct" : "wrong"}>
        <div>
          <div className='taskText'>
            <span>{element.text}</span>
          </div>
          <div>
            <span>Helyes megoldás: </span>
            <span>{element.answer.param}</span>
          </div>
          <div>
            <span>Megadott megoldás: </span>
            <span>{element.userInput}</span>
          </div>
        </div>
        <canvas className='canvas' style={{margin: "30px 15px"}} width={CANVAS_W} height={CANVAS_H} ref={addToCanvasRefs}></canvas>
      </div>))}
  </div>
  )
}

export default Results
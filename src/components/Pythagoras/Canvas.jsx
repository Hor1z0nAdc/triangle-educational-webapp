import React from 'react'
import { useRef, useEffect } from 'react'

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const DRAW_LENGHT_WEIGHT = 15;

const Canvas = () => {
    const triangleObjectRef = useRef(null);
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.font = "20px serif";
        ctx.lineWidth = 5;
        ctxRef.current = ctx;
    }, [])

    const drawTriangle = (triangleCoords, sides, vertexText, sideText) => {
        const ctx = ctxRef.current;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

        const aSquare = Math.pow(sides.a, 2);
        const bSquare = Math.pow(sides.b, 2);
        const cSquare = Math.pow(sides.c, 2);
        const sum = aSquare + bSquare;
    
        const aText = "a = " +  sides.a.toFixed(1);
        const bText = "b = " +  sides.b.toFixed(1);
        const cText = "c = " +  sides.c.toFixed(1);
        const equationText1 = `c\u00b2 = ${sides.a}\u00b2 + ${sides.b}\u00b2`;
        const equationText2 = `c\u00b2 = ${aSquare} + ${bSquare}`;
        const equationText3 = `c\u00b2 = ${sum}`;
        const equationText4 =`c = \u221A${sum}`;
        ctx.fillText(aText, 10, 20);
        ctx.fillText(bText, 10, 50);
        ctx.fillText(equationText1, 10, 80);
        ctx.fillText(equationText2, 10, 110);
        ctx.fillText(equationText3, 10, 140);
        ctx.fillText(equationText4, 10, 170);
        ctx.fillText(cText, 10, 200);
    
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
    
        triangleObjectRef.current = {sides};
        drawTriangle(coords, sides, vertexText, sideText);
      }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    return (
        <div>
            <div className='canvasContainer'>
                <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}></canvas>
                <div className='generateBtn' onClick={generateRightAngled}>Derékszögű generálás</div>
            </div> 
        </div>
    )
}

export default Canvas
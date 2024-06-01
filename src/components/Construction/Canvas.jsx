import React from 'react';
import { useRef, useEffect, useState } from 'react'

const CANVAS_W = 500;
const CANVAS_H = 500;
const MIN_LENGTH = 3;
const MAX_LENGTH = 18;
const MIN_ANGLE = 40;
const MAX_ANGLE = 100;
const DRAW_LENGHT_WEIGHT = 15;

const Canvas = () => {
    const [type, setType] = useState("sides");
    const typeRef = useRef("sides");
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const iterationRef = useRef(1);
    const triangleObjectRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.font = "20px serif";
        ctx.lineWidth = "3.5";
        ctxRef.current = ctx;

        let obj = generateScalene();
        draw(obj);
      }, [])

    function onOptionChange(e) {
        typeRef.current = e.target.value;
        setType(typeRef.current);
        iterationRef.current = 1;
        let obj = generateScalene();
        draw(obj);
    }

    function draw(obj) {
        const ctx = ctxRef.current;
        const type = typeRef.current;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.fillStyle = "black";

        if(type == "sides") {
            ctx.fillText("a = " + obj.sides.a.toFixed(1), 10, 20);
            ctx.fillText("b = " + obj.sides.b.toFixed(1), 10, 50);
            ctx.fillText("c = " + obj.sides.c.toFixed(1), 10, 80);
        }
        else if(type == "sidesAngle") {
            let angle = obj.angles.a * (180/Math.PI);

            ctx.fillText("b = " + obj.sides.b.toFixed(1), 10, 20);
            ctx.fillText("c = " + obj.sides.c.toFixed(1), 10, 50);
            ctx.fillText("A szög = " + angle.toFixed(1), 10, 80);
        }
        else {
            let AAngle = obj.angles.a * (180/Math.PI);
            let BAngle = obj.angles.b * (180/Math.PI);

            ctx.fillText("c = " + obj.sides.c.toFixed(1), 10, 20);
            ctx.fillText("A szög = " + AAngle.toFixed(1), 10, 50);
            ctx.fillText("B szög " + BAngle.toFixed(1), 10, 80);
        }
        ctx.translate(CANVAS_W * 0.5, CANVAS_H * 0.8);

    }

    function sidesOnly() {
        let i = iterationRef.current;
        const coords = triangleObjectRef.current.coords;
        const sides = triangleObjectRef.current.sides;
        const vertexText = triangleObjectRef.current.vertexText;
        const sideText = triangleObjectRef.current.sideText;
        const ctx = ctxRef.current;

        let coord, nextCoord, lineCoord;
        let dx,dy;
        let sideDX, sideDY;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "green";
        
        switch(i) {
            //Draw c side with a little bit of extra length - A point
            case 1: {
                coord = coords[0];
                nextCoord = coords[2];

                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo((nextCoord.x * DRAW_LENGHT_WEIGHT) * 1.2, nextCoord.y * DRAW_LENGHT_WEIGHT)
                ctx.stroke();

                dx = -20;
                dy = 0;
                ctx.fillText(vertexText[0], coord.x * DRAW_LENGHT_WEIGHT + dx, coord.y * DRAW_LENGHT_WEIGHT + dy);
                break;
            }
            //Get B point with arc
            case 2: {
                coord = coords[0];
                lineCoord = coords[2];

                ctx.beginPath();
                ctx.arc(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT, sides.c * DRAW_LENGHT_WEIGHT, 1.9 * Math.PI, 0.15 * Math.PI);
                ctx.stroke();

                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(lineCoord.x * DRAW_LENGHT_WEIGHT, lineCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                sideDX = 0;
                sideDY = 20;
                dx = 10;
                dy = 0;
                ctx.fillText(vertexText[2], lineCoord.x * DRAW_LENGHT_WEIGHT + dx, lineCoord.y * DRAW_LENGHT_WEIGHT + dy);
                //draw side text
                ctx.fillText(sideText[2], 
                             ((coord.x + lineCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                             ((coord.y + lineCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                            );
                break;
            }
            //Draw arc from A to C - b side
            case 3: {
                coord = coords[0];
                const diffX = coord.x - coords[1].x;
                const diffY = coord.y - coords[1].y;
                const radius = Math.abs(Math.sqrt(diffX*diffX + diffY*diffY));

                ctx.beginPath();
                ctx.arc(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT, radius * DRAW_LENGHT_WEIGHT, Math.PI, 0);
                ctx.stroke();
                break;
            }
            //Draw arc from B to C - a side
            case 4: {
                coord = coords[2];
                const diffX = coord.x - coords[1].x;
                const diffY = coord.y - coords[1].y;
                const radius = Math.abs(Math.sqrt(diffX*diffX + diffY*diffY));

                ctx.beginPath();
                ctx.arc(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT, radius * DRAW_LENGHT_WEIGHT, Math.PI, 0);
                ctx.stroke();
                break;
            }
            //Draw AC - b side 
            case 5: {
                coord = coords[0];
                nextCoord = coords[1];
                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(nextCoord.x * DRAW_LENGHT_WEIGHT, nextCoord.y * DRAW_LENGHT_WEIGHT)
                ctx.stroke();

                dx = 0;
                dy = -10;
                sideDX = -20;
                sideDY = 0;
                ctx.fillText("C", nextCoord.x * DRAW_LENGHT_WEIGHT + dx, nextCoord.y * DRAW_LENGHT_WEIGHT + dy);
                //draw side text
                ctx.fillText("b", 
                             ((coord.x + nextCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                             ((coord.y + nextCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                            );
                break;
            }
            //Draw BC- a side 
            case 6: {
                coord = coords[2];
                nextCoord = coords[1];
                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(nextCoord.x * DRAW_LENGHT_WEIGHT, nextCoord.y * DRAW_LENGHT_WEIGHT)
                ctx.stroke();

                sideDX = 10;
                sideDY = 0;
                //draw side text
                ctx.fillText("a", 
                             ((coord.x + nextCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                             ((coord.y + nextCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                            );
                break;
            }
        }

        iterationRef.current = ++i;
    }

    function sidesAngle() {
        let i = iterationRef.current;
        const coords = triangleObjectRef.current.coords;
        const sides = triangleObjectRef.current.sides;
        const vertexText = triangleObjectRef.current.vertexText;
        const sideText = triangleObjectRef.current.sideText;
        const ctx = ctxRef.current;

        let coord, nextCoord, lineCoord, extendedCoord;
        let dx,dy;
        let sideDX, sideDY;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "green";
        
        switch(i) {
            case 1: {
                coord = coords[0];
                nextCoord = coords[2];

                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo((nextCoord.x * DRAW_LENGHT_WEIGHT) * 1.2, nextCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                dx = -20;
                dy = 0;
                ctx.fillText(vertexText[0], coord.x * DRAW_LENGHT_WEIGHT + dx, coord.y * DRAW_LENGHT_WEIGHT + dy);
                break;
            }
            case 2: {
                coord = coords[0];
                nextCoord = coords[1];
                lineCoord = coords[2];

                ctx.beginPath();
                ctx.arc(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT, sides.c * DRAW_LENGHT_WEIGHT, 1.9 * Math.PI, 0.15 * Math.PI);
                ctx.stroke();
                
                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(lineCoord.x * DRAW_LENGHT_WEIGHT, lineCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                sideDX = 0;
                sideDY = 20;
                dx = 0;
                dy = 0;
                ctx.fillText(vertexText[2], lineCoord.x * DRAW_LENGHT_WEIGHT + dx, lineCoord.y * DRAW_LENGHT_WEIGHT + dy);
                //draw side text
                ctx.fillText(sideText[2], 
                             ((coord.x + lineCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                             ((coord.y + lineCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                            );
                break;
            }
            case 3: {
                coord = coords[0];
                nextCoord = coords[1];
                extendedCoord = getLineXY(coord, nextCoord, 1.3);

                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo((extendedCoord.x * DRAW_LENGHT_WEIGHT), extendedCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();
                break;
            }
            case 4: {
                coord = coords[0];
                lineCoord = coords[1];

                ctx.beginPath();
                ctx.arc(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT, sides.b * DRAW_LENGHT_WEIGHT, Math.PI, 0);
                ctx.stroke();

                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(lineCoord.x * DRAW_LENGHT_WEIGHT, lineCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                sideDX = -20;
                sideDY = 0;
                dx = 0;
                dy = -10;
                ctx.fillText(vertexText[1], lineCoord.x * DRAW_LENGHT_WEIGHT + dx, lineCoord.y * DRAW_LENGHT_WEIGHT + dy);
                ctx.fillText("b", 
                    ((coord.x + lineCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                    ((coord.y + lineCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                   );
                break;
            }
            case 5: {
                coord = coords[2];
                nextCoord = coords[1];

                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo((nextCoord.x * DRAW_LENGHT_WEIGHT), nextCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                sideDX = 10;
                sideDY = 0;
                ctx.fillText("a", 
                    ((coord.x + nextCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                    ((coord.y + nextCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                );
                break;
            }
        }

        iterationRef.current = ++i;
    }

    function sideAngles() {
        let i = iterationRef.current;
        const coords = triangleObjectRef.current.coords;
        const sides = triangleObjectRef.current.sides;
        const vertexText = triangleObjectRef.current.vertexText;
        const sideText = triangleObjectRef.current.sideText;
        const ctx = ctxRef.current;

        let coord, nextCoord, lineCoord, extendedCoord;
        let dx,dy;
        let sideDX, sideDY;
        ctx.strokeStyle = "black";
        ctx.fillStyle = "green";
        
        switch(i) {
            case 1: {
                coord = coords[0];
                nextCoord = coords[2];

                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo((nextCoord.x * DRAW_LENGHT_WEIGHT) * 1.2, nextCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                dx = -20;
                dy = 0;
                ctx.fillText("A", coord.x * DRAW_LENGHT_WEIGHT + dx, coord.y * DRAW_LENGHT_WEIGHT + dy);
                break;
            }
            case 2: {
                coord = coords[0];
                lineCoord = coords[2];
                ctx.beginPath();
                ctx.arc(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT, sides.c * DRAW_LENGHT_WEIGHT, 1.9 * Math.PI, 0.15 * Math.PI);
                ctx.stroke();

                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(lineCoord.x * DRAW_LENGHT_WEIGHT, lineCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                sideDX = 0;
                sideDY = 20;
                dx = 10;
                dy = 0;
                ctx.fillText(vertexText[2], lineCoord.x * DRAW_LENGHT_WEIGHT + dx, lineCoord.y * DRAW_LENGHT_WEIGHT + dy);
                //draw side text
                ctx.fillText(sideText[2], 
                             ((coord.x + lineCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                             ((coord.y + lineCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                            );
                break;
            }
            case 3: {
                coord = coords[0];
                nextCoord = coords[1];
                extendedCoord = getLineXY(coord, nextCoord, 1.3);

                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(extendedCoord.x * DRAW_LENGHT_WEIGHT, extendedCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();
                break;
            }
            case 4: {
                coord = coords[2];
                nextCoord = coords[1];
                extendedCoord = getLineXY(coord, nextCoord, 1.3);

                ctx.beginPath();
                ctx.moveTo(coord.x * DRAW_LENGHT_WEIGHT, coord.y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(extendedCoord.x * DRAW_LENGHT_WEIGHT, extendedCoord.y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                ctx.strokeStyle = "green";
                ctx.beginPath();
                ctx.moveTo(coords[0].x * DRAW_LENGHT_WEIGHT, coords[0].y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(coords[1].x * DRAW_LENGHT_WEIGHT, coords[1].y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(coords[2].x * DRAW_LENGHT_WEIGHT, coords[2].y * DRAW_LENGHT_WEIGHT);
                ctx.lineTo(coords[1].x * DRAW_LENGHT_WEIGHT, coords[1].y * DRAW_LENGHT_WEIGHT);
                ctx.stroke();

                dx = 0;
                dy = -10;
                sideDX = -20;
                sideDY = 0;
                ctx.fillText("C", nextCoord.x * DRAW_LENGHT_WEIGHT + dx, nextCoord.y * DRAW_LENGHT_WEIGHT + dy);
                //draw side text
                ctx.fillText("b", 
                             ((coords[0].x + nextCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                             ((coords[0].y + nextCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                            );
                sideDX = 0;
                sideDY = -10;
                ctx.fillText("a", 
                    ((coords[2].x + nextCoord.x)/2 * DRAW_LENGHT_WEIGHT) + sideDX,
                    ((coords[2].y + nextCoord.y)/2 * DRAW_LENGHT_WEIGHT ) + sideDY
                );
                break;
            }
        }

        iterationRef.current = ++i;
    }

    function generateScalene() {
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

        let obj = {coords, sides, angles, vertexText, sideText}
        triangleObjectRef.current = obj;
        return obj;
      }

      function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
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
        <div className='canvasContainer'>
            <canvas className='canvas' width={CANVAS_W} height={CANVAS_H} ref={canvasRef}></canvas>
            <div>
                <div className='radioContainer'>
                    <label style={{marginRight: "10px"}}>3 oldal </label>
                    <input type="radio" value="sides" name='inputType' 
                        onChange={onOptionChange} checked={type === "sides"}/>

                </div>
                <div className='radioContainer'>
                    <label style={{marginRight: "10px"}}>2 oldal 1 szög</label>
                    <input type="radio" value="sidesAngle" name='inputType' 
                        onChange={onOptionChange} checked={type === "sidesAngle"}/>

                </div>
                <div className='radioContainer'> 
                    <label style={{marginRight: "10px"}}>1 oldal 2 szög</label>
                    <input type="radio" value="sideAngles" name='inputType' 
                        onChange={onOptionChange} checked={type === "sideAngles"}/>
                </div>
            </div>
            {typeRef.current == "sides" && 
                <div className='generateBtn' onClick={sidesOnly}>Tovább</div>
            }
            {typeRef.current == "sidesAngle" && 
                <div className='generateBtn' onClick={sidesAngle}>Tovább</div>
            }
            {typeRef.current == "sideAngles" && 
                <div className='generateBtn' onClick={sideAngles}>Tovább</div>
            }
        </div>
    </div>
  )
}

export default Canvas;
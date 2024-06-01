import React from 'react'
import { useRef, useEffect, useState } from 'react';
import Instruction from "../Instruction"
import Results from "./Results"

const NUM_OF_TASKS = 3;
const TASKS = [["Vegyünk fel egy A kezdőpontú félegyenest", 
                "Körzővel A-ból mérjünk a félegyenesre adott c hosszúságú szakaszt, hogy megkapjuk a B pontot",
                "Rajzoljuk meg az A középpontú, b sugarú kört.",
                "Rajzoljuk meg a B középpontú, a sugarú kört.",
                "Jelöljük meg a körök metszéspontját.",
                "Kössük össze a metszéspontot A-val és B-vel."],
              ["Vegyünk fel egy A kezdőpontú félegyenest", 
              "Körzővel A-ból mérjünk a félegyenesre adott c hosszúságú szakaszt, hogy megkapjuk a B pontot",
              "Vegyünk fel egy A kezdőpontú félegyenest, mely Alfa szöget zár be az AB szakasszal",
              "Rajzoljuk meg az A középpontú, b sugarú kört, hogy megkapjuk A C pontot",
              "Kössük össze a B pontot a C ponttal"
              ],
              ["Vegyünk fel egy A kezdőpontú félegyenest", 
              "Körzővel A-ból mérjünk a félegyenesre adott c hosszúságú szakaszt, hogy megkapjuk a B pontot",
              "Vegyünk fel egy A kezdőpontú félegyenest, mely Alfa szöget zár be az AB szakasszal",
              "Vegyünk fel egy B kezdőpontú félegyenest, mely Béte szöget zár be az AB szakasszal",
              "A két félegyens metszéspontja megadja a C pontot"]]
const TASKS_TEXT = ["Rakd megfelelő sorrendbe a háromszög szerkesztésének menetét 3 oldal ismeretében.",
                    "Rakd megfelelő sorrendbe a háromszög szerkesztésének menetét 2 oldal és 1 szög ismeretében.",
                    "Rakd megfelelő sorrendbe a háromszög szerkesztésének menetét 1 oldal és 2 szög ismeretében."]

const Test = () => {
  const [taskNum, setTaskNum] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [correctNum, setCorrectNum] = useState(0);
  const [taskText, setTaskText] = useState("");
  const [currentTaskRandomized, setCurrentTaskRandomized] = useState(["FAAAST"]);
  const [dragItemIndex, setDragItemIndex] = useState();
  const [dragOverItemIndex, setDragOverItemIndex] = useState();
  const taskOrderRef = useRef([0,1,2]);

  useEffect(() => {
    //Randomize the order of tasks and set the current task
    taskOrderRef.current = shuffleTasks(taskOrderRef.current);
    createTask();
  }, [])
  
  function onNext() {
    let currentCorrectNum = correctNum;
    const originalOrder = TASKS[taskOrderRef.current[taskNum-1]];
    const isCorrect = compareArrays(currentTaskRandomized, originalOrder);

    if(isCorrect) {
      currentCorrectNum++;
    }

    let currentTask = {correctOrder: originalOrder, userOrder: currentTaskRandomized, text: taskText};
    //modify current task by user input
    currentTask["isCorrect"] = isCorrect;
    //save current task to array for future use
    setTasks(currentArray => [...currentArray, currentTask]);

    //get ready for next task
    setCorrectNum(currentCorrectNum);
    setTaskNum(taskNum + 1);

    if(taskNum <= NUM_OF_TASKS) {
      createTask();
    }
  }

  function createTask() {
    const currentTaskIndex = taskOrderRef.current[taskNum-1];
    setTaskText(TASKS_TEXT[currentTaskIndex]);

    //Randomize the order of current task's construction process
    const taskInOrder = TASKS[currentTaskIndex];
    setCurrentTaskRandomized(shuffleTasks(taskInOrder));
  }

  function handleDragStart(event, index) {
    setDragItemIndex(index);
  }

  function handleDrop(event) {
    const currentOrder = Array.from(currentTaskRandomized);
    const result = moveElement(currentOrder, dragItemIndex, dragOverItemIndex);
   /* const draggedItem = currentOrder.splice(dragItemIndex, 1);
    currentOrder.splice(dragOverItemIndex, 0, draggedItem);*/
    setCurrentTaskRandomized(result);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event, index) {
    setDragOverItemIndex(index);
  }

  function handleDragLeave(event) {
    setDragOverItemIndex(null);
  }

  function handleDragEnd(event) {
    setDragItemIndex(undefined);
    setDragOverItemIndex(undefined);
  }


  function shuffleTasks(inputArray) {
    let array = Array.from(inputArray);

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  } 

  function compareArrays(a, b) {
    const stringA = JSON.stringify(a);
    const stringB = JSON.stringify(b);
    console.log(stringA)
    console.log(stringB)
    return stringA === stringB;
  }

  function moveElement(array, fromIndex, toIndex) {
  const arrayCopy = [...array];
  const element = arrayCopy.splice(fromIndex, 1)[0];
  arrayCopy.splice(toIndex, 0, element);

  return arrayCopy;
}

  if(taskNum <= NUM_OF_TASKS) {
    return (
      <div className="eduText">
        <div style={{marginBottom: "20px"}}>
          <Instruction openText="Instrukció megnyitása" closeText="Instrukció bezárása">
              <p> 
                A fehé négyzetben megtalálod a háromszög szerkesztésének lépéseit véletlen sorrendben
                kihelyezve. Vidd a kurzort a mozgatni kívánt lépés felé, majd az egeret lenyomva mozgasd
                a megfelelő pozícióba. Amennyiben úgy gondolod, hogy két lépés sorrendje tetszőlegesen megválasztható,
                a lépéshez felhasznált csúcspont szerinti abc sorrendben helyezd el a lépéseket (A megy előre).
                Ha úgy gondolod, hogy valamennyi lépést a megfelelő pozícóba raktad,
                kattints a tovább gombra.
              </p>
          </Instruction>
        </div>
          <h1 className='title'>{taskNum+"/"+NUM_OF_TASKS} feladat</h1>
          <h2>{taskText}</h2>
        <div className='dragContainer'>
            {currentTaskRandomized.map((element,index) => (
                 <div key={index} draggable className='dragItem flex' 
                      onDragStart={(e) => handleDragStart(e,index)} onDragOver={(e) => handleDragOver(e)} 
                      onDrop={(e) => handleDrop(e,index)} onDragEnter={(e) => handleDragEnter(e,index)}
                      onDragLeave={(e) => handleDragLeave(e)} onDragEnd={(e) => handleDragEnd(e)}>
                    <div style={{marginRight: "20px"}}>{index+1 + "."}</div>
                    <div>{element}</div>
                 </div>
            ))}
        </div>
        <button className='nextBtn' onClick={onNext}>{taskNum != NUM_OF_TASKS ? "Következő" : "Befejezés"}</button>
      </div>
    )
  }
  else {
    return (
      <div>
        <span></span>
        <Results tasks={tasks} correctNum={correctNum} />
      </div>
    )
  }

}

export default Test
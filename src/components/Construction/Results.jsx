import React from 'react'

const Results = ({tasks, correctNum}) => {
  return (
    <div className="resultContainer">
        <h1 style={{marginTop: "20px"}}>Helyes megoldások száma {correctNum}/3</h1>
        {tasks.map((element,index) => (
            <div key={index} className={element.isCorrect? "correct" : "wrong"}>
                <h3 style={{margin:"10px" ,padding: "15px"}}>{element.text}</h3>

                <h4 style={{margin:"10px" ,padding: "15px"}}>Megfelelő sorrend:</h4>
                <div style={{backgroundColor:"white", color:"black", display:"inline-block", margin:"0px"}}>
                {element.correctOrder.map((process, index) => (
                    <div className='flex'>
                        <div style={{marginRight: "20px"}}>{index+1 + "."}</div>
                        <div>{process}</div>
                    </div>
                ))}
                </div>

                <h4 style={{margin:"10px" ,padding: "15px"}}>Megadott sorrend:</h4>
                <div style={{backgroundColor:"white", color:"black", display:"inline-block", marginBottom:"30px"}}>
                {element.userOrder.map((process, index) => (
                        <div className='flex'>
                            <div style={{marginRight: "20px"}}>{index+1 + "."}</div>
                            <div>{process}</div>
                        </div>
                ))}
                </div>
            </div>
        ))}
    </div>
  )
}

export default Results
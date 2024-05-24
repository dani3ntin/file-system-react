import { useState, useEffect } from "react";
import Nodo from "./classi/Nodo.ts";
import Articolo from "./classi/Articolo.ts";
import Albero from "./classi/Albero.ts";
import "./App.css";
import React from "react";
import AlberoComponente from "./components/AlberoComponente.tsx";

function App(){
  const [albero, setAlbero] = useState<Albero | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  useEffect(() => {
    const n0 = new Nodo("Padre")
    const n1 = new Nodo("Nodo1")
    const n2 = new Nodo("Nodo2")
    const n3 = new Nodo("Nodo3")
    const n4 = new Nodo("Nodo4")
    n0.aggiungiSuccessore(n1)
    n0.aggiungiSuccessore(n2)
    n1.aggiungiSuccessore(n3)
    n3.aggiungiSuccessore(n4)
    //albero.getSuccessori()[1].aggiungiArticolo(new Articolo(3, "Articolo1", "Articolo1"))
    n1.aggiungiArticolo(new Articolo("Articolo1", "Articolo1"))
    n2.aggiungiArticolo(new Articolo("Articolo2", "Articolo2"))
    n3.aggiungiArticolo(new Articolo("Articolo3", "Articolo3"))
    n3.aggiungiArticolo(new Articolo("Articolo3", "Articolo3"))
    //n0.aggiungiArticolo(new Articolo("Articolo4", "Articolo4"))
    //n2.aggiungiArticolo(new Articolo("Articolo3", "Articolo3"))
    //n2.aggiungiArticolo(new Articolo("Articolo4", "Articolo4"))
    //n2.aggiungiArticolo(new Articolo("Articolo5", "Articolo5"))
    //n1.aggiungiArticolo(new Articolo("Articolo6", "Articolo6"))
    console.log(n0)
    const albero = new Albero(n0)
    setAlbero(albero);
  }, []); 


  function handleOnDrag(e: React.DragEvent, widgetType: string, widgetId: number): void{
    e.dataTransfer.setData("widgetType", widgetType)
    e.dataTransfer.setData("widgetId", widgetId.toString())
  }


  return (
    <div className="App">
      <div className="widgets">
        <div className="widget" draggable onDragStart={(e) => handleOnDrag(e, "Nodo", -1)} onDragEnd={() => setHoveredItemId(null)}>Nodo</div>
        <div className="widget" draggable onDragStart={(e) => handleOnDrag(e, "Articolo", -1)} onDragEnd={() => setHoveredItemId(null)}>Articolo</div>
      </div>
        <AlberoComponente albero={albero} setAlbero={setAlbero} handleOnDrag={handleOnDrag} hoveredItemId={hoveredItemId} setHoveredItemId={setHoveredItemId}/>
    </div>
  )
}
export default App;

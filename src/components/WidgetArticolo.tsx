import React from "react";
import { useState } from "react";
import Articolo from "../classi/Articolo";
import { FaFolderOpen, FaFolder,  FaRegFolder, FaRegFolderOpen, FaSquare } from "react-icons/fa";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import "./WidgetArticolo.css"


function WidgetArticolo(props: any): JSX.Element {
    const [dragIniziato, setDragIniziato] = useState(false);

    function getStile(): object{
        if(dragIniziato){
            return {
                border: '1px dotted black',
            };
        }
        if(props.hoveredItemId === props.articolo.id){
            return {
                backgroundColor: "lightblue",
            };
        }
        return {};
    }

    function onDragEndHandler(): void {
        props.setHoveredItemId(null)
        setDragIniziato(false)
    }

    function onDragStartHandler(e: React.DragEvent, tipo: string, id: number): void{
        props.handleOnDrag(e, tipo, id)
        setDragIniziato(true);
    }

    return(
        <div className="dropped-widget-articolo" key={props.articolo.id} /*style={{ paddingLeft: ( props.depth * 20 + props.depth + 40) + "px" }}*/ 
        onDrop={(e) => props.handleDropOnArticolo(e, props.articolo.id)}
        draggable 
        onDragStart={(e) => onDragStartHandler(e, "Articolo", props.articolo.id)} 
        onDragOver={() => props.setHoveredItemId(props.articolo.id)}
        style={getStile()}
        onDragEnd={onDragEndHandler}
        onDragLeave={() => props.setHoveredItemId(null)} >
            <div className="icona-articolo"><FaSquare className="icona"/></div>
            <div className="nome-componente">{props.articolo.nome}</div>
        </div>
    );
}

export default WidgetArticolo;
import React from "react";
import { useState } from "react";
import Nodo from "../classi/Nodo";
import { FaFolderOpen, FaFolder,  FaRegFolder, FaRegFolderOpen, FaSquare } from "react-icons/fa";
import "./WidgetNodo.css"
import menoConTrattiniSuDxGiu from "../images/menoConTrattiniSuDxGiu.png"
import cartellaApertaConTrattini from "../images/cartellaApertaConTrattini.png"
import menoConTrattiniSuDx  from"../images/menoConTrattiniSuDx.png"
import piuConTrattiniSuDx  from"../images/piuConTrattiniSuDx.png"
import piuConTrattiniSuDxGiu from "../images/piuConTrattiniSuDxGiu.png"
import vuoto from "../images/vuoto.png"
import Albero from "../classi/Albero";


function WidgetNodo(props: any): JSX.Element {
    const [dragIniziato, setDragIniziato] = useState(false);

    function getImageApriChiudiCartella(): string{
        const albero = new Albero(props.albero.nodoPadre);
        if(albero instanceof Albero){
            const padre = albero.getPadreDellElementoNellAlbero(props.nodo);
            if(padre === null && props.nodo.aperto) return menoConTrattiniSuDx;
            if(padre === null && !props.nodo.aperto) return piuConTrattiniSuDx;
            if(padre && padre.articoli.length > 0 && props.nodo.aperto) return menoConTrattiniSuDxGiu;
            if(padre && padre.articoli.length > 0 && !props.nodo.aperto) return piuConTrattiniSuDxGiu;
            if(padre && padre.successori[padre.successori.length - 1].id === props.nodo.id && props.nodo.aperto) return menoConTrattiniSuDx;
            if(padre && padre.successori[padre.successori.length - 1].id === props.nodo.id && !props.nodo.aperto) return piuConTrattiniSuDx;
            if(props.nodo.aperto) return menoConTrattiniSuDxGiu;
            if(!props.nodo.aperto) return piuConTrattiniSuDxGiu;
        }
        return vuoto
    }

    function onDragStartHandler(e: React.DragEvent, tipo: string, id: number): void{
        props.handleOnDrag(e, tipo, id)
        setDragIniziato(true);
    }

    function onDragEndHandler(): void {
        props.setHoveredItemId(null)
        setDragIniziato(false)
    }

    function getStile(): object{
        if(dragIniziato){
            return {
                border: '1px dotted black',
            };
        }
        if(props.hoveredItemId === props.nodo.id){
            return {
                backgroundColor: "lightblue",
            };
        }
        return {};
    }
    return(
        <div className="dropped-widget-nodo" key={props.nodo.id} /*style={{ paddingLeft: (props.depth * 20) + "px" }}*/ onDrop={(e) => props.handleDropOnNodo(e, props.nodo.id)}
        draggable onDragStart={(e) => onDragStartHandler(e, "Nodo", props.nodo.id)} onDragOver={() => props.setHoveredItemId(props.nodo.id)}
        onDragLeave={() => props.setHoveredItemId(null)} style={getStile()} onDragEnd={onDragEndHandler}>
            <div className="icona-apri-chiudi-cartella">
                <img 
                    src={getImageApriChiudiCartella()} 
                    className="icona-img"
                    onClick={props.handlePremutoSuApriChiudiCartella}
                />
            </div>
                <div className="icona-nodo">
                    {
                        props.nodo.aperto ? <FaFolderOpen className="icona"/> : <FaFolder className="icona"/>
                    }
                </div>
            <div className="nome-componente">{props.nodo.nome}</div>
        </div>
    );
}

export default WidgetNodo;
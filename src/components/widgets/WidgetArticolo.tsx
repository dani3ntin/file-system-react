import React, {KeyboardEvent} from "react";
import { useState, useEffect, useRef } from "react";
import Articolo from "../../classi/Articolo";
import { FaFolderOpen, FaFolder,  FaRegFolder, FaRegFolderOpen, FaSquare } from "react-icons/fa";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import "./WidgetArticolo.css"
import MenuTastoDestro from "../MenuTastoDestro";
import Albero from "../../classi/Albero";


function WidgetArticolo(props: any): JSX.Element {
    const [dragIniziato, setDragIniziato] = useState(false);
    const [menuTastoDestro, setMenuTastoDestro] = useState({aperto: false, x: -9999, y: -9999});
    const [elementoCliccato, setElementoCliccato] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const textBoxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement; 
            const id = target.id;
            if(id != "textBoxNome" + props.articolo.id && props.idModoficaNome === props.articolo.id){
                confermaNomeInseritoNellaTextbox();
            }
            setElementoCliccato(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, props]);

    function confermaNomeInseritoNellaTextbox(): void{
        props.setIdModificaNome(-1);
        props.modificaArticolo(props.articolo);
    }

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
        if(menuTastoDestro.aperto === true || elementoCliccato){
            return {
                backgroundColor: "blue",
                color: "white"
            };
        }
        if(!elementoCliccato){
            return {
                backgroundColor: "transparent",
                color: "black"
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

    function handleRightClick(e: React.MouseEvent){
        e.preventDefault();
        setMenuTastoDestro({aperto: true, x: e.pageX, y: e.pageY});
    }

    function chiudiMenuTastoDestro(){
        setMenuTastoDestro({aperto: false, x: -9999, y: -9999});
    }

    function premutoSuOpzioneMenuTastoDestro(azione: string){
        chiudiMenuTastoDestro();
        props.premutoSuOpzioneMenuTastoDestro(azione, props.articolo);
        if(azione === "rinomina")
            if (textBoxRef.current) {
                setTimeout(() => {
                    textBoxRef.current!.focus();
                }, 10);
            }
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>){
        props.setNomeInserito(event.target.value);
    }

    function onDropHandler(e: React.DragEvent){
        props.setHoveredItemId(null)
        props.handleDropOnArticolo(e, props.articolo.id)
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void{
        if (event.key === 'Enter'){
            confermaNomeInseritoNellaTextbox();
        }
    }

    return(
        <div className="dropped-widget-articolo" key={props.articolo.id} /*style={{ paddingLeft: ( props.depth * 20 + props.depth + 40) + "px" }}*/ 
        onDrop={onDropHandler}
        draggable 
        onDragStart={(e) => onDragStartHandler(e, "Articolo", props.articolo.id)} 
        onDragOver={() => props.setHoveredItemId(props.articolo.id)}
        style={getStile()}
        onDragEnd={onDragEndHandler}
        onDragLeave={() => props.setHoveredItemId(null)} 
        onContextMenu={handleRightClick}
        onClick={() => setElementoCliccato(true)}>
            {
                menuTastoDestro.aperto && 
                <MenuTastoDestro 
                    x={menuTastoDestro.x} 
                    y={menuTastoDestro.y} 
                    chiudiMenu={chiudiMenuTastoDestro} 
                    premutoSuOpzioneMenuTastoDestro={premutoSuOpzioneMenuTastoDestro}
                    elementoCopiato={props.elementoCopiato}
                />
            }
            <div className="icona-articolo"><FaSquare className="icona"/></div>
            <input 
                type="text" 
                id={"textBoxNome" + props.articolo.id} 
                className={props.idModoficaNome === props.articolo.id ? 'visible' : 'hidden'} 
                value={props.nomeInserito} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}  
                ref={textBoxRef}
            />
            {
                props.idModoficaNome !== props.articolo.id ? <div className="nome-componente" onClick={() => setElementoCliccato(true)}>{props.articolo.nome}</div>
                : null
            }
        </div>
    );
}

export default WidgetArticolo;
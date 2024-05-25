import React from "react";
import { useState, useEffect, useRef } from "react";
import Nodo from "../../classi/Nodo";
import { FaFolderOpen, FaFolder,  FaRegFolder, FaRegFolderOpen, FaSquare } from "react-icons/fa";
import "./WidgetNodo.css"
import menoConTrattiniSuDxGiu from "../../images/menoConTrattiniSuDxGiu.png"
import cartellaApertaConTrattini from "../../images/cartellaApertaConTrattini.png"
import menoConTrattiniSuDx  from"../../images/menoConTrattiniSuDx.png"
import piuConTrattiniSuDx  from"../../images/piuConTrattiniSuDx.png"
import piuConTrattiniSuDxGiu from "../../images/piuConTrattiniSuDxGiu.png"
import vuoto from "../../images/vuoto.png"
import Albero from "../../classi/Albero";
import MenuTastoDestro from "../MenuTastoDestro";


function WidgetNodo(props: any): JSX.Element {
    const [dragIniziato, setDragIniziato] = useState(false);
    const [menuTastoDestro, setMenuTastoDestro] = useState({aperto: false, x: -9999, y: -9999});
    const [elementoCliccato, setElementoCliccato] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const textBoxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement; 
            const id = target.id;
            if(id != "textBoxNome" + props.nodo.id && props.idModoficaNome === props.nodo.id){
                props.setIdModificaNome(-1);
                props.modificaNodo(props.nodo);
            }
            setElementoCliccato(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, props]);


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

    function handleRightClick(e: React.MouseEvent){
        e.preventDefault();
        setMenuTastoDestro({aperto: true, x: e.clientX, y: e.clientY});
    }

    function chiudiMenuTastoDestro(){
        setMenuTastoDestro({aperto: false, x: -9999, y: -9999});
    }

    function premutoSuOpzioneMenuTastoDestro(azione: string){
        chiudiMenuTastoDestro();
        props.premutoSuOpzioneMenuTastoDestro(azione, props.nodo);
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
        props.handleDropOnNodo(e, props.nodo.id)
    }

    return(
        <div className="dropped-widget-nodo" 
            key={props.nodo.id} 
            onDrop={onDropHandler}
            draggable onDragStart={(e) => onDragStartHandler(e, "Nodo", props.nodo.id)}
            onDragOver={() => props.setHoveredItemId(props.nodo.id)}
            onDragLeave={() => props.setHoveredItemId(null)} 
            style={getStile()} 
            onDragEnd={onDragEndHandler} 
            onContextMenu={handleRightClick}>
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
            <div className="icona-apri-chiudi-cartella">
                <img 
                    src={getImageApriChiudiCartella()} 
                    className="icona-img"
                    onClick={props.handlePremutoSuApriChiudiCartella}
                />
            </div>
            <div className="icona-nodo" onClick={() => setElementoCliccato(true)}>
                {
                    props.nodo.aperto ? <FaFolderOpen className="icona"/> : <FaFolder className="icona"/>
                }
            </div>

            <input type="text" id={"textBoxNome" + props.nodo.id} name="myTextbox" className={props.idModoficaNome === props.nodo.id ? 'visible' : 'hidden'} value={props.nomeInserito} onChange={handleInputChange} ref={textBoxRef}/>
            {
                props.idModoficaNome !== props.nodo.id ? <div className="nome-componente" onClick={() => setElementoCliccato(true)}>{props.nodo.nome}</div>
                : null
            }
        </div>
    );
}

export default WidgetNodo;
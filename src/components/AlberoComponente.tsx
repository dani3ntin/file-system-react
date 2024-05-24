import React from "react";
import Albero from "../classi/Albero";
import Articolo from "../classi/Articolo";
import Nodo from "../classi/Nodo";
import WidgetNodo from "./widgets/WidgetNodo";
import WidgetArticolo from "./widgets/WidgetArticolo";
import Elemento from "../classi/Elemento";
import "./StampaAlbero.css"
import { useState, useEffect } from "react";
import trattinoOrizzontale from "../images/trattinoOrizzontale.png"
import trattinoSuDx from "../images/trattinoSuDx.png"
import trattinoSuDxGiu  from"../images/trattinoSuDxGiu.png"
import vuoto from"../images/vuoto.png"

function AlberoComponente(props: any): JSX.Element {
    const [menuTastoDestro, setMenuTastoDestro] = useState({aperto: false, x: -9999, y: -9999});
    
    function stampaAlberoOld(albero: Albero | null): JSX.Element {
        if (!albero) return <></>;
        return stampaNodoEArticoli(albero.getNodoPadre(), 0);
    }
    
    //NON è QUESTA LE FUNZIONE
    function stampaNodoEArticoli(nodoPadre: Nodo, depth: number): JSX.Element {
        if(!nodoPadre){
            return <></>;
        }
        const layerUno =  <WidgetNodo albero={props.albero} nodo={nodoPadre} depth={depth} handleOnDrag={props.handleOnDrag} handleDropOnNodo={handleDropOnNodo} setHoveredItemId={props.setHoveredItemId}/>
        let altriLayer = <></>
        for(const nodo of nodoPadre.successori){
            altriLayer = <>{altriLayer}{stampaNodoEArticoli(nodo, depth + 1)}</>
        }
        let elencoArticoli = <></>
        for(const articolo of nodoPadre.articoli){
            elencoArticoli = 
            <>{elencoArticoli}
            {
                <WidgetArticolo albero={props.albero} articolo={articolo} depth={depth} handleOnDrag={props.handleOnDrag} handleDropOnArticolo={handleDropOnArticolo} setHoveredItemId={props.setHoveredItemId}/>
            }
            </>
        }
        return <>{layerUno}{altriLayer}{elencoArticoli}</>
    }

    function apriChiudiNodo(nodo: any): void{
        if(nodo instanceof Nodo){
            const newAlbero: Albero = new Albero(props.albero.nodoPadre);
            nodo.cambiaStatoAperto();
            newAlbero.modificaElemento(nodo);
            props.setAlbero(newAlbero);
        }
    }

    function apriMenuTastoDestro(x: number, y: number): void{
        setMenuTastoDestro({aperto: true, x: x, y: y});
    }

    function chiudiMenuTastoDestro(){
        setMenuTastoDestro({aperto: false, x: -9999, y: -9999});
    }

    function stampaAlbero(albero: (string | Elemento)[][]): JSX.Element {
        if (!albero) return <></>;
        let layers = <></>;
        for (let i = 0; i < albero.length; i++) {
            let layerInterno = <></>;
            let paddingLeft: number = 0;
            for (let j = 0; j < albero[i].length; j++) {
                if(albero[i][j] === '+' || albero[i][j] === '-'){
                    layerInterno = <>{layerInterno}{
                        <WidgetNodo 
                        nodo={albero[i][j + 1]} 
                        handleOnDrag={props.handleOnDrag} 
                        handleDropOnNodo={handleDropOnNodo} 
                        handlePremutoSuApriChiudiCartella={() => apriChiudiNodo(albero[i][j + 1])}
                        albero={props.albero}
                        setAlbero={props.setAlbero}
                        setHoveredItemId={props.setHoveredItemId}
                        hoveredItemId={props.hoveredItemId}/>
                        }</>
                }
                if(albero[i][j] instanceof Articolo){
                    layerInterno = <>{layerInterno}
                    {
                        <WidgetArticolo
                        albero={props.albero}
                        setAlbero={props.setAlbero}
                        articolo={albero[i][j]} 
                        handleOnDrag={props.handleOnDrag} 
                        handleDropOnArticolo={handleDropOnArticolo} 
                        setHoveredItemId={props.setHoveredItemId}
                        hoveredItemId={props.hoveredItemId}/>
                        }</>
                }
                if(albero[i][j] === ' '){
                    layerInterno = <>{layerInterno}{<img src={vuoto} className="icona-img"/>}</>
                }
                if(albero[i][j] === '|'){
                    layerInterno = <>{layerInterno}{<img src={trattinoOrizzontale} className="icona-img"/>}</>
                }
                if(albero[i][j] === 'Ͱ'){
                    layerInterno = <>{layerInterno}{<img src={trattinoSuDxGiu} className="icona-img"/>}</>
                }
                if(albero[i][j] === 'L'){
                    layerInterno = <>{layerInterno}{<img src={trattinoSuDx} className="icona-img"/>}</>
                }
                if(albero[i][j] === 'F'){
                    j = albero[i].length;
                }
            }
            layers = <>{layers}<div className="row-container">{layerInterno}</div></>
        }

        return layers;
    }  

    function creaMatriceRiempita(righe: number, colonne: number, valore: string): string[][] {
        return Array.from({ length: righe }, () => Array(colonne).fill(valore));
    }

    function costruisciGraficaAlbero(albero: Albero | null): (string | Elemento)[][]{
        if(albero === null) return [[]]
        else {
            const altezzaGriglia: number = albero.contaElementiNellAlbero();
            const larghezzaGriglia: number = albero.calcolaAltezzaDellAlbero();
            const matrice = creaMatriceRiempita(altezzaGriglia, larghezzaGriglia + 2, ' ')
            //const newAlbero: Albero = new Albero(props.albero.nodoPadre);
            //newAlbero.EliminaSuccessoriEArticoliDaNodiChiusi()
            return costruisciGraficaAlberoPassoRicorsivo(albero.getNodoPadre(), matrice, 0, 0)
        }
    }

    function costruisciGraficaAlberoPassoRicorsivo(nodoPadre: Nodo, griglia: (string | Elemento)[][], riga: number, colonna: number): (string | Elemento)[][]{
        if(!nodoPadre) return griglia;
        griglia[riga][colonna + 1] = nodoPadre;
        griglia[riga][colonna + 2] = 'F';
        if(nodoPadre.aperto === true)
            griglia[riga][colonna] = '-';
        else{
            griglia[riga][colonna] = '+';
            return griglia;
        }

        //mi ricavo quanti elementi ha ogni sotto nodo. Mi servono per calcolare l'altezza da dove partire per il nodo successivo
        const numeroSottoElementi: number[] = [];
        for(const nodo of nodoPadre.successori){
            if(nodo.aperto)
                numeroSottoElementi.push(nodo.contaElementiInterniAperti());
            else
                numeroSottoElementi.push(0);
        }

        //inizio a creare tutti i sotto nodi. newy serve per capire l'altezza da dove parto
        let newRiga = riga + 1;
        for(let i: number = 0; i < nodoPadre.successori.length; i++){
            if(i > 0){
                newRiga = newRiga + numeroSottoElementi[i - 1] + 1;
            }
            griglia = costruisciGraficaAlberoPassoRicorsivo(nodoPadre.successori[i], griglia, newRiga, colonna + 1)
        }

        //ora creo gli articoli del mio nodo
        if(numeroSottoElementi.length !== 0)
            newRiga = newRiga + numeroSottoElementi[numeroSottoElementi.length - 1] + 1;
        for(let i: number = newRiga; i < newRiga + nodoPadre.articoli.length; i++){
            if(i === nodoPadre.articoli.length + newRiga - 1)
                griglia[i][colonna + 1] = 'L';
            else 
                griglia[i][colonna + 1] = 'Ͱ';
            griglia[i][colonna + 2] = nodoPadre.articoli[i - newRiga];
            griglia[i][colonna + 3] = 'F';
            //console.warn(griglia)
        }

        //infine, creo i trattini di questo nodo
        let trovatoElementoFinale: boolean = false
        for(let i: number = griglia.length - 1; i >= 0 && !(griglia[i][colonna + 1] instanceof Nodo); i--){
            if(griglia[i][colonna + 1] !== ' ') trovatoElementoFinale = true;
            if(griglia[i][colonna + 1] === ' ' && trovatoElementoFinale) {
                griglia[i][colonna + 1] = '|';
            }
        }
        
        return griglia;
    }

    function handleDropOnArticolo(e: React.DragEvent, idArticolo: number): void{
        if(!props.albero) return
        const elementType = e.dataTransfer.getData("widgetType")
        if(elementType === "") return
        const elementId = parseInt(e.dataTransfer.getData("widgetId"))
        if(elementId === idArticolo) return
        let elementToAdd = props.albero.trovaElementoNellAlbero(elementId)
        const nuovoAlbero = new Albero(props.albero.nodoPadre)
        if(elementToAdd === null)
            if(elementType === "Articolo")
            elementToAdd = new Articolo("Nuovo Articolo")
            else
            elementToAdd = new Nodo("Nuovo Nodo")
        else
            nuovoAlbero.eliminaElementoDallAlbero(elementToAdd.id)
        const nodoPadre = nuovoAlbero.getPadreDellElementoNellAlbero(idArticolo)
        if(!nodoPadre) return
        if(elementToAdd instanceof Articolo)
            nuovoAlbero.aggiungiArticolo(elementToAdd, nodoPadre.id)
        else if(elementToAdd instanceof Nodo)
            nuovoAlbero.aggiungiNodo(elementToAdd, nodoPadre.id)
        props.setAlbero(nuovoAlbero)
    }
    
    function handleDropOnNodo(e: React.DragEvent, idNodo: number): void{
        if(!props.albero) return
        const elementType = e.dataTransfer.getData("widgetType")
        if(elementType === "") return
        const elementId = parseInt(e.dataTransfer.getData("widgetId"))
        if(elementId === idNodo) return
        let elementToAdd = props.albero.trovaElementoNellAlbero(elementId)
        const nuovoAlbero = new Albero(props.albero.nodoPadre)
        if(elementToAdd === null)
            if(elementType === "Articolo")
            elementToAdd = new Articolo("Nuovo Articolo")
            else
            elementToAdd = new Nodo("Nuovo Nodo")

        const nodoPadre = nuovoAlbero.trovaElementoNellAlbero(idNodo)
        console.log(nodoPadre)
        if(nodoPadre === null || !(nodoPadre instanceof Nodo)) return;
        if(nuovoAlbero.NodoAPredecessoreDiNodoB(elementToAdd, nodoPadre)) return;
        nuovoAlbero.eliminaElementoDallAlbero(elementToAdd.id)
        if(elementToAdd instanceof Articolo)
            nuovoAlbero.aggiungiArticolo(elementToAdd, nodoPadre.id)
        else if(elementToAdd instanceof Nodo)
            nuovoAlbero.aggiungiNodo(elementToAdd, nodoPadre.id)
        props.setAlbero(nuovoAlbero)
    }
      
    function handleDragOver(e: React.DragEvent): void{
        e.preventDefault()
    }

    return(
        <div className="page" onDragOver={handleDragOver}>
        {
           /*
            stampaAlbero(props.albero)
            */
            stampaAlbero(costruisciGraficaAlbero(props.albero))
        }
        </div>
    );
}

export default AlberoComponente;

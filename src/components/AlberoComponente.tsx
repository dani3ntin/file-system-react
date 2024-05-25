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
    const [elementoCopiato, setElementoCopiato] = useState<Elemento | null>(null);
    const [idModoficaNome, setIdModificaNome] = useState(-1);
    const [nomeInserito, setNomeInserito] = useState("");

    function apriChiudiNodo(nodo: any): void{
        if(nodo instanceof Nodo){
            const newAlbero: Albero = new Albero(props.albero.nodoPadre);
            nodo.cambiaStatoAperto();
            newAlbero.modificaElemento(nodo);
            props.setAlbero(newAlbero);
        }
    }

    function memorizzaNuovaCopia(elementoTarget: Elemento){
        let elementoDaCopiare = null;
        if(elementoTarget instanceof Articolo || elementoTarget instanceof Nodo){
            elementoDaCopiare = elementoTarget.creaCopia();
        }
        setElementoCopiato(elementoDaCopiare);
    }

    function premutoSuOpzioneMenuTastoDestro(azione: string, elementoTarget: Elemento): void{
        const albero = new Albero(props.albero.nodoPadre);
        if(azione === "elimina" || azione === "taglia"){
            albero.eliminaElementoDallAlbero(elementoTarget.id);
            props.setAlbero(albero);
        }
        if(azione === "taglia" || azione === "copia"){
            memorizzaNuovaCopia(elementoTarget);
        }
        if(azione === "incolla"){
            if(elementoCopiato === null) return;
            if(elementoTarget instanceof Articolo){
                aggiungiElementoAdArticolo(elementoTarget.id, elementoCopiato);
            }
            else if(elementoTarget instanceof Nodo && elementoCopiato instanceof Articolo){
                aggiungiElementoANodo(elementoTarget.id, elementoCopiato);
            }
            else if(elementoTarget instanceof Nodo && elementoCopiato instanceof Nodo){
                if(props.albero.NodoAPredecessoreDiNodoB(elementoCopiato, elementoTarget)) return;
                aggiungiElementoANodo(elementoTarget.id, elementoCopiato)
            }
            memorizzaNuovaCopia(elementoCopiato)
        }
        if(azione === "rinomina"){
            setIdModificaNome(elementoTarget.id);
            setNomeInserito(elementoTarget.nome)
        }
    }

    function modificaElemento(nodo: Nodo){
        nodo.nome = nomeInserito
        props.albero.modificaElemento(nodo);
    }

    function stampaAlbero(albero: (string | Elemento)[][]): JSX.Element {
        if (!albero) return <></>;
        let layers = <></>;
        for (let i = 0; i < albero.length; i++) {
            let layerInterno = <></>;
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
                            hoveredItemId={props.hoveredItemId}
                            premutoSuOpzioneMenuTastoDestro={premutoSuOpzioneMenuTastoDestro}
                            elementoCopiato={elementoCopiato}
                            modificaNodo={modificaElemento}
                            idModoficaNome={idModoficaNome}
                            setIdModificaNome={setIdModificaNome}
                            nomeInserito={nomeInserito}
                            setNomeInserito={setNomeInserito}
                        />
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
                            hoveredItemId={props.hoveredItemId}
                            premutoSuOpzioneMenuTastoDestro={premutoSuOpzioneMenuTastoDestro}
                            elementoCopiato={elementoCopiato}
                            modificaArticolo={modificaElemento}
                            idModoficaNome={idModoficaNome}
                            setIdModificaNome={setIdModificaNome}
                            nomeInserito={nomeInserito}
                            setNomeInserito={setNomeInserito}
                        />
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

    function aggiungiElementoAdArticolo(idArticoloTarget: number, elementoDaAggiungere: Elemento){
        const nodoPadre = props.albero.getPadreDellElementoNellAlbero(idArticoloTarget)
        if(!nodoPadre) return
        if(elementoDaAggiungere instanceof Articolo)
            props.albero.aggiungiArticolo(elementoDaAggiungere, nodoPadre.id)
        else if(elementoDaAggiungere instanceof Nodo)
            props.albero.aggiungiNodo(elementoDaAggiungere, nodoPadre.id)
        const nuovoAlbero = new Albero(props.albero.nodoPadre)
        props.setAlbero(nuovoAlbero)
    }

    function handleDropOnArticolo(e: React.DragEvent, idArticolo: number): void{
        if(!props.albero) return
        const elementType = e.dataTransfer.getData("widgetType")
        if(elementType === "") return
        const elementId = parseInt(e.dataTransfer.getData("widgetId"))
        if(elementId === idArticolo) return
        let elementoDaAggiungere = props.albero.trovaElementoNellAlbero(elementId)
        console.log(elementoDaAggiungere)
        const nuovoAlbero = new Albero(props.albero.nodoPadre)
        if(elementoDaAggiungere === null)
            if(elementType === "Articolo")
            elementoDaAggiungere = new Articolo("Nuovo Articolo")
            else
            elementoDaAggiungere = new Nodo("Nuovo Nodo")
        else{
            const nodoPadre = props.albero.getPadreDellElementoNellAlbero(idArticolo)
            if(!nodoPadre) return
            if(elementoDaAggiungere instanceof Nodo){
                if(elementoDaAggiungere.trovaArticolo(idArticolo)) return;
            }
            nuovoAlbero.eliminaElementoDallAlbero(elementoDaAggiungere.id);
        }
            
        aggiungiElementoAdArticolo(idArticolo, elementoDaAggiungere);
    }

    function aggiungiElementoANodo(idNodoTarget: number, elementoDaAggiungere: Elemento){
        if(elementoDaAggiungere instanceof Articolo)
            props.albero.aggiungiArticolo(elementoDaAggiungere, idNodoTarget)
        else if(elementoDaAggiungere instanceof Nodo)
        props.albero.aggiungiNodo(elementoDaAggiungere, idNodoTarget)
        const nuovoAlbero = new Albero(props.albero.nodoPadre)
        props.setAlbero(nuovoAlbero)
    }
    
    function handleDropOnNodo(e: React.DragEvent, idNodo: number): void{
        if(!props.albero) return
        const elementType = e.dataTransfer.getData("widgetType")
        if(elementType === "") return
        const elementId = parseInt(e.dataTransfer.getData("widgetId"))
        if(elementId === idNodo) return
        let elementoDaAggiungere = props.albero.trovaElementoNellAlbero(elementId)
        if(elementoDaAggiungere === null)
            if(elementType === "Articolo")
            elementoDaAggiungere = new Articolo("Nuovo Articolo")
            else
            elementoDaAggiungere = new Nodo("Nuovo Nodo")
        const nuovoAlbero = new Albero(props.albero.nodoPadre)
        const nodoPadre = nuovoAlbero.trovaElementoNellAlbero(idNodo)
        console.log(nodoPadre)
        if(nodoPadre === null || !(nodoPadre instanceof Nodo)) return;
        if(nuovoAlbero.NodoAPredecessoreDiNodoB(elementoDaAggiungere, nodoPadre)) return;
        nuovoAlbero.eliminaElementoDallAlbero(elementoDaAggiungere.id)
        aggiungiElementoANodo(idNodo, elementoDaAggiungere)
    }
      
    function handleDragOver(e: React.DragEvent): void{
        e.preventDefault()
    }

    return(
        <div className="page" onDragOver={handleDragOver}>
        {
            stampaAlbero(costruisciGraficaAlbero(props.albero))
        }
        </div>
    );
}

export default AlberoComponente;

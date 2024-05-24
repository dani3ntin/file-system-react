import Nodo from "./Nodo.ts";
import Articolo from "./Articolo.ts";
import Elemento from "./Elemento.ts";

export default class Albero {
  contatoreId: number;
  nodoPadre: Nodo;

  constructor(nodoPadre: Nodo) {
    this.contatoreId = this.sistemaTuttiGliIdDellAlbero(nodoPadre, 0)
    this.nodoPadre = nodoPadre;
  }

  generaNuovoId(): number {
    this.contatoreId++
    return this.contatoreId;
  }

  getNodoPadre(): Nodo {
    return this.nodoPadre;
  }

  setNodoPadre(nuovoNodoPadre: Nodo): void {
    this.nodoPadre = nuovoNodoPadre;
  }

  sistemaTuttiGliIdDellAlbero(nodoPadre: Nodo, id: number): number{
    if(!nodoPadre) return id
    nodoPadre.id = id
    id++
    for(const successore of nodoPadre.successori){
      id = this.sistemaTuttiGliIdDellAlbero(successore, id)
    }
    for(const articolo of nodoPadre.articoli){
      articolo.id = id
      id++
    }
    return id
  }

  trovaElementoNellAlbero(id: number): Elemento | null{
    return this.trovaElemento(this.nodoPadre, id)
  }

  private trovaElemento(nodoPadre: Nodo, idDaTrovare: number): Elemento | null{
    if(!nodoPadre) return null
    if(nodoPadre.id === idDaTrovare) return nodoPadre
    for(const articolo of nodoPadre.articoli){
      if(articolo.id === idDaTrovare)
        return articolo
    }
    for(const successore of nodoPadre.successori){
      const nodoTrovato = this.trovaElemento(successore, idDaTrovare)
      if(nodoTrovato)
        return nodoTrovato
    }
    return null
  }

  aggiungiNodo(nodoDaAggiungere: Nodo, idNodoPadre: number): void {
    const elementoPadre = this.trovaElementoNellAlbero(idNodoPadre)
    if(elementoPadre === null) return
    if (elementoPadre instanceof Nodo) {
      elementoPadre.successori.push(nodoDaAggiungere)
      this.contatoreId = this.sistemaTuttiGliIdDellAlbero(this.nodoPadre, 0)
    }
  }

  aggiungiArticolo(articoloDaAggiungere: Articolo, idNodoPadre: number): void {
    const elementoPadre = this.trovaElementoNellAlbero(idNodoPadre)
    if(elementoPadre === null) return
    if (elementoPadre instanceof Nodo) {
      elementoPadre.articoli.push(articoloDaAggiungere)
      this.contatoreId = this.sistemaTuttiGliIdDellAlbero(this.nodoPadre, 0)
    }
  }

  getPadreDellElementoNellAlbero(elemento: Articolo | Nodo | number): Nodo | null{
    if(typeof elemento === 'number')
      return this.getPadreDellElemento(this.nodoPadre, elemento)
    return this.getPadreDellElemento(this.nodoPadre, elemento.id)
  }

  private getPadreDellElemento(nodoPadre: Nodo, idDaTrovare: number): Nodo | null{
    if(!nodoPadre) return null
    if(nodoPadre.id === idDaTrovare) return null
    for(const successore of nodoPadre.successori){
      if(successore.id === idDaTrovare)
        return nodoPadre
    }
    for(const articolo of nodoPadre.articoli){
      if(articolo.id === idDaTrovare)
        return nodoPadre
    }
    for(const successore of nodoPadre.successori){
      const nodoTrovato = this.getPadreDellElemento(successore, idDaTrovare)
      if(nodoTrovato)
        return nodoTrovato
    }
    return null
  }

  eliminaElementoDallAlbero(idElemento: number): Elemento | null {
    return this.eliminaElemento(this.nodoPadre, idElemento)
  }

  private eliminaElemento(nodoPadre: Nodo, idElemento: number): Elemento | null {
    if(!nodoPadre) return null;
    if(nodoPadre.id === idElemento) this.nodoPadre = new Nodo()
    for(const successore of nodoPadre.successori){
      if(successore.id === idElemento){
        const elementoDaEliminare = nodoPadre.successori.filter((successore) => successore.id === idElemento);
        nodoPadre.successori = nodoPadre.successori.filter((successore) => successore.id !== idElemento);
        return elementoDaEliminare[0];
      }
    }
    for(const articolo of nodoPadre.articoli){
      if(articolo.id === idElemento){
        const elementoDaEliminare = nodoPadre.articoli.filter((articolo) => articolo.id === idElemento)
        nodoPadre.articoli = nodoPadre.articoli.filter((articolo) => articolo.id !== idElemento)
        return elementoDaEliminare[0];
      }
    }
    for(const successore of nodoPadre.successori){
      const result = this.eliminaElemento(successore, idElemento);
      if(result !== null) return result;
    }
    return null;
  }

  contaElementiNellAlbero(): number{
    return this.nodoPadre.contaElementiInterni() + 1;
  }

  calcolaAltezzaDellAlbero(): number{
    return this.calcolaAltezzaDellAlberoPassoRicorsivo(this.nodoPadre);
  }

  private calcolaAltezzaDellAlberoPassoRicorsivo(nodo: Nodo): number{
    if(nodo.successori.length === 0) return 1;
    let altezzaMax: number = 0;
    for(const successore of nodo.successori){
      const altezza = this.calcolaAltezzaDellAlberoPassoRicorsivo(successore)
      if(altezza > altezzaMax)
        altezzaMax = altezza;
    }
    return 1 + altezzaMax;
  }

  modificaElemento(elemento: Elemento): void{
    const elementoTrovato = this.trovaElemento(this.nodoPadre, elemento.id)
    if(elementoTrovato === null) return;
    elementoTrovato.id = elemento.id;
    elementoTrovato.nome = elemento.nome;
    if(elementoTrovato instanceof Nodo && elemento instanceof Nodo){
      elementoTrovato.aperto = elemento.aperto;
    }
  }

  EliminaSuccessoriEArticoliDaNodiChiusi(): void{
    this.EliminaSuccessoriEArticoliDaNodiChiusiPassoRicorsivo(this.nodoPadre);
  }

  private EliminaSuccessoriEArticoliDaNodiChiusiPassoRicorsivo(nodo: Nodo): void{
    if(!nodo) return;
    if(!nodo.aperto){
      nodo.successori = [];
      nodo.articoli = [];
    }
    for(const successore of nodo.successori){
      this.EliminaSuccessoriEArticoliDaNodiChiusiPassoRicorsivo(successore)
    }
  }

  NodoAPredecessoreDiNodoB(nodoA: Nodo, nodoB: Nodo): boolean{
    return this.NodoAPredecessoreDiNodoBPassoRicorsivo(this.nodoPadre, nodoA, nodoB);
  }

  private NodoAPredecessoreDiNodoBPassoRicorsivo(nodo: Nodo, nodoA: Nodo, nodoB: Nodo): boolean{
    if(!nodo) return false;
    if(nodo.id === nodoA.id){
      const result = this.trovaElemento(nodo, nodoB.id);
      if(result !== null) return true;
      return false;
    }
    for(const successore of nodo.successori){
      const result = this.NodoAPredecessoreDiNodoBPassoRicorsivo(successore, nodoA, nodoB);
      if(result) return true;
    }
    return false;
  }
}

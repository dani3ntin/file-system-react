import Articolo from "./Articolo";
import Elemento from "./Elemento.ts";

export default class Nodo extends Elemento{
  successori: Nodo[];
  articoli: Articolo[];
  aperto: boolean;

  constructor(nome: string = "") {
    super(nome)
    this.successori = [];
    this.articoli = [];
    this.aperto = true;
  }

  getId(): number { return this.id; }
  setId(nuovoId: number): void { this.id = nuovoId; }
  getNome(): string { return this.nome; }
  setNome(nuovoNome: string): void { this.nome = nuovoNome; }
  setSuccessori(nuoviSuccessori: Nodo[]): void { this.successori = nuoviSuccessori; }
  getSuccessori(): Nodo[] { return this.successori; }
  setArticoli(nuoviArticoli: Articolo[]): void { this.articoli = nuoviArticoli; }
  getArticoli(): Articolo[] { return this.articoli; }
  cambiaStatoAperto(): void { this.aperto = !this.aperto; }
  getAperto(): boolean { return this.aperto; }

  aggiungiSuccessore(successore: Nodo): void { 
    this.successori.push(successore); 
  }

  aggiungiArticolo(articolo: Articolo): void { 
    this.articoli.push(articolo); 
  }

  contaElementiInterni(): number{
    if(this.successori.length === 0 && this.articoli.length === 0) return 0;
    return this.contaElementiInterniPassoRicorsivo(this) - 1;
  }

  private contaElementiInterniPassoRicorsivo(nodoPadre: Nodo): number{
    if(nodoPadre.successori.length === 0 && nodoPadre.articoli.length === 0) return 1;
    let nElementi: number = 0;
    for(const successore of nodoPadre.successori){
      nElementi += nodoPadre.contaElementiInterniPassoRicorsivo(successore);
    }
    return 1 + nodoPadre.articoli.length + nElementi;
  }

  contaElementiInterniAperti(): number{
    if(this.successori.length === 0 && this.articoli.length === 0) return 0;
    return this.contaElementiInterniApertiPassoRicorsivo(this) - 1;
  }

  private contaElementiInterniApertiPassoRicorsivo(nodoPadre: Nodo): number{
    if(nodoPadre.successori.length === 0 && nodoPadre.articoli.length === 0) return 1;
    let nElementi: number = 0;
    for(const successore of nodoPadre.successori){
      if(successore.aperto)
        nElementi += nodoPadre.contaElementiInterniApertiPassoRicorsivo(successore);
      else
        nElementi++;
    }
    return 1 + nodoPadre.articoli.length + nElementi;
  }

  trovaArticolo(id: number): Articolo | undefined {
    const articolo = this.articoli.find((articolo) => {
        if(articolo.id === id)
            return articolo      
    })

    if(articolo === undefined){
        for(const successore of this.successori){
            const articoloTrovatoNelSuccessore = successore.trovaArticolo(id)
            if(articoloTrovatoNelSuccessore){
                return articoloTrovatoNelSuccessore
            }
        }
    }
    return articolo
  }

  trovaNodo(id: number): Nodo | undefined{
    console.log(this)
    if(this.id === id) {
        return this
    }
    for(const successore of this.successori){
        const nodoTrovato = successore.trovaNodo(id)
        if(nodoTrovato){
            return nodoTrovato
        }
    }
    return undefined
  }

  calcolaAltezzaDeiSuccessori(): number{
    return this.calcolaAltezzaDeiSuccessoriPassoRicorsivo(this);
  }

  private calcolaAltezzaDeiSuccessoriPassoRicorsivo(nodo: Nodo): number{
    if(nodo.successori.length === 0) return 1;
    let altezzaMax: number = 0;
    for(const successore of nodo.successori){
      const altezza = this.calcolaAltezzaDeiSuccessoriPassoRicorsivo(successore)
      if(altezza > altezzaMax)
        altezzaMax = altezza;
    }
    return 1 + altezzaMax;
  }

  creaCopia(): Nodo{
    return this.creaCopiaRicorsivo(this);
  }

  creaCopiaRicorsivo(nodo: Nodo): Nodo{
    const newSuccessori: Nodo[] = [];
    for(const successore of nodo.successori){
      const newNodo = this.creaCopiaRicorsivo(successore);
      newSuccessori.push(newNodo);
    }

    const newArticoli: Articolo[] = [];
    for(const articolo of nodo.articoli){
      const newArticolo = new Articolo(articolo.nome, articolo.articolo)
      newArticoli.push(newArticolo);
    }

    const newNodo = new Nodo(nodo.nome);
    newNodo.successori = newSuccessori;
    newNodo.articoli = newArticoli;
    newNodo.aperto = nodo.aperto;
    return newNodo;
  }


  toString(): string{
    return `Nome: ${this.nome}, Successori: ${this.successori.map((nodo) => { return nodo.toString(); })}`;
  }

}

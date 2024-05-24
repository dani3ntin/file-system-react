import Elemento from "./Elemento.ts";

export default class Articolo extends Elemento {
  id: number;
  articolo: string;

  constructor(nome: string = "", articolo: string = "") {
    super(nome)
    this.id = -1;
    this.articolo = articolo;
  }

  setArticolo(nuovoArticolo: string): void {
    this.articolo = nuovoArticolo;
  }
  getArticolo(): string{
    return this.articolo;
  }
}

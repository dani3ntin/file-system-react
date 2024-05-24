
export default class Elemento {
  id: number;
  nome: string;

  constructor(nome: string = "") {
    this.id = -1;
    this.nome = nome;
  }

  getId(): number {
    return this.id;
  }

  setId(nuovoId: number): void {
    this.id = nuovoId;
  }

  getNome(): string {
    return this.nome;
  }

  setNome(nuovoNome: string): void {
    this.nome = nuovoNome;
  }
}

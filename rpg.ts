export abstract class Personagem {
  constructor(
    public nome: string,
    public hp: number,
    public hpMax: number,
    public ataqueBase: number,
    public elementoSprite: HTMLElement
  ) {}

  receberDano(dano: number): boolean {
    this.hp = Math.max(0, this.hp - dano);
    return this.hp <= 0;
  }
}

export class Cavaleiro extends Personagem {
  constructor(nome: string, hpMax: number, ataqueBase: number, sprite: HTMLElement) {
    super(nome, hpMax, hpMax, ataqueBase, sprite);
  }

  calcularDano(habilidade: string): number {
    return habilidade === "Tiro de Energia" ? this.ataqueBase * 1.5 : this.ataqueBase * 1.2;
  }
}

export class Guarda extends Personagem {
  constructor(nome: string, hpMax: number, ataqueBase: number, sprite: HTMLElement) {
    super(nome, hpMax, hpMax, ataqueBase, sprite);
  }

  calcularDano(): number {
    return this.ataqueBase;
  }
}
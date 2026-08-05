// ==========================================
// 1. CLASSES E ABSTRAÇÃO
// ==========================================

// Classe abstrata que serve de molde obrigatório
abstract class Personagem {
    // Uso de Parameter Properties para encapsulamento e código limpo
    constructor(
        public nome: string,
        protected hp: number,
        protected hpMax: number,
        protected ataque: number,
        protected defesa: number
    ) {}

    // Método que as classes filhas são obrigadas a implementar (Polimorfismo)
    abstract agir(alvo: Personagem): void;

    // Regra de Negócio: Cálculo de dano com mitigação pela defesa
    receberDano(danoBruto: number): void {
        const danoFinal = Math.max(1, danoBruto - this.defesa); // Dano mínimo é 1
        this.hp = Math.max(0, this.hp - danoFinal); // HP não fica negativo
        
        console.log(`     [DANO] ${this.nome} recebeu ${danoFinal} de dano! (HP Restante: ${this.hp}/${this.hpMax})`);
    }

    estaVivo(): boolean {
        return this.hp > 0;
    }

    getNome(): string {
        return this.nome;
    }
}

// ==========================================
// 2. HERANÇA E POLIMORFISMO
// ==========================================

class Guerreiro extends Personagem {
    // Atributo exclusivo do Guerreiro
    private pocoes: number;

    constructor(nome: string, hp: number, ataque: number, defesa: number, pocoesIniciais: number = 2) {
        super(nome, hp, hp, ataque, defesa);
        this.pocoes = pocoesIniciais;
    }

    // O Guerreiro decide se ataca ou usa poção
    agir(alvo: Personagem): void {
        if (this.hp < (this.hpMax * 0.4) && this.pocoes > 0) {
            this.curar();
        } else {
            console.log(`\n⚔️  ${this.nome} avança com sua espada contra ${alvo.getNome()}!`);
            const variacao = Math.floor(Math.random() * 6);
            alvo.receberDano(this.ataque + variacao);
        }
    }

    private curar(): void {
        const cura = 40;
        this.hp = Math.min(this.hpMax, this.hp + cura);
        this.pocoes--;
        console.log(`\n🧪 ${this.nome} usou uma poção! Recuperou vida. (HP: ${this.hp}/${this.hpMax}) - Poções restantes: ${this.pocoes}`);
    }
}

class Inimigo extends Personagem {
    constructor(nome: string, hp: number, ataque: number, defesa: number) {
        super(nome, hp, hp, ataque, defesa);
    }

    // O inimigo sempre ataca
    agir(alvo: Personagem): void {
        console.log(`\n👹 ${this.nome} prepara um golpe brutal contra ${alvo.getNome()}!`);
        const variacao = Math.floor(Math.random() * 4);
        alvo.receberDano(this.ataque + variacao);
    }
}

// ==========================================
// 3. ORQUESTRAÇÃO E COLABORAÇÃO
// ==========================================

class Batalha {
    // Batalha colabora com as instâncias de Personagem
    constructor(private jogador: Personagem, private inimigo: Personagem) {}

    iniciar(): void {
        console.log("=======================================");
        console.log(` INÍCIO DO COMBATE: ${this.jogador.getNome()} VS ${this.inimigo.getNome()}`);
        console.log("=======================================");

        let turno = 1;

        // Loop principal da simulação no console
        while (this.jogador.estaVivo() && this.inimigo.estaVivo()) {
            console.log(`\n--- TURNO ${turno} ---`);
            
            // Turno do Jogador
            this.jogador.agir(this.inimigo);

            if (!this.inimigo.estaVivo()) {
                console.log(`\n🏆 VITÓRIA! ${this.inimigo.getNome()} foi derrotado!`);
                break;
            }

            // Turno do Inimigo
            this.inimigo.agir(this.jogador);

            if (!this.jogador.estaVivo()) {
                console.log(`\n💀 DERROTA! ${this.jogador.getNome()} caiu em batalha...`);
                break;
            }

            turno++;
        }
        console.log("=======================================");
        console.log(" FIM DA SIMULAÇÃO");
        console.log("=======================================\n");
    }
}

// ==========================================
// 4. EXECUÇÃO
// ==========================================

const heroi = new Guerreiro("Cavaleiro Real", 100, 22, 8, 2);
const monstro = new Inimigo("Guarda Corrompido", 80, 16, 5);

const arena = new Batalha(heroi, monstro);
arena.iniciar();
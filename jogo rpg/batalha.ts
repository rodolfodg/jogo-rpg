// ==========================================
// 1. AS CLASSES (MOLDES E HERANÇA)
// ==========================================

// Classe base demonstrando abstração
abstract class Personagem {
    constructor(
        public nome: string,
        public hp: number,
        public hpMax: number
    ) {}

    // Método que será herdado e pode sofrer polimorfismo
    receberDano(dano: number): void {
        this.hp -= dano;
        if (this.hp < 0) this.hp = 0;
        console.log(`[DANO] ${this.nome} recebeu ${dano} de dano! (HP: ${this.hp}/${this.hpMax})`);
    }

    estaVivo(): boolean {
        return this.hp > 0;
    }
}

// O documento pede para demonstrar Herança e Polimorfismo com a classe Guerreiro.
class Guerreiro extends Personagem {
    constructor(nome: string, hp: number, public forcaAtaque: number) {
        super(nome, hp, hp);
    }

    // Ação do objeto interagindo com outro (Colaboração)
    atacar(alvo: Personagem): void {
        if (!this.estaVivo()) return;

        console.log(`\n⚔️ ${this.nome} levanta sua arma e ataca ${alvo.nome}!`);
        
        // Simula uma variação de dano baseada na força (Regra de Negócio)
        const danoCalculado = this.forcaAtaque + Math.floor(Math.random() * 5);
        alvo.receberDano(danoCalculado);
    }
}

// ==========================================
// 2. ORQUESTRAÇÃO E COLABORAÇÃO
// ==========================================

// Assim como a Via controla o Semáforo e o Carro[cite: 1], a Batalha controla os Guerreiros.
class Batalha {
    constructor(
        private jogador: Guerreiro,
        private inimigo: Guerreiro
    ) {}

    iniciarSimulacao(): void {
        console.log("=======================================");
        console.log(` INÍCIO DO COMBATE: ${this.jogador.nome} VS ${this.inimigo.nome}`);
        console.log("=======================================\n");

        let turno = 1;

        // Loop de turnos (Lógica de Negócio rodando no console)
        while (this.jogador.estaVivo() && this.inimigo.estaVivo()) {
            console.log(`--- Turno ${turno} ---`);
            
            // Turno do Jogador
            this.jogador.atacar(this.inimigo);
            
            // Verifica se o inimigo morreu antes de contra-atacar
            if (!this.inimigo.estaVivo()) {
                console.log(`\n🏆 VITÓRIA! ${this.inimigo.nome} caiu. ${this.jogador.nome} venceu a batalha!`);
                break;
            }

            // Turno do Inimigo
            this.inimigo.atacar(this.jogador);

            if (!this.jogador.estaVivo()) {
                console.log(`\n💀 DERROTA! ${this.jogador.nome} caiu em batalha.`);
                break;
            }

            turno++;
        }
    }
}

// ==========================================
// 3. EXECUÇÃO DA SIMULAÇÃO (ENTRADAS E SAÍDAS)
// ==========================================

// Instanciando os objetos (Representação realista dos domínios)
const cavaleiro = new Guerreiro("Cavaleiro Real", 100, 20); // Usaria a lógica da imagem Medieval-Knight
const guarda = new Guerreiro("Guarda Corrompido", 80, 15);   // Usaria a lógica do Knight-PNG

// Iniciando a orquestração
const arena = new Batalha(cavaleiro, guarda);
arena.iniciarSimulacao();
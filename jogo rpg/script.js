// ==========================================
// PARTE 3: CLASSES E ORIENTAÇÃO A OBJETOS
// ==========================================

// Classe Base (Abstração)
class Personagem {
    constructor(nome, nivel, hpMax, ataque, defesa, critico, esquiva) {
        this.nome = nome;
        this.nivel = nivel;
        this.hpMax = hpMax;
        this.hp = hpMax;
        this.ataque = ataque;
        this.defesaBase = defesa;
        this.defesa = defesa; // A defesa atual pode ser alterada (ex: ao defender)
        this.critico = critico; // Chance em %
        this.esquiva = esquiva; // Chance em %
    }

    estaVivo() {
        return this.hp > 0;
    }

    // Calcula se o personagem desviou
    tentarEsquiva() {
        return (Math.random() * 100) <= this.esquiva;
    }

    // Recebe dano aplicando a fórmula de mitigação pela defesa
    receberDano(danoBruto) {
        if (this.tentarEsquiva()) {
            return "esquivou";
        }
        // Dano mínimo é 1
        let danoFinal = Math.max(1, Math.floor(danoBruto - this.defesa));
        this.hp = Math.max(0, this.hp - danoFinal);
        return danoFinal;
    }
}

// Classe do Herói (Herança)
class Jogador extends Personagem {
    constructor() {
        // nome, nivel, hpMax, ataque, defesa, critico(%), esquiva(%)
        super("Cavaleiro", 1, 100, 20, 10, 15, 8);
        this.mpMax = 50;
        this.mp = 50;
        this.pocoes = 3;
    }

    // Ação: Defender (Aumenta defesa temporariamente)
    ativarDefesa() {
        this.defesa = this.defesaBase + 15;
    }

    reverterDefesa() {
        this.defesa = this.defesaBase;
    }

    // Ação: Usar Poção
    usarPocao() {
        if (this.pocoes <= 0) return 0;
        this.pocoes--;
        const cura = 40;
        this.hp = Math.min(this.hpMax, this.hp + cura);
        return cura;
    }

    // Ação: Magia
    usarMagia() {
        if (this.mp < 20) return false;
        this.mp -= 20;
        // Magia é um ataque forte que ignora a variação básica
        return this.ataque * 2.5; 
    }

    // Lógica de ataque físico com chance de crítico
    calcularAtaque() {
        let dano = this.ataque + Math.floor(Math.random() * 6); // Variação de dano
        let ehCritico = (Math.random() * 100) <= this.critico;
        if (ehCritico) dano *= 2;
        return { dano, ehCritico };
    }
}

// Classe do Inimigo (Herança)
class Inimigo extends Personagem {
    constructor() {
        // nome, nivel, hpMax, ataque, defesa, critico(%), esquiva(%)
        super("Guarda", 1, 80, 15, 6, 5, 5);
    }

    calcularAtaque() {
        let dano = this.ataque + Math.floor(Math.random() * 4);
        let ehCritico = (Math.random() * 100) <= this.critico;
        if (ehCritico) dano *= 1.5; // Crítico do inimigo é um pouco mais fraco
        return { dano, ehCritico };
    }
}


// ==========================================
// PARTE 4: INTEGRAÇÃO COM A INTERFACE (DOM)
// ==========================================

let heroi;
let vilao;
let emCombate = false;

// Função utilitária para pausar a execução (criar ritmo na batalha)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Inicializa ou Reinicia o Jogo
function iniciarJogo() {
    heroi = new Jogador();
    vilao = new Inimigo();
    
    // Reseta visual da interface
    document.getElementById('cavaleiro').classList.remove('anim-morte');
    document.getElementById('guarda').classList.remove('anim-morte');
    document.getElementById('botoes-acao').style.display = 'grid';
    document.getElementById('btn-reiniciar').style.display = 'none';
    
    atualizarHUD();
    escreverMensagem("O combate começou! Escolha sua ação.");
}

// Atualiza as barras de vida, mana e textos na tela
function atualizarHUD() {
    // Barras de HP
    const pctHpCav = (heroi.hp / heroi.hpMax) * 100;
    const pctHpGua = (vilao.hp / vilao.hpMax) * 100;
    document.getElementById('hp-cav').style.width = pctHpCav + '%';
    document.getElementById('hp-gua').style.width = pctHpGua + '%';

    // Textos de Status
    document.getElementById('hp-txt-cav').innerText = `${heroi.hp}/${heroi.hpMax}`;
    document.getElementById('mp-txt-cav').innerText = `${heroi.mp}/${heroi.mpMax}`;
    document.getElementById('hp-txt-gua').innerText = `${vilao.hp}/${vilao.hpMax}`;
    
    // Quantidade de poções
    document.getElementById('qtd-pocao').innerText = heroi.pocoes;
    
    // Desativar botão de poção e magia se não tiver recursos
    document.getElementById('btn-pocao').disabled = heroi.pocoes <= 0;
    document.getElementById('btn-magia').disabled = heroi.mp < 20;
}

// Exibe mensagens no painel
function escreverMensagem(msg) {
    document.getElementById('mensagem-status').innerText = msg;
}

// Cria o texto flutuante de dano ou cura
function mostrarFeedbackVisual(alvoId, valor, tipo) {
    const txt = document.createElement('div');
    txt.className = tipo === 'cura' ? 'texto-dano texto-cura' : 'texto-dano';
    
    if (tipo === 'esquiva') {
        txt.innerText = "Errou!";
        txt.style.color = "#bdc3c7";
    } else if (tipo === 'critico') {
        txt.innerText = `-${valor} CRÍTICO!`;
        txt.style.color = "#f1c40f";
        txt.style.fontSize = "28px";
    } else if (tipo === 'cura') {
        txt.innerText = `+${valor}`;
    } else {
        txt.innerText = `-${valor}`;
    }
    
    document.getElementById(alvoId).appendChild(txt);
    setTimeout(() => txt.remove(), 800);
}

function encerrarBatalha(vitoria) {
    document.getElementById('botoes-acao').style.display = 'none';
    document.getElementById('btn-reiniciar').style.display = 'inline-block';
    
    if (vitoria) {
        escreverMensagem(`🏆 VITÓRIA! ${vilao.nome} foi derrotado! Você ganhou 50 XP.`);
        document.getElementById('guarda').classList.add('anim-morte');
    } else {
        escreverMensagem(`💀 DERROTA! O ${heroi.nome} sucumbiu aos ferimentos.`);
        document.getElementById('cavaleiro').classList.add('anim-morte');
    }
}

// ==========================================
// CONTROLADOR DE TURNOS E ANIMAÇÕES
// ==========================================

async function acaoJogador(tipoAcao) {
    if (emCombate || !heroi.estaVivo()) return;
    emCombate = true; // Trava os botões
    
    heroi.reverterDefesa(); // Reseta defesa de turnos anteriores
    
    // ELEMENTOS VISUAIS
    const cav = document.getElementById('cavaleiro');
    const gua = document.getElementById('guarda');
    const espCav = document.getElementById('esp-cav');
    const espGua = document.getElementById('esp-gua');

    // =================================
    // 1. TURNO DO JOGADOR
    // =================================
    
    if (tipoAcao === 'atacar') {
        escreverMensagem("Você avançou para atacar!");
        
        cav.classList.add('anim-dash-cav');
        gua.classList.add('anim-dash-gua');
        await esperar(350);

        espCav.classList.add('anim-golpe-cav');
        espGua.classList.add('anim-golpe-gua');
        await esperar(150);

        // Lógica de Dano
        const ataqueFisico = heroi.calcularAtaque();
        const resultado = vilao.receberDano(ataqueFisico.dano);

        if (resultado === "esquivou") {
            mostrarFeedbackVisual('guarda', 0, 'esquiva');
        } else {
            mostrarFeedbackVisual('guarda', resultado, ataqueFisico.ehCritico ? 'critico' : 'dano');
            gua.classList.add('anim-dano');
        }

        atualizarHUD();
        await esperar(500);

        // Reset visual
        espCav.classList.remove('anim-golpe-cav');
        espGua.classList.remove('anim-golpe-gua');
        gua.classList.remove('anim-dano');
        cav.classList.remove('anim-dash-cav');
        gua.classList.remove('anim-dash-gua');
        cav.classList.add('anim-retornar');
        gua.classList.add('anim-retornar');
        await esperar(400);
        cav.classList.remove('anim-retornar');
        gua.classList.remove('anim-retornar');

    } 
    else if (tipoAcao === 'defender') {
        escreverMensagem("Você levanta seu escudo e adota postura defensiva!");
        heroi.ativarDefesa();
        await esperar(1000);
    } 
    else if (tipoAcao === 'magia') {
        const danoMagicoBruto = heroi.usarMagia();
        escreverMensagem("Você conjurou um ataque mágico poderoso!");
        
        // Efeito visual de magia rápido
        cav.classList.add('anim-dano'); 
        await esperar(400);
        cav.classList.remove('anim-dano');
        
        const resultado = vilao.receberDano(danoMagicoBruto);
        if (resultado !== "esquivou") gua.classList.add('anim-dano');
        mostrarFeedbackVisual('guarda', resultado, 'magico');
        
        atualizarHUD();
        await esperar(600);
        gua.classList.remove('anim-dano');
    }
    else if (tipoAcao === 'pocao') {
        const cura = heroi.usarPocao();
        escreverMensagem(`Você bebeu uma poção e recuperou ${cura} HP!`);
        mostrarFeedbackVisual('cavaleiro', cura, 'cura');
        atualizarHUD();
        await esperar(1000);
    }

    // Verifica se Inimigo morreu
    if (!vilao.estaVivo()) {
        encerrarBatalha(true);
        emCombate = false;
        return;
    }

    // =================================
    // 2. TURNO DO INIMIGO
    // =================================
    escreverMensagem(`O ${vilao.nome} está contra-atacando!`);
    await esperar(800);

    gua.classList.add('anim-dash-gua');
    await esperar(350);
    espGua.classList.add('anim-golpe-gua');
    await esperar(150);

    const ataqueInimigo = vilao.calcularAtaque();
    const resultadoInimigo = heroi.receberDano(ataqueInimigo.dano);

    if (resultadoInimigo === "esquivou") {
        mostrarFeedbackVisual('cavaleiro', 0, 'esquiva');
    } else {
        mostrarFeedbackVisual('cavaleiro', resultadoInimigo, ataqueInimigo.ehCritico ? 'critico' : 'dano');
        cav.classList.add('anim-dano');
    }

    atualizarHUD();
    await esperar(500);

    // Reset Visual Inimigo
    espGua.classList.remove('anim-golpe-gua');
    cav.classList.remove('anim-dano');
    gua.classList.remove('anim-dash-gua');
    gua.classList.add('anim-retornar');
    await esperar(400);
    gua.classList.remove('anim-retornar');

    // Verifica se Herói morreu
    if (!heroi.estaVivo()) {
        encerrarBatalha(false);
        emCombate = false;
        return;
    }

    escreverMensagem("Sua vez! Escolha sua ação.");
    emCombate = false; // Libera os botões para o próximo turno
}

function reiniciar() {
    iniciarJogo();
}

// Inicia o jogo automaticamente ao carregar a página
window.onload = iniciarJogo;
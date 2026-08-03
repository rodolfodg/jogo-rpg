const somAtaque = new Audio('som_ataque.mp3'); 
const somImpacto = new Audio('som_impacto.mp3');

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function executarTurnoCompleto(cavaleiro, guarda, habilidade) {
  const cavEl = cavaleiro.elementoSprite;
  const guarEl = guarda.elementoSprite;

  document.getElementById('mensagem-status').innerText = `Cavaleiro usou ${habilidade}!`;

  // === ATAQUE DO CAVALEIRO ===
  if (habilidade === 'Golpe Físico') {
    // AMBOS CORREM EM DIREÇÃO AO CENTRO PARA SE CHOCAR
    cavEl.classList.add('anim-chocando-cavaleiro');
    guarEl.classList.add('anim-chocando-guarda');
    somAtaque.play().catch(() => {});
    
    await esperar(300); // Momento da colisão no meio

    // Efeito de impacto no meio e tremor
    guarEl.classList.add('anim-efeito-impacto', 'anim-tremor');
    cavEl.classList.add('anim-efeito-impacto', 'anim-tremor');
    somImpacto.play().catch(() => {});

    // Aplica o Dano no Guarda
    const danoCavaleiro = cavaleiro.calcularDano(habilidade);
    const guardaMorreu = guarda.receberDano(danoCavaleiro);
    exibirNumeroDano(guarEl, danoCavaleiro);
    atualizarBarraHP('hp-guarda', guarda.hp, guarda.hpMax);

    await esperar(500);

    // Limpeza de animações do choque
    guarEl.classList.remove('anim-efeito-impacto', 'anim-tremor', 'anim-chocando-guarda');
    cavEl.classList.remove('anim-efeito-impacto', 'anim-tremor', 'anim-chocando-cavaleiro');

    // Ambos retornam para suas posições originais
    cavEl.classList.add('anim-retornar');
    guarEl.classList.add('anim-retornar');
    await esperar(400);
    cavEl.classList.remove('anim-retornar');
    guarEl.classList.remove('anim-retornar');

    if (guardaMorreu) {
      guarEl.classList.add('anim-morte');
      await esperar(1000);
      return { fimDeJogo: true, mensagem: "Vitória! O Guarda foi derrotado." };
    }

  } else {
    // TIRO DE ENERGIA (Ataque a Distância)
    const projetil = document.createElement('div');
    projetil.className = 'projetil-tiro';
    document.getElementById('palco').appendChild(projetil);
    somAtaque.play().catch(() => {});
    
    await esperar(400);
    projetil.remove();

    guarEl.classList.add('anim-efeito-impacto', 'anim-tremor');
    somImpacto.play().catch(() => {});
    
    const danoCavaleiro = cavaleiro.calcularDano(habilidade);
    const guardaMorreu = guarda.receberDano(danoCavaleiro);
    
    exibirNumeroDano(guarEl, danoCavaleiro);
    atualizarBarraHP('hp-guarda', guarda.hp, guarda.hpMax);
    await esperar(500);

    guarEl.classList.remove('anim-efeito-impacto', 'anim-tremor');

    if (guardaMorreu) {
      guarEl.classList.add('anim-morte');
      await esperar(1000);
      return { fimDeJogo: true, mensagem: "Vitória! O Guarda foi derrotado." };
    }
  }

  // === REVIDE DO GUARDA (CONTRA-ATAQUE) ===
  await esperar(400);
  document.getElementById('mensagem-status').innerText = "O Guarda está revidando!";

  // O Guarda avança até o Cavaleiro para responder ao ataque
  guarEl.classList.add('anim-chocando-guarda');
  somAtaque.play().catch(() => {});
  await esperar(300);

  cavEl.classList.add('anim-efeito-impacto', 'anim-tremor');
  somImpacto.play().catch(() => {});

  const danoGuarda = guarda.calcularDano();
  const cavaleiroMorreu = cavaleiro.receberDano(danoGuarda);

  exibirNumeroDano(cavEl, danoGuarda);
  atualizarBarraHP('hp-cavaleiro', cavaleiro.hp, cavaleiro.hpMax);
  await esperar(500);

  cavEl.classList.remove('anim-efeito-impacto', 'anim-tremor');
  guarEl.classList.remove('anim-chocando-guarda');
  guarEl.classList.add('anim-retornar');
  await esperar(400);
  guarEl.classList.remove('anim-retornar');

  if (cavaleiroMorreu) {
    cavEl.classList.add('anim-morte');
    await esperar(1000);
    return { fimDeJogo: true, mensagem: "Derrota! O Cavaleiro caiu em batalha." };
  }

  return { fimDeJogo: false };
}

function exibirNumeroDano(alvoEl, valor) {
  const popup = document.createElement('div');
  popup.className = 'texto-dano';
  popup.innerText = `-${Math.round(valor)}`;
  alvoEl.appendChild(popup);
  setTimeout(() => popup.remove(), 800);
}

function atualizarBarraHP(idBarra, hpAtual, hpMax) {
  const percentual = Math.max(0, (hpAtual / hpMax) * 100);
  const barraEl = document.getElementById(idBarra);
  if (barraEl) {
    barraEl.style.width = `${percentual}%`;
  }
}
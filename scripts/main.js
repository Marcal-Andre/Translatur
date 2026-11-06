/* ==========================================================================
   Main Application Entrypoint
   Inicialização de módulos e interações globais
   ========================================================================== */

import { initCarousel } from './carousel.js';
import { setupSearch, showToast } from './search.js';
import { initTestimonials } from './testimonials.js';
import { setupMobileMenu } from './mobileMenu.js';

const LGPD_STORAGE_KEY = 'translatur_lgpd_consent_v1';

document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de componentes
  initCarousel();
  setupSearch();
  initTestimonials();
  setupMobileMenu();
  handleHeaderScroll();
  setupNewsletter();
  setupLGPDBanner();
  setupComplianceLinks();
});

// Efeito de rolagem do cabeçalho
function handleHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Formulário da Newsletter
function setupNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('Obrigado! Você receberá ofertas e cupons exclusivos no seu e-mail.');
      input.value = '';
    }
  });
}

// Banner de Consentimento LGPD & Privacidade (Lei nº 13.709/2018)
function setupLGPDBanner() {
  try {
    const hasConsented = localStorage.getItem(LGPD_STORAGE_KEY);
    if (hasConsented) return;
  } catch (err) {
    // LocalStorage indisponível em modo privado restrito
  }

  const banner = document.createElement('div');
  banner.className = 'lgpd-banner';
  banner.id = 'lgpd-consent-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Consentimento de Privacidade e Cookies');

  banner.innerHTML = `
    <div class="lgpd-content">
      <div class="lgpd-icon"><i class="fas fa-shield-halved"></i></div>
      <div class="lgpd-text">
        <strong>Privacidade & Segurança de Dados (LGPD)</strong>
        <p>
          Utilizamos cookies essenciais e padrões bancários de segurança conforme a <strong>Lei nº 13.709/2018 (LGPD)</strong> para proteger seus dados, assegurar cotações precisas e garantir a melhor experiência de viagem.
        </p>
      </div>
    </div>
    <div class="lgpd-actions">
      <button type="button" class="btn-lgpd-pref" id="btn-lgpd-policy">Ler Políticas</button>
      <button type="button" class="btn-lgpd-accept" id="btn-lgpd-accept">Prosseguir e Aceitar</button>
    </div>
  `;

  document.body.appendChild(banner);

  // Animação suave de entrada após breve intervalo
  setTimeout(() => {
    banner.classList.add('show');
  }, 900);

  banner.querySelector('#btn-lgpd-accept')?.addEventListener('click', () => {
    try {
      localStorage.setItem(LGPD_STORAGE_KEY, JSON.stringify({ consentedAt: new Date().toISOString() }));
    } catch (e) {}
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
    showToast('Preferências de privacidade e segurança salvas.');
  });

  banner.querySelector('#btn-lgpd-policy')?.addEventListener('click', () => {
    openComplianceModal('privacy');
  });
}

// Links institucionais de conformidade no rodapé
function setupComplianceLinks() {
  document.querySelectorAll('a[href="#"]').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text.includes('privacidade')) {
      link.addEventListener('click', (e) => { e.preventDefault(); openComplianceModal('privacy'); });
    } else if (text.includes('termos')) {
      link.addEventListener('click', (e) => { e.preventDefault(); openComplianceModal('terms'); });
    } else if (text.includes('cancelamento')) {
      link.addEventListener('click', (e) => { e.preventDefault(); openComplianceModal('cancellation'); });
    }
  });
}

// Modal Central de Conformidade Legal, LGPD e CDC
export function openComplianceModal(section = 'privacy') {
  let modalOverlay = document.getElementById('compliance-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'compliance-modal';
    modalOverlay.innerHTML = `
      <div class="modal-card compliance-modal-card">
        <button class="modal-close" aria-label="Fechar Modal">&times;</button>
        <div id="compliance-modal-body"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const modalBody = modalOverlay.querySelector('#compliance-modal-body');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <h2><i class="fas fa-shield-halved" style="color: #0284c7;"></i> Compromisso com a Segurança e Transparência</h2>
    <p style="color: #64748b; font-size: 0.95rem;">Translatur Viagens e Turismo Ltda. • CNPJ: 00.000.000/0001-00 • CADASTUR: Regular sob normas do Ministério do Turismo.</p>

    <div class="compliance-badge-grid">
      <div class="compliance-badge-card">
        <strong><i class="fas fa-lock"></i> Criptografia SSL</strong>
        Transmissão de dados sob protocolo TLS 1.3 seguro.
      </div>
      <div class="compliance-badge-card">
        <strong><i class="fas fa-id-card"></i> LGPD em Dia</strong>
        Total controle do titular sobre dados pessoais (Art. 18).
      </div>
      <div class="compliance-badge-card">
        <strong><i class="fas fa-handshake"></i> CDC e ANAC</strong>
        Cumprimento integral do Art. 49 e Resolução 400.
      </div>
    </div>

    <h3>1. Política de Privacidade & Proteção de Dados (LGPD)</h3>
    <p>
      Em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei Federal nº 13.709/2018)</strong>, a Translatur Viagens coleta estritamente as informações necessárias para a cotação, reserva e emissão de passagens aéreas, seguros e hospedagens. Seus dados nunca são comercializados com terceiros e seu tráfego é blindado por chaves criptográficas.
    </p>

    <h3>2. Termos e Condições de Serviços de Viagem</h3>
    <ul>
      <li><strong>Intermediação Qualificada:</strong> Atuamos como agência autorizada junto a companhias aéreas associadas à IATA, redes hoteleiras homologadas e seguradoras regulamentadas pela SUSEP.</li>
      <li><strong>Documentação do Viajante:</strong> O passageiro é responsável por portar documento de identidade oficial válido (RG/Passaporte) e atender aos requisitos de visto e vacinas exigidos pelos países de destino.</li>
    </ul>

    <h3>3. Políticas Claras de Cancelamento, Reembolso e Remarcação</h3>
    <ul>
      <li><strong>Direito de Arrependimento (CDC Art. 49):</strong> Para compras realizadas por canais digitais, o consumidor tem o prazo legal de 7 (sete) dias corridos após a contratação para exercer a desistência sem ônus, resguardadas regras específicas de voos emitidos em menos de 24h conforme Resolução ANAC nº 400.</li>
      <li><strong>Tarifas Reembolsáveis vs. Promocionais:</strong> As condições de remarcação e franquia de bagagem seguem expressamente a regra tarifária da companhia parceira contratada, informada com total clareza antes da emissão.</li>
      <li><strong>Canal Direto de Suporte:</strong> Nossa equipe de pós-venda está à disposição para intermediar alterações, estornos e créditos decorrentes de imprevistos operacionais.</li>
    </ul>

    <div style="margin-top: 24px; text-align: center;">
      <button type="button" class="btn-lgpd-accept" style="width: auto; padding: 12px 30px; font-size: 0.95rem;" onclick="document.getElementById('compliance-modal').classList.remove('active');">
        Entendido e de Acordo
      </button>
    </div>
  `;

  modalOverlay.classList.add('active');

  const closeBtn = modalOverlay.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.onclick = () => modalOverlay.classList.remove('active');
  }

  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  };
}
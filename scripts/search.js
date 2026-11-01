/* ==========================================================================
   Search & Dynamic Travel Engine
   Integração com API de imagens (Wikimedia/Wikipedia), gerador inteligente
   de destinos mundiais, favoritos em localStorage e calculadora no modal
   ========================================================================== */

import { fetchDestinationData, preloadImage } from './imageService.js';

const FAVORITES_STORAGE_KEY = 'translatur_favorites_v1';

// Catálogo base de pacotes com dados autênticos do mercado brasileiro
export const travelPackages = [
  {
    id: 'porto-galinhas',
    category: 'nordeste',
    title: 'Porto de Galinhas',
    apiQuery: 'Porto de Galinhas',
    location: 'Pernambuco, Brasil',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80',
    badge: 'Mais Vendido',
    badgeType: 'popular',
    duration: '5 dias / 4 noites',
    inclusions: ['Aéreo ida e volta', 'Resort beira-mar', 'Café da manhã', 'Translado privativo'],
    rating: 4.9,
    reviewsCount: 214,
    price: 1890,
    installments: 12,
    highlights: 'Piscinas naturais de águas mornas, passeio de jangada e estrutura completa de resort à beira-mar.'
  },
  {
    id: 'gramado-canela',
    category: 'serra',
    title: 'Gramado & Canela',
    apiQuery: 'Gramado',
    location: 'Serra Gaúcha, RS',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    badge: 'Charme & Alta Gastronomia',
    badgeType: 'promo',
    duration: '4 dias / 3 noites',
    inclusions: ['Voo direto', 'Hotel boutique alpino', 'Café colonial', 'Tour Vinícolas'],
    rating: 4.95,
    reviewsCount: 182,
    price: 1540,
    installments: 12,
    highlights: 'Passeio Maria Fumaça, degustação no Vale dos Vinhedos e os melhores cafés coloniais da serra gaúcha.'
  },
  {
    id: 'cancun-resort',
    category: 'internacional',
    title: 'Cancún All-Inclusive',
    apiQuery: 'Cancun beach',
    location: 'Riviera Maya, México',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
    badge: 'All Inclusive 24h',
    badgeType: 'popular',
    duration: '7 dias / 6 noites',
    inclusions: ['Aéreo classe turista', 'Resort 5 estrelas', 'Open Food & Drink', 'Passeio Isla Mujeres'],
    rating: 4.88,
    reviewsCount: 165,
    price: 4980,
    installments: 12,
    highlights: 'Mar azul turquesa do Caribe, gastronomia internacional e entrada inclusa para os melhores clubes de praia.'
  },
  {
    id: 'maragogi-alagoas',
    category: 'nordeste',
    title: 'Maragogi Costa dos Corais',
    apiQuery: 'Maragogi',
    location: 'Alagoas, Brasil',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    badge: 'Caribe Brasileiro',
    badgeType: 'promo',
    duration: '6 dias / 5 noites',
    inclusions: ['Aéreo via Maceió ou Recife', 'Pousada de charme', 'Passeio Galés', 'Translado in/out'],
    rating: 4.92,
    reviewsCount: 147,
    price: 2190,
    installments: 12,
    highlights: 'Mergulho nas maiores barreiras de corais do Brasil, piscinas naturais cristalinas e praias preservadas.'
  },
  {
    id: 'paris-roma',
    category: 'internacional',
    title: 'Paris & Roma Clássicos',
    apiQuery: 'Paris France',
    location: 'França & Itália',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
    badge: 'Roteiro Cultural',
    badgeType: 'popular',
    duration: '10 dias / 9 noites',
    inclusions: ['Aéreo intercontinental', 'Trem de alta velocidade', 'Hotéis 4★ centrais', 'Seguro Viagem €30k'],
    rating: 4.96,
    reviewsCount: 98,
    price: 8490,
    installments: 12,
    highlights: 'Subida na Torre Eiffel, visita ao Museu do Louvre e Coliseu Romano com assessoria e guia em português.'
  },
  {
    id: 'santiago-andes',
    category: 'internacional',
    title: 'Santiago & Cordilheira dos Andes',
    apiQuery: 'Santiago Chile Andes',
    location: 'Chile',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    badge: 'Neve & Vinhos',
    badgeType: 'promo',
    duration: '5 dias / 4 noites',
    inclusions: ['Aéreo ida e volta', 'Hotel em Providencia', 'Tour Valle Nevado', 'Visita Concha y Toro'],
    rating: 4.87,
    reviewsCount: 119,
    price: 2890,
    installments: 12,
    highlights: 'Paisagens deslumbrantes da Cordilheira dos Andes com paradas nas melhores vinícolas da América do Sul.'
  }
];

// Origens brasileiras e aeroportos de referência para o Autocomplete
export const popularOrigins = [
  { city: 'São Paulo', code: 'SAO', airport: 'Todos os aeroportos (GRU / CGH / VCP)', state: 'SP, Brasil', badge: 'Hub Principal' },
  { city: 'São Paulo - Guarulhos', code: 'GRU', airport: 'Aeroporto Internacional de Guarulhos', state: 'SP, Brasil', badge: 'Internacional' },
  { city: 'São Paulo - Congonhas', code: 'CGH', airport: 'Aeroporto de Congonhas', state: 'SP, Brasil', badge: 'Central' },
  { city: 'Campinas - Viracopos', code: 'VCP', airport: 'Aeroporto Internacional de Viracopos', state: 'SP, Brasil', badge: 'Hub Azul' },
  { city: 'Rio de Janeiro', code: 'RIO', airport: 'Todos os aeroportos (GIG / SDU)', state: 'RJ, Brasil', badge: 'Hub' },
  { city: 'Rio de Janeiro - Santos Dumont', code: 'SDU', airport: 'Aeroporto Santos Dumont', state: 'RJ, Brasil', badge: 'Centro' },
  { city: 'Rio de Janeiro - Galeão', code: 'GIG', airport: 'Aeroporto Internacional Tom Jobim', state: 'RJ, Brasil', badge: 'Internacional' },
  { city: 'Belo Horizonte - Confins', code: 'CNF', airport: 'Aeroporto Internacional de Confins', state: 'MG, Brasil', badge: 'Hub Minas' },
  { city: 'Brasília', code: 'BSB', airport: 'Aeroporto Internacional Pres. Juscelino Kubitschek', state: 'DF, Brasil', badge: 'Hub Central' },
  { city: 'Curitiba', code: 'CWB', airport: 'Aeroporto Internacional Afonso Pena', state: 'PR, Brasil', badge: 'Sul' },
  { city: 'Porto Alegre', code: 'POA', airport: 'Aeroporto Internacional Salgado Filho', state: 'RS, Brasil', badge: 'Sul' },
  { city: 'Salvador', code: 'SSA', airport: 'Aeroporto Internacional Dep. Luís Eduardo Magalhães', state: 'BA, Brasil', badge: 'Nordeste' },
  { city: 'Recife', code: 'REC', airport: 'Aeroporto Internacional dos Guararapes', state: 'PE, Brasil', badge: 'Hub Nordeste' },
  { city: 'Fortaleza', code: 'FOR', airport: 'Aeroporto Internacional Pinto Martins', state: 'CE, Brasil', badge: 'Hub Nordeste' },
  { city: 'Florianópolis', code: 'FLN', airport: 'Aeroporto Internacional Hercílio Luz', state: 'SC, Brasil', badge: 'Sul' },
  { city: 'Goiânia', code: 'GYN', airport: 'Aeroporto Santa Genoveva', state: 'GO, Brasil', badge: 'Centro-Oeste' },
  { city: 'Manaus', code: 'MAO', airport: 'Aeroporto Internacional Eduardo Gomes', state: 'AM, Brasil', badge: 'Norte' },
  { city: 'Belém', code: 'BEL', airport: 'Aeroporto Internacional Val-de-Cans', state: 'PA, Brasil', badge: 'Norte' },
  { city: 'Vitória', code: 'VIX', airport: 'Aeroporto Eurico de Aguiar Salles', state: 'ES, Brasil', badge: 'Sudeste' },
  { city: 'Natal', code: 'NAT', airport: 'Aeroporto Internacional Gov. Aluízio Alves', state: 'RN, Brasil', badge: 'Nordeste' },
  { city: 'Maceió', code: 'MCZ', airport: 'Aeroporto Internacional Zumbi dos Palmares', state: 'AL, Brasil', badge: 'Nordeste' },
  { city: 'João Pessoa', code: 'JPA', airport: 'Aeroporto Internacional Pres. Castro Pinto', state: 'PB, Brasil', badge: 'Nordeste' },
  { city: 'Cuiabá', code: 'CGB', airport: 'Aeroporto Internacional Marechal Rondon', state: 'MT, Brasil', badge: 'Centro-Oeste' },
  { city: 'Campo Grande', code: 'CGR', airport: 'Aeroporto Internacional de Campo Grande', state: 'MS, Brasil', badge: 'Centro-Oeste' },
  { city: 'Foz do Iguaçu', code: 'IGU', airport: 'Aeroporto Internacional de Foz do Iguaçu', state: 'PR, Brasil', badge: 'Turismo' },
  { city: 'Navegantes', code: 'NVT', airport: 'Aeroporto Internacional Min. Victor Konder', state: 'SC, Brasil', badge: 'Litoral SC' },
  { city: 'Aracaju', code: 'AJU', airport: 'Aeroporto Internacional Santa Maria', state: 'SE, Brasil', badge: 'Nordeste' },
  { city: 'São Luís', code: 'SLZ', airport: 'Aeroporto Internacional Marechal Cunha Machado', state: 'MA, Brasil', badge: 'Nordeste' },
  { city: 'Teresina', code: 'THE', airport: 'Aeroporto Senador Petrônio Portella', state: 'PI, Brasil', badge: 'Nordeste' }
];

// Destinos sugeridos para o Autocomplete (Nacionais & Internacionais)
export const popularDestinations = [
  { name: 'Porto de Galinhas, PE', query: 'Porto de Galinhas', state: 'Litoral Sul, Pernambuco', badge: 'Praias & Piscinas', thumb: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=120&q=80' },
  { name: 'Gramado e Canela, RS', query: 'Gramado', state: 'Serra Gaúcha, Rio Grande do Sul', badge: 'Charme & Frio', thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=120&q=80' },
  { name: 'Cancún & Riviera Maya', query: 'Cancun', state: 'Quintana Roo, México', badge: 'All-Inclusive', thumb: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=120&q=80' },
  { name: 'Maragogi & Costa dos Corais', query: 'Maragogi', state: 'Alagoas, Brasil', badge: 'Caribe Brasileiro', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80' },
  { name: 'Fernando de Noronha, PE', query: 'Fernando de Noronha', state: 'Pernambuco, Brasil', badge: 'Santuário Ecológico', thumb: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=120&q=80' },
  { name: 'Paris & Roma Clássicos', query: 'Paris', state: 'França e Itália, Europa', badge: 'História & Cultura', thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80' },
  { name: 'Santiago & Valle Nevado', query: 'Santiago Chile', state: 'Cordilheira dos Andes, Chile', badge: 'Neve & Vinhos', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=120&q=80' },
  { name: 'Orlando & Parques Temáticos', query: 'Orlando Florida', state: 'Flórida, Estados Unidos', badge: 'Magia & Compras', thumb: 'https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?auto=format&fit=crop&w=120&q=80' },
  { name: 'Bariloche & Lagos Andinos', query: 'Bariloche', state: 'Patagônia, Argentina', badge: 'Neve & Chocolates', thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=120&q=80' },
  { name: 'Jericoacoara, CE', query: 'Jericoacoara', state: 'Ceará, Brasil', badge: 'Dunas & Lagoas', thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=120&q=80' },
  { name: 'Lençóis Maranhenses, MA', query: 'Lencois Maranhenses', state: 'Maranhão, Brasil', badge: 'Natureza Única', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80' },
  { name: 'Foz do Iguaçu (Cataratas), PR', query: 'Foz do Iguacu', state: 'Paraná, Brasil', badge: 'Maravilha Mundial', thumb: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=120&q=80' },
  { name: 'Bonito & Pantanal, MS', query: 'Bonito Mato Grosso do Sul', state: 'Mato Grosso do Sul, Brasil', badge: 'Ecoturismo', thumb: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=120&q=80' },
  { name: 'Jalapão, TO', query: 'Jalapao', state: 'Tocantins, Brasil', badge: 'Fervedouros', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80' },
  { name: 'Salvador & Praia do Forte, BA', query: 'Salvador Bahia', state: 'Bahia, Brasil', badge: 'Axé & História', thumb: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=120&q=80' },
  { name: 'Maceió & São Miguel dos Milagres, AL', query: 'Maceio Alagoas', state: 'Alagoas, Brasil', badge: 'Piscinas Naturais', thumb: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=120&q=80' },
  { name: 'Natal & Praia da Pipa, RN', query: 'Praia da Pipa', state: 'Rio Grande do Norte, Brasil', badge: 'Falésias & Golfinhos', thumb: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=120&q=80' },
  { name: 'Florianópolis & Balneário, SC', query: 'Florianopolis', state: 'Santa Catarina, Brasil', badge: 'Ilha da Magia', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80' },
  { name: 'Rio de Janeiro (Copacabana & Cristo), RJ', query: 'Rio de Janeiro', state: 'Rio de Janeiro, Brasil', badge: 'Cidade Maravilhosa', thumb: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&w=120&q=80' },
  { name: 'Campos do Jordão, SP', query: 'Campos do Jordao', state: 'Serra da Mantiqueira, SP', badge: 'Suíça Brasileira', thumb: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=120&q=80' },
  { name: 'Monte Verde, MG', query: 'Monte Verde Minas Gerais', state: 'Minas Gerais, Brasil', badge: 'Clima Serrano', thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=120&q=80' },
  { name: 'Arraial do Cabo & Búzios, RJ', query: 'Arraial do Cabo', state: 'Região dos Lagos, RJ', badge: 'Caribe Fluminense', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80' },
  { name: 'Ilhéus & Itacaré, BA', query: 'Itacare', state: 'Costa do Cacau, Bahia', badge: 'Surf & Natureza', thumb: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=120&q=80' },
  { name: 'Chapada dos Veadeiros, GO', query: 'Chapada dos Veadeiros', state: 'Goiás, Brasil', badge: 'Cachoeiras', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=120&q=80' },
  { name: 'Miami & Florida Keys', query: 'Miami Florida', state: 'Flórida, Estados Unidos', badge: 'Sol & Compras', thumb: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=120&q=80' },
  { name: 'Nova York (Manhattan)', query: 'New York City', state: 'Nova York, Estados Unidos', badge: 'Metrópole Global', thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80' },
  { name: 'Buenos Aires & Mendoza', query: 'Buenos Aires', state: 'Argentina', badge: 'Tango & Vinhos', thumb: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=120&q=80' },
  { name: 'Lisboa & Porto', query: 'Lisboa Portugal', state: 'Portugal, Europa', badge: 'História & Gastronomia', thumb: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=120&q=80' },
  { name: 'Madri & Barcelona', query: 'Barcelona Spain', state: 'Espanha, Europa', badge: 'Arte & Cultura', thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80' },
  { name: 'Londres & Reino Unido', query: 'London UK', state: 'Inglaterra, Reino Unido', badge: 'Tradição & Luxo', thumb: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=120&q=80' },
  { name: 'Punta Cana All-Inclusive', query: 'Punta Cana', state: 'República Dominicana', badge: 'Caribe', thumb: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=120&q=80' },
  { name: 'Ilhas Maldivas', query: 'Maldives', state: 'Oceano Índico', badge: 'Bangalôs de Luxo', thumb: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=120&q=80' },
  { name: 'Dubai & Abu Dhabi', query: 'Dubai', state: 'Emirados Árabes Unidos', badge: 'Futurismo & Luxo', thumb: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=120&q=80' },
  { name: 'Tóquio & Quioto', query: 'Tokyo Japan', state: 'Japão, Ásia', badge: 'Cultura Milenar', thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=120&q=80' }
];

// Gerenciamento de Favoritos
function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function toggleFavorite(packageId) {
  let favs = getFavorites();
  const index = favs.indexOf(packageId);
  const isAdded = index === -1;

  if (isAdded) {
    favs.push(packageId);
    showToast('❤️ Pacote adicionado aos seus favoritos!');
  } else {
    favs.splice(index, 1);
    showToast('Pacote removido dos favoritos.');
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
  updateFavoritesBadge();
  return isAdded;
}

function updateFavoritesBadge() {
  const favs = getFavorites();
  const favChip = document.querySelector('.chip-btn[data-category="favorites"]');
  if (favChip) {
    favChip.innerHTML = `❤️ Favoritos (${favs.length})`;
  }
}

export function cleanText(text = '') {
  return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

export function setupSearch() {
  const originInput = document.getElementById('search-origin');
  const originAutocompleteBox = document.getElementById('origin-autocomplete');
  const destinationInput = document.getElementById('search-destination');
  const destinationAutocompleteBox = document.getElementById('destination-autocomplete');
  const departureDateInput = document.getElementById('departure-date');
  const returnDateInput = document.getElementById('return-date');
  const depBox = document.getElementById('departure-date-box');
  const retBox = document.getElementById('return-date-box');
  const datesRow = document.getElementById('dates-field-box');
  const passengersTrigger = document.getElementById('passengers-trigger');
  const passengersPopover = document.getElementById('passengers-popover');
  const passengersLabel = document.getElementById('passengers-display');
  const searchBtn = document.getElementById('main-search-submit');
  const packagesContainer = document.getElementById('packages-results-container');
  const filterChips = document.querySelectorAll('.chip-btn');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const quickTags = document.querySelectorAll('.quick-tag-chip');

  // Pacotes gerados dinamicamente via busca livre de API
  let dynamicCustomPackages = [];

  let passengersState = {
    adults: 2,
    children: 0,
    babies: 0
  };

  // 1. Configurar datas mínimas inteligentes e abertura direta do calendário nativo
  const triggerDatePicker = (input) => {
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.focus();
      }
    } catch (err) {
      // Ignora com segurança se já estiver sendo exibido pelo navegador
    }
  };

  if (departureDateInput && returnDateInput) {
    const today = new Date();
    const defaultDeparture = new Date();
    defaultDeparture.setDate(today.getDate() + 15);

    const defaultReturn = new Date();
    defaultReturn.setDate(defaultDeparture.getDate() + 5);

    const toInputFormat = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    departureDateInput.min = toInputFormat(today);
    departureDateInput.value = toInputFormat(defaultDeparture);

    returnDateInput.min = toInputFormat(defaultDeparture);
    returnDateInput.value = toInputFormat(defaultReturn);

    // Clique na área de Ida abre o calendário
    if (depBox) {
      depBox.addEventListener('click', (e) => {
        if (e.target !== departureDateInput) {
          triggerDatePicker(departureDateInput);
        }
      });
    }

    // Clique na área de Volta abre o calendário
    if (retBox) {
      retBox.addEventListener('click', (e) => {
        if (e.target !== returnDateInput) {
          triggerDatePicker(returnDateInput);
        }
      });
    }

    // Clique direto nos inputs
    departureDateInput.addEventListener('click', () => {
      triggerDatePicker(departureDateInput);
    });

    returnDateInput.addEventListener('click', () => {
      triggerDatePicker(returnDateInput);
    });

    // Ao escolher a data de ida, ajusta a data mínima da volta
    departureDateInput.addEventListener('change', () => {
      if (!departureDateInput.value) return;
      const selectedDep = new Date(departureDateInput.value + 'T00:00:00');
      const nextDay = new Date(selectedDep);
      nextDay.setDate(nextDay.getDate() + 1);
      returnDateInput.min = toInputFormat(nextDay);

      const currentReturn = new Date(returnDateInput.value + 'T00:00:00');
      if (isNaN(currentReturn.getTime()) || currentReturn <= selectedDep) {
        returnDateInput.value = toInputFormat(nextDay);
      }
    });
  }

  // 2. Popover de Passageiros
  if (passengersTrigger && passengersPopover) {
    passengersTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      passengersPopover.classList.toggle('active');
      if (originAutocompleteBox) originAutocompleteBox.classList.remove('active');
      if (destinationAutocompleteBox) destinationAutocompleteBox.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!passengersPopover.contains(e.target) && !passengersTrigger.contains(e.target)) {
        passengersPopover.classList.remove('active');
      }
      if (originAutocompleteBox && originInput && !originInput.contains(e.target) && !originAutocompleteBox.contains(e.target)) {
        originAutocompleteBox.classList.remove('active');
      }
      if (destinationAutocompleteBox && destinationInput && !destinationInput.contains(e.target) && !destinationAutocompleteBox.contains(e.target)) {
        destinationAutocompleteBox.classList.remove('active');
      }
    });

    const updatePassengerCount = (type, delta) => {
      if (type === 'adults') {
        const newVal = passengersState.adults + delta;
        if (newVal >= 1 && newVal <= 9) passengersState.adults = newVal;
      } else if (type === 'children') {
        const newVal = passengersState.children + delta;
        if (newVal >= 0 && newVal <= 6) passengersState.children = newVal;
      } else if (type === 'babies') {
        const newVal = passengersState.babies + delta;
        if (newVal >= 0 && newVal <= 4) passengersState.babies = newVal;
      }

      document.getElementById('count-adults').textContent = passengersState.adults;
      document.getElementById('count-children').textContent = passengersState.children;
      document.getElementById('count-babies').textContent = passengersState.babies;

      document.getElementById('btn-adults-minus').disabled = passengersState.adults <= 1;
      document.getElementById('btn-children-minus').disabled = passengersState.children <= 0;
      document.getElementById('btn-babies-minus').disabled = passengersState.babies <= 0;

      const total = passengersState.adults + passengersState.children + passengersState.babies;
      passengersLabel.textContent = total === 1 ? '1 Passageiro' : `${total} Passageiros`;
    };

    document.getElementById('btn-adults-minus')?.addEventListener('click', (e) => { e.stopPropagation(); updatePassengerCount('adults', -1); });
    document.getElementById('btn-adults-plus')?.addEventListener('click', (e) => { e.stopPropagation(); updatePassengerCount('adults', 1); });
    document.getElementById('btn-children-minus')?.addEventListener('click', (e) => { e.stopPropagation(); updatePassengerCount('children', -1); });
    document.getElementById('btn-children-plus')?.addEventListener('click', (e) => { e.stopPropagation(); updatePassengerCount('children', 1); });
    document.getElementById('btn-babies-minus')?.addEventListener('click', (e) => { e.stopPropagation(); updatePassengerCount('babies', -1); });
    document.getElementById('btn-babies-plus')?.addEventListener('click', (e) => { e.stopPropagation(); updatePassengerCount('babies', 1); });

    document.getElementById('apply-passengers-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      passengersPopover.classList.remove('active');
    });
  }

  // 3. Autocomplete Dinâmico no Ponto de Partida (Origem - SOMENTE ao digitar >= 3 letras)
  if (originInput && originAutocompleteBox) {
    const renderOriginAutocomplete = (rawQuery = '') => {
      const q = cleanText(rawQuery);

      // Regra: SOMENTE ao ser digitado 3 letras
      if (q.length < 3) {
        originAutocompleteBox.classList.remove('active');
        originAutocompleteBox.innerHTML = '';
        return;
      }

      const filtered = popularOrigins.filter(o => 
        cleanText(o.city).includes(q) || 
        cleanText(o.code).includes(q) ||
        cleanText(o.airport).includes(q) ||
        cleanText(o.state).includes(q)
      );

      if (filtered.length === 0) {
        originAutocompleteBox.innerHTML = `
          <div class="autocomplete-hint">
            <i class="fas fa-plane-slash" style="color: #94a3b8;"></i> Nenhuma cidade ou aeroporto encontrado para <em>"${rawQuery}"</em>.
          </div>
        `;
        originAutocompleteBox.classList.add('active');
        return;
      }

      originAutocompleteBox.innerHTML = filtered.map(o => `
        <div class="autocomplete-item" data-origin="${o.city} (${o.code})">
          <div class="autocomplete-icon"><i class="fas fa-plane-departure"></i></div>
          <div class="autocomplete-text">
            <div class="autocomplete-title-row">
              <span class="autocomplete-title">${o.city} (${o.code})</span>
              <span class="autocomplete-badge">${o.badge}</span>
            </div>
            <span class="autocomplete-subtitle">${o.airport} • ${o.state}</span>
          </div>
        </div>
      `).join('');

      originAutocompleteBox.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          originInput.value = item.getAttribute('data-origin');
          originAutocompleteBox.classList.remove('active');
          if (destinationInput) destinationInput.focus();
        });
      });

      originAutocompleteBox.classList.add('active');
    };

    // SOMENTE ao digitar
    originInput.addEventListener('input', () => {
      if (passengersPopover) passengersPopover.classList.remove('active');
      if (destinationAutocompleteBox) destinationAutocompleteBox.classList.remove('active');
      renderOriginAutocomplete(originInput.value);
    });
  }

  // 4. Autocomplete Dinâmico no Destino (SOMENTE ao digitar >= 3 letras)
  if (destinationInput && destinationAutocompleteBox) {
    const renderDestinationAutocomplete = (rawQuery = '') => {
      const q = cleanText(rawQuery);

      // Regra: SOMENTE ao ser digitado 3 letras
      if (q.length < 3) {
        destinationAutocompleteBox.classList.remove('active');
        destinationAutocompleteBox.innerHTML = '';
        return;
      }

      // Pontua correspondências para ordenar relevância (starts-with primeiro)
      const scoredMatches = [];
      popularDestinations.forEach(d => {
        const cleanName = cleanText(d.name);
        const cleanState = cleanText(d.state);
        const cleanQueryMatch = cleanText(d.query);

        let score = -1;
        if (cleanName.startsWith(q) || cleanQueryMatch.startsWith(q)) {
          score = 100;
        } else if (cleanName.includes(q) || cleanQueryMatch.includes(q)) {
          score = 50;
        } else if (cleanState.includes(q)) {
          score = 20;
        }

        if (score > 0) {
          scoredMatches.push({ item: d, score });
        }
      });

      scoredMatches.sort((a, b) => b.score - a.score);
      const filtered = scoredMatches.map(m => m.item);

      if (filtered.length === 0) {
        destinationAutocompleteBox.innerHTML = `
          <div class="autocomplete-item custom-api-search" data-destination="${rawQuery}" data-query="${rawQuery}">
            <div class="autocomplete-icon" style="background: #fef3c7; color: #d97706;"><i class="fas fa-magnifying-glass-location"></i></div>
            <div class="autocomplete-text">
              <div class="autocomplete-title-row">
                <span class="autocomplete-title">Pesquisar "${rawQuery}"</span>
                <span class="autocomplete-badge" style="background: #fef3c7; color: #b45309;">API em Tempo Real</span>
              </div>
              <span class="autocomplete-subtitle">Carregar fotos reais e montar roteiro oficial via API</span>
            </div>
          </div>
        `;
      } else {
        destinationAutocompleteBox.innerHTML = filtered.map(d => `
          <div class="autocomplete-item" data-destination="${d.name}" data-query="${d.query}">
            <img src="${d.thumb}" alt="${d.name}" class="autocomplete-thumb" onerror="this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80'">
            <div class="autocomplete-text">
              <div class="autocomplete-title-row">
                <span class="autocomplete-title">${d.name}</span>
                <span class="autocomplete-badge">${d.badge}</span>
              </div>
              <span class="autocomplete-subtitle">${d.state}</span>
            </div>
          </div>
        `).join('');
      }

      destinationAutocompleteBox.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          destinationInput.value = item.getAttribute('data-destination');
          destinationAutocompleteBox.classList.remove('active');
        });
      });

      destinationAutocompleteBox.classList.add('active');
    };

    // SOMENTE ao digitar
    destinationInput.addEventListener('input', () => {
      if (passengersPopover) passengersPopover.classList.remove('active');
      if (originAutocompleteBox) originAutocompleteBox.classList.remove('active');
      renderDestinationAutocomplete(destinationInput.value);
    });
  }

  // 4. Quick tags de clique rápido
  quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const dest = tag.getAttribute('data-query');
      if (destinationInput) destinationInput.value = dest;
      handleSearchExecution(dest);
      const dealsSection = document.getElementById('destinations-deals');
      if (dealsSection) dealsSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 5. Abas de Tipos de Serviço
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const service = btn.getAttribute('data-tab');
      
      if (service === 'flights') {
        showToast('Modo Passagens Aéreas ativado: comparando as melhores tarifas de companhias parceiras.');
      } else if (service === 'hotels') {
        showToast('Modo Hospedagens: buscando hotéis e resorts com cancelamento gratuito.');
      } else if (service === 'transfers') {
        showToast('Modo Passeios & Transfers: vans, carros executivos e passeios guiados.');
      } else {
        showToast('Modo Pacotes Completos: aéreo + hotel + passeios com até 30% de economia.');
      }
    });
  });

  // 6. Filtros por Categoria de Pacotes
  let activeCategory = 'all';
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category');
      renderPackagesList();
    });
  });

  // 7. Enriquecimento assíncrono via API para pacotes base
  async function enrichBasePackagesWithAPI() {
    for (const pkg of travelPackages) {
      try {
        const theme = pkg.category === 'serra' ? 'serra' : (pkg.category === 'internacional' ? 'europa' : 'praia');
        const apiData = await fetchDestinationData(pkg.apiQuery || pkg.title, theme);
        if (apiData && apiData.imageUrl && apiData.source === 'api') {
          pkg.image = apiData.imageUrl;
          if (apiData.summary) pkg.apiSummary = apiData.summary;
          preloadImage(apiData.imageUrl);
        }
      } catch (err) {
        // Fallback já garantido
      }
    }
  }

  // Executa enriquecimento suave em background
  enrichBasePackagesWithAPI().then(() => {
    renderPackagesList();
  });

  // 8. Renderização do Grid de Pacotes
  const renderPackagesList = () => {
    if (!packagesContainer) return;

    const favorites = getFavorites();
    const allAvailable = [...travelPackages, ...dynamicCustomPackages];

    const filtered = allAvailable.filter(pkg => {
      if (activeCategory === 'favorites') {
        return favorites.includes(pkg.id);
      }
      return activeCategory === 'all' || pkg.category === activeCategory;
    });

    if (filtered.length === 0) {
      if (activeCategory === 'favorites') {
        packagesContainer.innerHTML = `
          <div style="grid-column: 1 / -1; background: #fff; padding: 48px 24px; border-radius: 18px; text-align: center; border: 1px dashed #cbd5e1;">
            <i class="far fa-heart" style="font-size: 2.8rem; color: #ef4444; margin-bottom: 16px;"></i>
            <h3 style="font-size: 1.35rem; color: #0f172a; margin-bottom: 8px;">Você ainda não favoritou nenhum pacote</h3>
            <p style="color: #64748b; max-width: 480px; margin: 0 auto 20px auto;">
              Clique no ícone de coração em qualquer card para guardar suas viagens preferidas e consultá-las a qualquer momento!
            </p>
            <button class="chip-btn" data-category="all" onclick="document.querySelector('.chip-btn[data-category=\\'all\\']').click();">
              Ver Todos os Pacotes
            </button>
          </div>
        `;
        return;
      }

      packagesContainer.innerHTML = `
        <div style="grid-column: 1 / -1; background: #fff; padding: 48px 24px; border-radius: 18px; text-align: center; border: 1px dashed #cbd5e1; box-shadow: 0 4px 16px rgba(15,23,42,0.04);">
          <i class="fas fa-compass" style="font-size: 2.8rem; color: #0284c7; margin-bottom: 16px;"></i>
          <h3 style="font-size: 1.35rem; color: #0f172a; margin-bottom: 8px;">Nenhum pacote encontrado para esta categoria</h3>
          <p style="color: #64748b; max-width: 520px; margin: 0 auto 24px auto;">
            Nós montamos <strong>roteiros 100% personalizados</strong> para qualquer cidade do Brasil e do mundo com tarifas exclusivas de agência.
          </p>
          <a href="https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Gostaria de cotar um roteiro personalizado para ' + (destinationInput?.value || 'minha próxima viagem') + '.')}" target="_blank" class="btn-whatsapp">
            <i class="fab fa-whatsapp"></i> Solicitar Cotação no WhatsApp
          </a>
        </div>
      `;
      return;
    }

    packagesContainer.innerHTML = filtered.map(pkg => {
      const installmentVal = (pkg.price / pkg.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const fullPrice = pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      const isFav = favorites.includes(pkg.id);

      return `
        <article class="package-card" data-package-id="${pkg.id}">
          <div class="package-image-wrap">
            <img src="${pkg.image}" alt="${pkg.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80';">
            <span class="package-badge-tag ${pkg.badgeType}">${pkg.badge}</span>
            <span class="package-duration-pill"><i class="fas fa-clock"></i> ${pkg.duration}</span>
            <button class="btn-card-favorite ${isFav ? 'active' : ''}" data-id="${pkg.id}" title="${isFav ? 'Remover dos favoritos' : 'Salvar nos favoritos'}" aria-label="Favoritar">
              <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
            </button>
          </div>
          <div class="package-body">
            <div class="package-location-row">
              <span class="package-location"><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
              <span class="package-rating"><i class="fas fa-star"></i> ${pkg.rating} (${pkg.reviewsCount})</span>
            </div>
            <h3 class="package-title">${pkg.title}</h3>
            
            <div class="package-inclusions">
              ${pkg.inclusions.map(inc => `<span class="inclusion-pill"><i class="fas fa-check"></i> ${inc}</span>`).join('')}
            </div>
            
            <div class="package-footer">
              <div class="package-pricing">
                <span class="price-label">A partir de</span>
                <span class="price-value">R$ ${fullPrice}</span>
                <span class="price-installments">ou ${pkg.installments}x de R$ ${installmentVal} sem juros</span>
              </div>
              <div class="package-actions">
                <button class="btn-card-details" data-id="${pkg.id}" title="Ver detalhes completos do pacote">
                  Ver Detalhes
                </button>
                <a href="https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Vi o pacote "${pkg.title}" no site da Translatur e gostaria de receber uma cotação para ${passengersState.adults} adultos.`)}" target="_blank" class="btn-card-whatsapp" title="Cotação direta no WhatsApp">
                  <i class="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Eventos de clique nos cards
    packagesContainer.querySelectorAll('.btn-card-details').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkgId = btn.getAttribute('data-id');
        const pkg = allAvailable.find(p => p.id === pkgId);
        if (pkg) openPackageModal(pkg, passengersState);
      });
    });

    packagesContainer.querySelectorAll('.btn-card-favorite').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pkgId = btn.getAttribute('data-id');
        const isNowFav = toggleFavorite(pkgId);
        btn.classList.toggle('active', isNowFav);
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isNowFav ? 'fas fa-heart' : 'far fa-heart';
        }
      });
    });
  };

  // 9. Lógica Inteligente de Busca e Criação de Destinos via API
  async function handleSearchExecution(searchTerm) {
    const rawQuery = searchTerm || (destinationInput ? destinationInput.value.trim() : '');
    if (!rawQuery) {
      renderPackagesList();
      return;
    }

    const q = cleanText(rawQuery);

    // Checa se já existe algum pacote correspondente no catálogo
    const existingMatch = travelPackages.find(pkg => {
      const cleanTitle = cleanText(pkg.title);
      const cleanLoc = cleanText(pkg.location);
      const cleanApi = pkg.apiQuery ? cleanText(pkg.apiQuery) : '';
      return cleanTitle.includes(q) || 
             q.includes(cleanTitle) || 
             cleanLoc.includes(q) ||
             (cleanApi && (cleanApi.includes(q) || q.includes(cleanApi)));
    });

    if (existingMatch) {
      // Se já existe, filtra e destaca o pacote existente
      filterChips.forEach(c => c.classList.remove('active'));
      const allChip = document.querySelector('.chip-btn[data-category="all"]');
      if (allChip) allChip.classList.add('active');
      activeCategory = 'all';

      // Move o match para o topo
      travelPackages.sort((a, b) => (a.id === existingMatch.id ? -1 : 1));
      renderPackagesList();
      showToast(`Exibindo ofertas selecionadas para "${existingMatch.title}".`);
      return;
    }

    // Se é um destino novo e livre (ex: "Fernando de Noronha", "Lençóis Maranhenses", "Jericoacoara", "Mendoza", "Lisboa"):
    // Exibe Skeletons enquanto busca na API da Wikimedia em tempo real!
    packagesContainer.innerHTML = `
      <div class="skeleton-card">
        <div class="skeleton-box skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-box skeleton-line short"></div>
          <div class="skeleton-box skeleton-line title"></div>
          <div class="skeleton-box skeleton-line medium"></div>
          <div class="skeleton-box skeleton-line" style="width: 50%; margin-top: auto;"></div>
        </div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton-box skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-box skeleton-line short"></div>
          <div class="skeleton-box skeleton-line title"></div>
          <div class="skeleton-box skeleton-line medium"></div>
          <div class="skeleton-box skeleton-line" style="width: 50%; margin-top: auto;"></div>
        </div>
      </div>
    `;

    showToast(`🔍 Conectando à API de turismo e buscando imagens reais para "${rawQuery}"...`);

    // Busca via API
    const apiData = await fetchDestinationData(rawQuery, 'praia');

    // Estimativa inteligente de preço de mercado brasileiro
    const isInternational = rawQuery.includes('eua') || rawQuery.includes('europa') || rawQuery.includes('disney') || rawQuery.includes('paris') || rawQuery.includes('orlando') || rawQuery.includes('chile') || rawQuery.includes('argentina') || rawQuery.includes('cancun');
    const basePrice = isInternational ? 4690 : 2190;
    const customId = 'custom-' + rawQuery.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newPackage = {
      id: customId,
      category: isInternational ? 'internacional' : 'nordeste',
      title: `${rawQuery.charAt(0).toUpperCase() + rawQuery.slice(1)} Sob Medida`,
      apiQuery: rawQuery,
      location: isInternational ? `${rawQuery} (Internacional)` : `${rawQuery}, Brasil`,
      image: apiData.imageUrl,
      badge: 'Roteiro Exclusivo',
      badgeType: 'promo',
      duration: isInternational ? '7 dias / 6 noites' : '5 dias / 4 noites',
      inclusions: ['Aéreo ida e volta', 'Hospedagem selecionada', 'Café da manhã', 'Assessoria 24h'],
      rating: 4.95,
      reviewsCount: 86,
      price: basePrice,
      installments: 12,
      highlights: apiData.summary || `Roteiro completo desenhado pelos nossos especialistas para ${rawQuery}, com assistência total e tarifas especiais negociadas.`,
      apiSummary: apiData.summary
    };

    // Remove pacote dinâmico anterior com mesmo ID e insere o novo no início
    dynamicCustomPackages = dynamicCustomPackages.filter(p => p.id !== customId);
    dynamicCustomPackages.unshift(newPackage);

    renderPackagesList();
    showToast(`✨ Roteiro e imagens oficiais carregados para "${rawQuery}"!`);
  }

  // Render inicial dos pacotes
  renderPackagesList();
  updateFavoritesBadge();

  if (searchBtn) {
    searchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleSearchExecution();

      const dealsSection = document.getElementById('destinations-deals');
      if (dealsSection) {
        dealsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// Modal de Detalhes do Pacote com Calculadora em Tempo Real
export function openPackageModal(pkg, passengersState = { adults: 2, children: 0 }) {
  const modalOverlay = document.getElementById('package-modal');
  const modalBody = document.getElementById('package-modal-body');

  if (!modalOverlay || !modalBody) return;

  let currentAdults = passengersState.adults || 2;
  let currentChildren = passengersState.children || 0;

  const renderModalContent = () => {
    const childPrice = pkg.price * 0.75; // 25% de desconto para crianças
    const totalPrice = (currentAdults * pkg.price) + (currentChildren * childPrice);
    const installmentVal = (totalPrice / pkg.installments).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedTotal = totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const singlePrice = pkg.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const totalPassengers = currentAdults + currentChildren;

    modalBody.innerHTML = `
      <div style="position: relative; height: 260px; border-radius: 18px 18px 0 0; overflow: hidden;">
        <img src="${pkg.image}" alt="${pkg.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80';">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; background: linear-gradient(0deg, rgba(8,14,33,0.92) 0%, transparent 100%);">
          <span style="background: #0284c7; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 12px; border-radius: 9999px;">${pkg.duration}</span>
          <h2 style="color: #fff; font-size: 1.7rem; font-weight: 800; margin-top: 8px;">${pkg.title}</h2>
          <p style="color: #cbd5e1; font-size: 0.9rem;"><i class="fas fa-map-marker-alt"></i> ${pkg.location}</p>
        </div>
      </div>
      
      <div style="padding: 24px 28px;">
        
        <!-- Bloco de Preço & Calculadora Interativa de Viajantes -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <div>
              <span style="font-size: 0.74rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Valor total simulado (${totalPassengers} pessoas)</span>
              <div style="font-size: 1.8rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">R$ ${formattedTotal}</div>
              <span style="color: #10b981; font-size: 0.86rem; font-weight: 700;">ou 12x de R$ ${installmentVal} sem juros no cartão</span>
            </div>
            
            <div style="text-align: right;">
              <span style="background: #fef3c7; color: #b45309; padding: 6px 12px; border-radius: 8px; font-weight: 700; font-size: 0.85rem; display: inline-block;">
                <i class="fas fa-star" style="color: #f59e0b;"></i> ${pkg.rating} Excelente
              </span>
              <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">R$ ${singlePrice} / adulto</div>
            </div>
          </div>

          <!-- Controles de Ajuste Rápido de Passageiros -->
          <div style="display: flex; gap: 20px; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 0.88rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #475569; font-weight: 600;">Adultos:</span>
              <button class="counter-btn" id="modal-adults-minus" ${currentAdults <= 1 ? 'disabled' : ''}>-</button>
              <strong style="min-width: 16px; text-align: center;">${currentAdults}</strong>
              <button class="counter-btn" id="modal-adults-plus">+</button>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #475569; font-weight: 600;">Crianças (25% off):</span>
              <button class="counter-btn" id="modal-child-minus" ${currentChildren <= 0 ? 'disabled' : ''}>-</button>
              <strong style="min-width: 16px; text-align: center;">${currentChildren}</strong>
              <button class="counter-btn" id="modal-child-plus">+</button>
            </div>
          </div>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Sobre este Roteiro</h4>
        <p style="color: #475569; font-size: 0.94rem; line-height: 1.6; margin-bottom: 20px;">
          ${pkg.highlights}
        </p>

        <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 12px;">Inclusões confirmadas neste pacote:</h4>
        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 28px;">
          ${pkg.inclusions.map(inc => `
            <li style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #334155;">
              <i class="fas fa-check-circle" style="color: #10b981;"></i> ${inc}
            </li>
          `).join('')}
          <li style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #334155;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i> Suporte Translatur 24h em Português
          </li>
          <li style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #334155;">
            <i class="fas fa-check-circle" style="color: #10b981;"></i> Marcação de assentos sem taxa extra
          </li>
        </ul>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="https://wa.me/5511999999999?text=${encodeURIComponent(`Olá! Vi o pacote "${pkg.title}" na Translatur para ${currentAdults} adulto(s) e ${currentChildren} criança(s) (Total estimado: R$ ${formattedTotal}). Gostaria de receber uma cotação oficial!`)}" target="_blank" class="btn-whatsapp" style="flex: 1; padding: 14px; font-size: 1rem; justify-content: center;">
            <i class="fab fa-whatsapp" style="font-size: 1.25rem;"></i> Solicitar Cotação Oficial no WhatsApp
          </a>
        </div>
      </div>
    `;

    // Listeners dos botões de contagem no modal
    modalBody.querySelector('#modal-adults-minus')?.addEventListener('click', () => {
      if (currentAdults > 1) { currentAdults--; renderModalContent(); }
    });
    modalBody.querySelector('#modal-adults-plus')?.addEventListener('click', () => {
      if (currentAdults < 9) { currentAdults++; renderModalContent(); }
    });
    modalBody.querySelector('#modal-child-minus')?.addEventListener('click', () => {
      if (currentChildren > 0) { currentChildren--; renderModalContent(); }
    });
    modalBody.querySelector('#modal-child-plus')?.addEventListener('click', () => {
      if (currentChildren < 6) { currentChildren++; renderModalContent(); }
    });
  };

  renderModalContent();
  modalOverlay.classList.add('active');

  const closeBtn = modalOverlay.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.onclick = () => modalOverlay.classList.remove('active');
  }

  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  };
}

export function showToast(msg) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-info-circle" style="color: #38bdf8;"></i> <span>${msg}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
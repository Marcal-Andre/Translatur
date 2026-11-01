/* ==========================================================================
   Image Service & Destination API Client
   Busca de imagens reais via API (Wikimedia/Wikipedia com CORS nativo)
   com cache em localStorage, filtro de bandeiras/svg e fallback robusto
   ========================================================================== */

const CACHE_KEY = 'translatur_image_cache_v2';
const CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

// Banco curado de imagens em alta resolução para fallback imediato por tema
const CURATED_FALLBACKS = {
  praia: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  serra: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
  neve: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  europa: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80',
  resort: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1000&q=80',
  cidade: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1000&q=80',
  natureza: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80'
};

// Gerenciamento de Cache Local
function getLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn('Erro ao ler cache de imagens:', e);
    return {};
  }
}

function setLocalCache(key, data) {
  try {
    const cache = getLocalCache();
    cache[key] = {
      ...data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Erro ao salvar no cache:', e);
  }
}

/**
 * Busca imagem e resumo enciclopédico de um destino via API pública da Wikimedia/Wikipedia
 * Suporta CORS nativo (origin=*), sem necessidade de chaves de API secretas
 * 
 * @param {string} destination - Nome do destino turístico (ex: "Fernando de Noronha", "Cancún", "Gramado")
 * @param {string} fallbackTheme - Tema alternativo (praia, serra, neve, europa, etc.)
 * @returns {Promise<{ imageUrl: string, summary: string, source: string }>}
 */
export async function fetchDestinationData(destination, fallbackTheme = 'praia') {
  if (!destination || typeof destination !== 'string') {
    return {
      imageUrl: CURATED_FALLBACKS[fallbackTheme] || CURATED_FALLBACKS.praia,
      summary: '',
      source: 'fallback'
    };
  }

  // Normalização da chave de cache
  const cleanKey = destination.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cache = getLocalCache();

  // 1. Checa cache válido
  if (cache[cleanKey] && (Date.now() - cache[cleanKey].timestamp < CACHE_EXPIRY_MS)) {
    return {
      imageUrl: cache[cleanKey].imageUrl,
      summary: cache[cleanKey].summary || '',
      source: 'cache'
    };
  }

  // 2. Consulta à API aberta da Wikimedia / Wikipedia (Search Generator)
  try {
    const searchQuery = encodeURIComponent(`${destination.trim()} tourism travel`);
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchQuery}&gsrlimit=4&prop=pageimages|extracts&pithumbsize=1280&exintro=1&explaintext=1&exchars=240&format=json&origin=*`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // Timeout rápido de 4.5s para não travar UI

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];

      // Filtra páginas descartando brasões, bandeiras, mapas ou diagramas
      for (const page of pages) {
        const thumb = page.thumbnail ? page.thumbnail.source : null;
        if (thumb) {
          const lower = thumb.toLowerCase();
          if (!lower.includes('.svg') && 
              !lower.includes('flag') && 
              !lower.includes('coat_of_arms') && 
              !lower.includes('_map') && 
              !lower.includes('location_map') && 
              !lower.includes('diagram')) {
            const result = {
              imageUrl: thumb,
              summary: page.extract || '',
              source: 'api'
            };
            setLocalCache(cleanKey, result);
            return result;
          }
        }
      }
    }
  } catch (error) {
    console.warn(`[Translatur API] Busca de imagem remota falhou para "${destination}". Usando fallback resiliente:`, error.message);
  }

  // 3. Fallback inteligente baseado no nome ou tema
  let selectedFallback = CURATED_FALLBACKS[fallbackTheme] || CURATED_FALLBACKS.praia;
  const lower = destination.toLowerCase();

  if (lower.includes('neve') || lower.includes('andes') || lower.includes('bariloche') || lower.includes('chile')) {
    selectedFallback = CURATED_FALLBACKS.neve;
  } else if (lower.includes('gramado') || lower.includes('serra') || lower.includes('canela') || lower.includes('vinho')) {
    selectedFallback = CURATED_FALLBACKS.serra;
  } else if (lower.includes('paris') || lower.includes('roma') || lower.includes('europa') || lower.includes('lisboa')) {
    selectedFallback = CURATED_FALLBACKS.europa;
  } else if (lower.includes('resort') || lower.includes('cancun') || lower.includes('inclusive')) {
    selectedFallback = CURATED_FALLBACKS.resort;
  }

  const fallbackResult = {
    imageUrl: selectedFallback,
    summary: '',
    source: 'fallback'
  };

  setLocalCache(cleanKey, fallbackResult);
  return fallbackResult;
}

/**
 * Pré-carrega imagens no navegador em background para evitar travamentos
 */
export function preloadImage(src) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

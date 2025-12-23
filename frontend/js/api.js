const API_BASE_URL = "http://localhost:3000/api/content";

/**
 * Busca conteúdos de uma seção específica.
 * @param {string} section - A seção para buscar (home, projects, management, stories).
 * @returns {Promise<any>} - Dados da API.
 */
async function fetchContent(section) {
    try {
        const response = await fetch(`${API_BASE_URL}/${section}`);
        if (!response.ok) throw new Error("Erro na requisição");
        return await response.json();
    } catch (error) {
        console.error(`Erro ao carregar dados da seção ${section}:`, error);
        return section === 'home' ? {} : []; // Retorno seguro
    }
}

/**
 * Filtra itens por uma categoria específica (usado na gestão).
 * @param {Array} items - Lista de itens.
 * @param {string} category - Categoria (coordenacao, eclesiastica, conselho).
 */
function filterByCategory(items, category) {
    if (!Array.isArray(items)) return [];
    return items.filter(item => item.category === category);
}

/**
 * Helper para converter URL do Youtube em Embed
 */
function getYoutubeEmbedUrl(url) {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
}

// Exportar funções globalmente
window.api = { fetchContent, filterByCategory, getYoutubeEmbedUrl };
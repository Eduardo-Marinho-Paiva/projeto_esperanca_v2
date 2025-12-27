document.addEventListener('DOMContentLoaded', async () => {
    const instaTrack = document.getElementById('insta-track');

    if (!instaTrack) {
        console.warn('Elemento #insta-track não encontrado. O script do Instagram não será executado.');
        return;
    }

    try {
        // Busca os posts dinâmicos do backend
        // Ajuste a URL se o backend estiver em outra porta ou endereço em produção
        const response = await fetch(`/api/instagram/posts`);
        
        if (!response.ok) throw new Error('Falha na requisição ao backend');

        const posts = await response.json();

        let htmlContent = '';

        // Gera o HTML usando o template exato solicitado
        posts.forEach(post => {
            htmlContent += `
                <a href="${post.link}" target="_blank" class="flex-shrink-0 w-72 h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-md border border-gray-100 relative group cursor-pointer hover:scale-[1.02] transition-transform duration-300 snap-center block">
                    <img src="${post.img}" alt="Instagram Post" class="w-full h-full object-cover">
                    
                </a>
            `;
        });

        instaTrack.innerHTML = htmlContent;

    } catch (error) {
        console.error("Erro ao carregar Instagram:", error);
        // Fallback opcional ou manter vazio
        instaTrack.innerHTML = '<p class="text-gray-500 p-4">Não foi possível carregar o feed do Instagram.</p>';
    }
});
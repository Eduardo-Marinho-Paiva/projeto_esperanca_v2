// admin/js/edit_management.js

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

document.addEventListener('DOMContentLoaded', () => {
    
    // Armazena dados originais para manipulação
    let managementData = [];

    async function loadManagement() {
        const res = await fetch(`/api/content/management`);
        managementData = await res.json();
        render();
    }

    function render() {
        const container = document.getElementById('managementList');
        container.innerHTML = '';

        managementData.forEach((m, index) => {
            const imgSrc = m.image || 'https://via.placeholder.com/150';
            
            container.innerHTML += `
                <div class="bg-white p-4 rounded shadow flex items-center gap-4">
                    <div class="relative w-16 h-16 shrink-0">
                        <img src="${imgSrc}" class="w-16 h-16 rounded-full object-cover border shadow-sm">
                    </div>

                    <div class="flex-1">
                        <p class="text-xs text-gray-500 font-bold uppercase mb-1">${m.role}</p>
                        <input type="text" id="name-${m._id}" value="${m.name || ''}" class="border p-2 rounded w-full text-gray-800 font-medium placeholder-gray-300" placeholder="Nome do membro">
                    </div>
                    
                    <div class="flex-1">
                        <p class="text-xs text-gray-400 mb-1">Foto</p>
                        <input type="file" accept="image/*" onchange="handleFile('${m._id}', this)" class="text-xs text-gray-500 w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200">
                        <input type="hidden" id="img-${m._id}" value="${m.image || ''}">
                    </div>
                    
                    <button onclick="saveMember('${m._id}')" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded h-10 self-end text-sm font-bold transition shadow">Salvar</button>
                </div>
            `;
        });
    }

    // Função global para processar o arquivo quando o usuário seleciona
    window.handleFile = async (id, input) => {
        const file = input.files[0];
        if (file) {
            const base64 = await toBase64(file);
            // Atualiza o hidden input
            document.getElementById(`img-${id}`).value = base64;
            // Atualiza visualmente (opcional, mas bom UX) - Encontra a imagem anterior neste container
            const imgTag = input.closest('div.bg-white').querySelector('img');
            imgTag.src = base64;
        }
    };

    async function saveMember(id) {
        const token = localStorage.getItem('token');
        const name = document.getElementById(`name-${id}`).value;
        // Pega o valor do hidden (que pode ser URL antiga ou Base64 novo)
        const image = document.getElementById(`img-${id}`).value;

        // Feedback visual
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = '...';
        btn.disabled = true;

        try {
            await fetch(`/api/content/management/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ name, image })
            });
            alert('Membro atualizado!');
        } catch (err) {
            alert('Erro ao atualizar');
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }

    loadManagement();
    window.saveMember = saveMember;
});
document.addEventListener('DOMContentLoaded', () => {
let allStories = [];
        const API_URL = `/api/content/stories`;

        async function loadStories() {
            try {
                const res = await fetch(API_URL);
                if (!res.ok) throw new Error('Falha ao carregar histórias');
                allStories = await res.json();
                renderStories();
            } catch(e) {
                console.error(e);
                document.getElementById('storiesGrid').innerHTML = '<p class="text-red-500 text-center col-span-full">Erro ao conectar com o servidor.</p>';
            }
        }

        function renderStories() {
            const grid = document.getElementById('storiesGrid');
            grid.innerHTML = '';

            if(allStories.length === 0) {
                grid.innerHTML = '<p class="col-span-full text-center text-gray-500">Nenhuma história cadastrada.</p>';
                return;
            }

            allStories.forEach(s => {
                grid.innerHTML += `
                    <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h3 class="font-bold text-lg text-gray-800">${s.title || '<span class="text-red-400 italic">Sem título</span>'}</h3>
                                <p class="text-xs text-blue-500 truncate max-w-[200px]"><i class="fab fa-youtube"></i> ${s.videoUrl}</p>
                            </div>
                            <div class="bg-orange-100 text-orange-600 p-2 rounded-lg">
                                <i class="fas fa-video"></i>
                            </div>
                        </div>
                        
                        <p class="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">${s.description || 'Sem descrição.'}</p>
                        
                        <div class="flex gap-3 pt-4 border-t border-gray-100">
                            <button onclick="prepareEdit('${s._id}')" class="flex-1 text-blue-600 bg-blue-50 hover:bg-blue-100 py-2 rounded-lg text-sm font-medium transition">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button onclick="deleteStory('${s._id}')" class="flex-1 text-red-600 bg-red-50 hover:bg-red-100 py-2 rounded-lg text-sm font-medium transition">
                                <i class="fas fa-trash"></i> Excluir
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        function prepareEdit(id) {
            const story = allStories.find(s => s._id === id);
            if (story) openModal(story);
        }

        function openModal(story = null) {
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('modalError').classList.add('hidden');
            
            if (story) {
                document.getElementById('modalTitle').innerText = 'Editar História';
                document.getElementById('storyId').value = story._id;
                document.getElementById('title').value = story.title || '';
                document.getElementById('videoUrl').value = story.videoUrl || '';
                document.getElementById('desc').value = story.description || '';
            } else {
                document.getElementById('modalTitle').innerText = 'Nova História';
                document.getElementById('storyForm').reset();
                document.getElementById('storyId').value = '';
            }
        }

        function closeModal() { document.getElementById('modal').classList.add('hidden'); }

        document.getElementById('storyForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('saveBtn');
            const errorDiv = document.getElementById('modalError');
            
            btn.disabled = true;
            btn.innerText = 'Salvando...';
            errorDiv.classList.add('hidden');

            try {
                const token = localStorage.getItem('token');
                // Trim para remover espaços em branco invisíveis que podem quebrar a requisição
                const id = document.getElementById('storyId').value.trim();
                
                const body = {
                    title: document.getElementById('title').value.trim(),
                    videoUrl: document.getElementById('videoUrl').value.trim(),
                    description: document.getElementById('desc').value.trim()
                };

                const method = id ? 'PUT' : 'POST';
                const url = id ? `${API_URL}/${id}` : API_URL;

                console.log(`Enviando ${method} para ${url}`, body);

                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                    body: JSON.stringify(body)
                });

                if (!res.ok) {
                    if (res.status === 404) throw new Error('Erro 404: Rota não encontrada. O servidor pode estar desatualizado. Reinicie o backend.');
                    const errJson = await res.json();
                    throw new Error(errJson.msg || 'Erro ao salvar.');
                }

                // Verifica se o servidor salvou o título corretamente
                const data = await res.json();
                if (!data.title) {
                    alert('Aviso: O item foi salvo, mas o servidor ignorou o "Título". Verifique se o arquivo models/Story.js contém o campo "title" e reinicie o servidor.');
                }

                closeModal();
                loadStories();

            } catch (err) {
                console.error(err);
                errorDiv.innerText = err.message;
                errorDiv.classList.remove('hidden');
            } finally {
                btn.disabled = false;
                btn.innerText = 'Salvar';
            }
        });

        async function deleteStory(id) {
            if(!confirm('Tem certeza que deseja excluir esta história?')) return;
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/${id}`, { 
                    method: 'DELETE', 
                    headers: {'x-auth-token': token}
                });
                
                if(!res.ok) throw new Error('Erro ao excluir');
                loadStories();
            } catch(e) {
                alert(e.message);
            }
        }
        
        loadStories();
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.prepareEdit = prepareEdit;
        window.deleteStory = deleteStory;
});
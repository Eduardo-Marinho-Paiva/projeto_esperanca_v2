require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
// Variável global para armazenar os projetos carregados
        let allProjects = [];

        async function loadProjects() {
            try {
                const res = await fetch(`/api/content/projects`);
                allProjects = await res.json();
                renderProjects();
            } catch(e) {
                document.getElementById('projectsGrid').innerHTML = '<p class="text-red-500 text-center col-span-full">Erro ao carregar projetos.</p>';
            }
        }

        function renderProjects() {
            const grid = document.getElementById('projectsGrid');
            grid.innerHTML = '';
            
            if (allProjects.length === 0) {
                grid.innerHTML = '<p class="text-gray-500 text-center col-span-full py-10">Nenhum projeto cadastrado.</p>';
                return;
            }

            allProjects.forEach(p => {
                grid.innerHTML += `
                    <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 overflow-hidden flex flex-col">
                        <div class="h-48 overflow-hidden relative group">
                            <img src="${p.image || 'https://via.placeholder.com/300'}" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-500">
                            ${p.logo ? `<img src="${p.logo}" class="absolute bottom-2 right-2 w-10 h-10 rounded-full border-2 border-white shadow-sm bg-white">` : ''}
                        </div>
                        <div class="p-5 flex-1 flex flex-col">
                            <h3 class="font-bold text-lg text-gray-800 mb-2 leading-tight">${p.title}</h3>
                            <p class="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">${p.description}</p>
                            <div class="flex flex-wrap gap-1 mb-4">
                                ${p.tags.map(t => `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${t}</span>`).join('')}
                            </div>
                            <div class="flex gap-2 pt-3 border-t mt-auto">
                                <button onclick="prepareEdit('${p._id}')" class="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition flex justify-center items-center gap-1">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button onclick="deleteProject('${p._id}')" class="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition flex justify-center items-center gap-1">
                                    <i class="fas fa-trash-alt"></i> Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // Função wrapper para evitar passar objetos JSON no HTML
        function prepareEdit(id) {
            const project = allProjects.find(p => p._id === id);
            if (project) {
                openModal(project);
            }
        }

        function openModal(project = null) {
            document.getElementById('modal').classList.remove('hidden');
            if (project) {
                document.getElementById('modalTitle').innerText = 'Editar Projeto';
                document.getElementById('projId').value = project._id;
                document.getElementById('title').value = project.title;
                document.getElementById('description').value = project.description;
                document.getElementById('tags').value = project.tags ? project.tags.join(', ') : '';
                document.getElementById('image').value = project.image;
                document.getElementById('logo').value = project.logo || '';
            } else {
                document.getElementById('modalTitle').innerText = 'Novo Projeto';
                document.getElementById('projectForm').reset();
                document.getElementById('projId').value = '';
            }
        }

        function closeModal() {
            document.getElementById('modal').classList.add('hidden');
        }

        document.getElementById('projectForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('projId').value;
            const token = localStorage.getItem('token');
            const body = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                tags: document.getElementById('tags').value.split(',').map(t => t.trim()),
                image: document.getElementById('image').value,
                logo: document.getElementById('logo').value
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `/api/content/projects/${id}` : `/api/content/projects`;

            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(body)
            });
            
            closeModal();
            loadProjects();
        });

        async function deleteProject(id) {
            if(!confirm('Tem certeza que deseja excluir este projeto?')) return;
            const token = localStorage.getItem('token');
            await fetch(`/api/content/projects/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            loadProjects();
        }

        loadProjects();
        window.openModal = openModal;
        window.closeModal = closeModal;
        window.prepareEdit = prepareEdit;
        window.deleteProject = deleteProject;
});
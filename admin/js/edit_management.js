document.addEventListener('DOMContentLoaded', () => {
async function loadManagement() {
            const res = await fetch(`/api/content/management`);
            const members = await res.json();
            const container = document.getElementById('managementList');
            container.innerHTML = '';

            members.forEach(m => {
                container.innerHTML += `
                    <div class="bg-white p-4 rounded shadow flex items-center gap-4">
                        <img src="${m.image}" class="w-16 h-16 rounded-full object-cover border">
                        <div class="flex-1">
                            <p class="text-sm text-gray-500 font-bold uppercase">${m.role}</p>
                            <input type="text" id="name-${m._id}" value="${m.name}" class="border p-1 rounded w-full mt-1" placeholder="Nome">
                        </div>
                        <div class="flex-1">
                            <p class="text-xs text-gray-400">URL da Foto</p>
                            <input type="text" id="img-${m._id}" value="${m.image}" class="border p-1 rounded w-full mt-1 text-sm">
                        </div>
                        <button onclick="saveMember('${m._id}')" class="bg-blue-600 text-white px-4 py-2 rounded h-10 self-end">Salvar</button>
                    </div>
                `;
            });
        }

        async function saveMember(id) {
            const token = localStorage.getItem('token');
            const name = document.getElementById(`name-${id}`).value;
            const image = document.getElementById(`img-${id}`).value;

            await fetch(`/api/content/management/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify({ name, image })
            });
            alert('Atualizado!');
            loadManagement();
        }

        loadManagement();
        window.saveMember = saveMember;
});
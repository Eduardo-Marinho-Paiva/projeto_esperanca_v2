require('dotenv').config();
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';



// Após o carregamento do DOM
document.addEventListener('DOMContentLoaded', () => {
   let currentStats = [];
        let currentPartners = [];

        async function loadData() {
            try {
                const res = await fetch(`${SERVER_URL}/api/content/home`);
                const data = await res.json();
                
                document.getElementById('whoText').value = data.whoWeAre?.text || '';
                document.getElementById('whoImage').value = data.whoWeAre?.image || '';
                document.getElementById('videoUrl').value = data.learnMoreVideo || '';
                document.getElementById('statsYear').value = data.results?.year || new Date().getFullYear();

                currentStats = data.results?.stats || [];
                currentPartners = data.partners || [];
                renderStats();
                renderPartners();
            } catch(e) {
                console.log("Erro ao carregar dados (backend offline?)");
            }
        }

        function renderStats() {
            const div = document.getElementById('statsContainer');
            div.innerHTML = '';
            currentStats.forEach((stat, index) => {
                div.innerHTML += `
                    <div class="flex gap-2 items-center bg-gray-50 p-3 rounded border">
                        <div class="flex-1">
                            <label class="text-xs text-gray-500 mb-1 block">Título</label>
                            <input type="text" value="${stat.title}" onchange="updateStat(${index}, 'title', this.value)" class="w-full border p-1 rounded text-sm">
                        </div>
                        <div class="w-24">
                            <label class="text-xs text-gray-500 mb-1 block">Valor</label>
                            <input type="number" value="${stat.count}" onchange="updateStat(${index}, 'count', this.value)" class="w-full border p-1 rounded text-sm text-center font-bold">
                        </div>
                        <button type="button" onclick="removeStat(${index})" class="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded mt-4"><i class="fas fa-trash"></i></button>
                    </div>
                `;
            });
        }

        function renderPartners() {
            const div = document.getElementById('partnersContainer');
            div.innerHTML = '';
            currentPartners.forEach((p, index) => {
                div.innerHTML += `
                    <div class="flex gap-3 items-center group">
                        <div class="bg-gray-100 p-2 rounded w-8 h-8 flex items-center justify-center text-gray-400 font-bold text-xs">${index+1}</div>
                        <input type="text" placeholder="URL da Imagem do Parceiro" value="${p.image}" onchange="updatePartner(${index}, this.value)" class="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-green-500 outline-none">
                        <button type="button" onclick="removePartner(${index})" class="text-red-400 hover:text-red-600 transition opacity-50 group-hover:opacity-100"><i class="fas fa-times-circle text-xl"></i></button>
                    </div>
                `;
            });
        }

        function addStat() { currentStats.push({ title: '', count: 0 }); renderStats(); }
        function removeStat(i) { currentStats.splice(i, 1); renderStats(); }
        function updateStat(i, field, val) { currentStats[i][field] = val; }

        function addPartner() { currentPartners.push({ image: '' }); renderPartners(); }
        function removePartner(i) { currentPartners.splice(i, 1); renderPartners(); }
        function updatePartner(i, val) { currentPartners[i].image = val; }

        document.getElementById('homeForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const body = {
                whoWeAre: {
                    text: document.getElementById('whoText').value,
                    image: document.getElementById('whoImage').value
                },
                learnMoreVideo: document.getElementById('videoUrl').value,
                results: {
                    year: document.getElementById('statsYear').value,
                    stats: currentStats
                },
                partners: currentPartners
            };

            await fetch(`${SERVER_URL}/api/content/home`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(body)
            });
            alert('Salvo com sucesso!');
        });

        loadData();
        window.addStat = addStat;
        window.removeStat = removeStat;
        window.updateStat = updateStat;
        window.addPartner = addPartner;
        window.removePartner = removePartner;
        window.updatePartner = updatePartner;
    });
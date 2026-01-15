// admin/js/edit_home.js

// Função auxiliar para converter arquivo em Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

document.addEventListener('DOMContentLoaded', () => {
    let currentStats = [];
    let currentPartners = [];

    async function loadData() {
        try {
            const res = await fetch(`/api/content/home`);
            const data = await res.json();
            
            // Quem Somos (Texto)
            document.getElementById('whoText').value = data.whoWeAre?.text || '';
            
            // Quem Somos (Imagem)
            const whoImg = data.whoWeAre?.image || '';
            document.getElementById('whoImageBase64').value = whoImg;
            if(whoImg) {
                const preview = document.getElementById('whoImagePreview');
                preview.src = whoImg;
                preview.classList.remove('hidden');
            }

            // Vídeo
            document.getElementById('videoUrl').value = data.learnMoreVideo || '';
            
            // Resultados
            document.getElementById('statsYear').value = data.results?.year || new Date().getFullYear();
            currentStats = data.results?.stats || [];
            
            // Parceiros
            currentPartners = data.partners || [];

            renderStats();
            renderPartners();
        } catch(e) {
            console.log("Erro ao carregar dados", e);
        }
    }

    // Listener para imagem Quem Somos
    const whoInput = document.getElementById('whoImageInput');
    if(whoInput) {
        whoInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if(file) {
                const base64 = await toBase64(file);
                document.getElementById('whoImageBase64').value = base64;
                const preview = document.getElementById('whoImagePreview');
                preview.src = base64;
                preview.classList.remove('hidden');
            }
        });
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
            const imgDisplay = p.image 
                ? `<img src="${p.image}" class="h-10 w-10 object-contain border rounded bg-white">` 
                : '<div class="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">?</div>';

            div.innerHTML += `
                <div class="flex gap-3 items-center group bg-gray-50 p-2 rounded border">
                    <div class="bg-gray-200 text-gray-500 font-bold text-xs w-6 h-6 flex items-center justify-center rounded">${index+1}</div>
                    ${imgDisplay}
                    <input type="file" accept="image/*" onchange="handlePartnerFile(${index}, this)" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 flex-1">
                    <button type="button" onclick="removePartner(${index})" class="text-red-400 hover:text-red-600 p-2"><i class="fas fa-times-circle text-xl"></i></button>
                </div>
            `;
        });
    }

    window.handlePartnerFile = async (index, input) => {
        const file = input.files[0];
        if(file) {
            const base64 = await toBase64(file);
            currentPartners[index].image = base64;
            renderPartners();
        }
    };

    function addStat() { currentStats.push({ title: '', count: 0 }); renderStats(); }
    function removeStat(i) { currentStats.splice(i, 1); renderStats(); }
    function updateStat(i, field, val) { currentStats[i][field] = val; }

    function addPartner() { currentPartners.push({ image: '' }); renderPartners(); }
    function removePartner(i) { currentPartners.splice(i, 1); renderPartners(); }

    document.getElementById('homeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // --- CORREÇÃO AQUI ---
        // Buscamos o botão globalmente pelo atributo 'form', já que ele está fora da tag <form>
        const btn = document.querySelector('button[form="homeForm"]');
        
        const originalText = btn ? btn.innerHTML : 'Salvar Tudo';
        if(btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
            btn.disabled = true;
        }

        const token = localStorage.getItem('token');
        const body = {
            whoWeAre: {
                text: document.getElementById('whoText').value,
                image: document.getElementById('whoImageBase64').value
            },
            learnMoreVideo: document.getElementById('videoUrl').value,
            results: {
                year: document.getElementById('statsYear').value,
                stats: currentStats
            },
            partners: currentPartners
        };

        try {
            const res = await fetch(`/api/content/home`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
                body: JSON.stringify(body)
            });
            if(!res.ok) throw new Error();
            alert('Salvo com sucesso!');
        } catch (err) {
            alert('Erro ao salvar dados.');
        } finally {
            if(btn) {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }
    });

    loadData();
    
    window.addStat = addStat;
    window.removeStat = removeStat;
    window.updateStat = updateStat;
    window.addPartner = addPartner;
    window.removePartner = removePartner;
});
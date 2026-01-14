// 1. Exportar Dados
async function exportData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return alert("Sessão expirada. Faça login novamente.");

        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
        btn.disabled = true;

        const res = await fetch('http://localhost:3000/api/backup/export', {
            headers: { 'x-auth-token': token }
        });

        if (!res.ok) throw new Error("Falha ao exportar.");

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Pega o nome do arquivo do header se disponível, senão gera um
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = 'backup.json';
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match) fileName = match[1];
        }

        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

    } catch (err) {
        console.error(err);
        alert("Erro ao exportar dados.");
    } finally {
        const btn = document.querySelector('button[onclick="exportData()"]');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-download"></i> Baixar Arquivo JSON';
            btn.disabled = false;
        }
    }
}

// 2. Importar Dados
async function importData(input) {
    const file = input.files[0];
    if (!file) return;

    if (!confirm("Tem certeza absoluta? Todos os dados atuais serão APAGADOS e substituídos pelo conteúdo deste arquivo.")) {
        input.value = ''; // Reset input
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);
            const token = localStorage.getItem('token');

            // Feedback visual
            const btn = input.nextElementSibling; // O botão que disparou o click
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importando...';
            btn.disabled = true;

            const res = await fetch('http://localhost:3000/api/backup/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(jsonData)
            });

            const responseData = await res.json();

            if (res.ok) {
                alert(responseData.msg || "Dados importados com sucesso!");
                window.location.reload(); // Recarrega para garantir
            } else {
                throw new Error(responseData.msg || "Erro na importação");
            }

        } catch (err) {
            console.error(err);
            alert("Erro ao importar: " + err.message);
        } finally {
            input.value = '';
            const btn = input.nextElementSibling;
            if (btn) {
                btn.innerHTML = '<i class="fas fa-upload"></i> Selecionar Arquivo JSON';
                btn.disabled = false;
            }
        }
    };

    reader.readAsText(file);
}

window.exportData = exportData;
window.importData = importData;




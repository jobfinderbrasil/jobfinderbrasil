// filtro.js - Versão Melhorada

let filtroAtual = 'todos';
let todasVagas = []; // Para armazenar as vagas

// Função principal de filtro
function aplicarFiltro(tipo) {
    filtroAtual = tipo;
    
    const inputBusca = document.getElementById('input-busca');
    const termoBusca = inputBusca ? inputBusca.value.trim() : '';
    
    if (termoBusca) {
        // Se há termo de busca, usa o sistema inteligente
        const resultados = buscarInteligente(termoBusca, tipo);
        exibirResultados(resultados, termoBusca);
    } else {
        // Apenas filtro por tipo
        filtrarApenasPorTipo(tipo);
    }
    
    rolarParaResultados();
}

function filtrarApenasPorTipo(tipo) {
    const containers = document.querySelectorAll('.job-card-container');
    let count = 0;
    
    containers.forEach(container => {
        const cardTipo = container.getAttribute('data-tipo');
        
        if (tipo === 'todos' || cardTipo === tipo) {
            container.style.display = 'block';
            count++;
        } else {
            container.style.display = 'none';
        }
    });
    
    atualizarTituloFiltro(tipo, count);
}

function atualizarTituloFiltro(tipo, quantidade) {
    const tituloSecao = document.getElementById('titulo-secao');
    if (!tituloSecao) return;

    const tipos = {
        'todos': `Todas as Postagens (${quantidade})`,
        'vaga': `Vagas em Destaque (${quantidade})`,
        'concurso': `Concursos em Destaque (${quantidade})`, 
        'curso': `Cursos em Destaque (${quantidade})`,
        'dica': `Dicas de Carreira (${quantidade})`
    };
    
    tituloSecao.innerHTML = tipos[tipo] || 'Postagens Recentes';
}

function rolarParaResultados() {
    setTimeout(() => {
        const jobsSection = document.getElementById('jobs-container');
        if (jobsSection) {
            jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}

// Compatibilidade
function filtrarVagas(tipo) {
    aplicarFiltro(tipo);
}
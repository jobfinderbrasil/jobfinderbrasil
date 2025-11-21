// js/carregarVagas.js - VERSÃO COM PAGINAÇÃO

let todasVagas = [];
let termoBuscaAtual = '';
let paginaAtual = 1;
const itensPorPagina = 6;
let vagasFiltradasAtuais = [];

// Função para obter parâmetros da URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramsObj = {};
    for (let [key, value] of params) {
        paramsObj[key] = value;
    }
    return paramsObj;
}

// Função para aplicar filtro baseado na URL
function aplicarFiltroDaURL() {
    const params = getUrlParams();
    if (params.filter) {
        console.log('Aplicando filtro da URL:', params.filter);
        filtrarPorTipo(params.filter);
        
        // Atualizar o título da seção
        const tituloSecao = document.getElementById('titulo-secao');
        if (tituloSecao) {
            const tipos = {
                'vaga': 'Vagas em Destaque',
                'concurso': 'Concursos em Destaque', 
                'curso': 'Cursos em Destaque',
                'dica': 'Dicas de Carreira'
            };
            tituloSecao.textContent = tipos[params.filter] || 'Postagens Recentes';
        }
    }
}

// Função para exibir vagas na tela
function exibirVagas(vagasParaExibir) {
  const container = document.getElementById('jobs-container');
  const loadingContainer = document.getElementById('loading-container');

  if (!container) {
    console.error('Container não encontrado!');
    return;
  }

  // Esconder loading
  if (loadingContainer) {
    loadingContainer.style.display = 'none';
  }

  // Calcular o índice inicial e final para a página atual
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const vagasPaginadas = vagasParaExibir.slice(inicio, fim);

  if (vagasPaginadas.length === 0) {
    container.innerHTML = `

    `;
    return;
  }

  container.innerHTML = vagasPaginadas.map(post => {
    let borderColor = '';
    let badgeColor = '';

    if (post.tipo === 'vaga') {
      borderColor = 'border-l-blue-500';
      badgeColor = 'bg-blue-100 text-blue-800';
    } else if (post.tipo === 'concurso') {
      borderColor = 'border-l-green-500';
      badgeColor = 'bg-green-100 text-green-800';
    } else if (post.tipo === 'curso') {
      borderColor = 'border-l-yellow-500';
      badgeColor = 'bg-yellow-100 text-yellow-800';
    } else if (post.tipo === 'dica') {
      borderColor = 'border-l-purple-500';
      badgeColor = 'bg-purple-100 text-purple-800';
    }

    return `
      <div class="bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${borderColor} hover:shadow-lg transition duration-300 job-card-container" data-tipo="${post.tipo}">
        <div class="h-40 md:h-48 overflow-hidden">
          <img class="w-full h-full object-cover" src="${post.imagem}" alt="${post.titulo}">
        </div>
        <div class="p-4 md:p-6">
          <div class="flex justify-between items-start mb-3">
            <span class="inline-block px-3 py-1 text-xs font-semibold rounded-full ${badgeColor}">
              ${post.categoria}
            </span>
            <span class="text-sm text-gray-500">${post.data}</span>
          </div>
          <h3 class="text-lg md:text-xl font-bold text-gray-800 mb-3 line-clamp-2">${post.titulo}</h3>
          <p class="text-gray-600 mb-4 text-sm md:text-base line-clamp-3">${post.descricao}</p>
          <a href="${post.link}" class="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition text-sm md:text-base">
            Saiba mais
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
      </div>
    `;
  }).join('');

  // Atualizar a paginação
  atualizarPaginacao(vagasParaExibir.length);
}

// Função para atualizar os controles de paginação
function atualizarPaginacao(totalItens) {
  const totalPaginas = Math.ceil(totalItens / itensPorPagina);
  const container = document.getElementById('paginacao-container');

  if (totalPaginas <= 1) {
    container.innerHTML = '';
    return;
  }

  let paginacaoHTML = `
    <div class="flex flex-col items-center space-y-4">
      <div class="flex items-center space-x-2">
        <button onclick="paginaAnterior()" 
          class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          ${paginaAtual === 1 ? 'disabled' : ''}>
          <i class="fas fa-chevron-left text-xs"></i>
        </button>
  `;

  // Mostrar no máximo 5 números de página
  let inicio = Math.max(1, paginaAtual - 2);
  let fim = Math.min(totalPaginas, inicio + 4);
  
  // Ajustar início se estiver no final
  if (fim - inicio < 4) {
    inicio = Math.max(1, fim - 4);
  }

  for (let i = inicio; i <= fim; i++) {
    paginacaoHTML += `
      <button onclick="irParaPagina(${i})" 
        class="w-10 h-10 rounded-lg border ${paginaAtual === i ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'} transition">
        ${i}
      </button>
    `;
  }

  paginacaoHTML += `
        <button onclick="proximaPagina()" 
          class="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          ${paginaAtual === totalPaginas ? 'disabled' : ''}>
          <i class="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
      <div class="text-center text-sm text-gray-600">
        Página ${paginaAtual} de ${totalPaginas} • 
        ${totalItens} postagens no total
      </div>
    </div>
  `;

  container.innerHTML = paginacaoHTML;
}

// Funções de navegação da paginação
function proximaPagina() {
  const totalPaginas = Math.ceil(vagasFiltradasAtuais.length / itensPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    exibirVagas(vagasFiltradasAtuais);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function paginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    exibirVagas(vagasFiltradasAtuais);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function irParaPagina(pagina) {
  paginaAtual = pagina;
  exibirVagas(vagasFiltradasAtuais);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para filtrar por tipo
function filtrarPorTipo(tipo) {
  console.log(`Filtrando por: ${tipo}`);

  let vagasFiltradas;

  if (tipo === 'todos') {
    vagasFiltradas = todasVagas;
  } else {
    vagasFiltradas = todasVagas.filter(post => post.tipo === tipo);
  }

  // Aplicar busca se houver termo
  if (termoBuscaAtual) {
    vagasFiltradas = vagasFiltradas.filter(post => {
      const textoBusca = `${post.titulo} ${post.descricao} ${post.categoria}`.toLowerCase();
      return textoBusca.includes(termoBuscaAtual.toLowerCase());
    });
  }

  // Resetar para a primeira página ao filtrar
  paginaAtual = 1;
  vagasFiltradasAtuais = vagasFiltradas;

  // Atualizar título
  const titulo = document.getElementById('titulo-secao');

  let tituloTexto = '';
  if (tipo === 'vaga') {
    tituloTexto = `Vagas de Emprego`;
  } else if (tipo === 'concurso') {
    tituloTexto = `Concursos Públicos`;
  } else if (tipo === 'curso') {
    tituloTexto = `Cursos e Capacitações`;
  } else if (tipo === 'dica') {
    tituloTexto = `Dicas de Carreira`;
  } else {
    tituloTexto = `Postagens Recentes`;
  }

  titulo.innerHTML = `${tituloTexto}`;

  exibirVagas(vagasFiltradas);
}

// Função de busca
function executarBusca(termo) {
  termoBuscaAtual = termo.trim();
  console.log(`Buscando por: "${termoBuscaAtual}"`);

  let vagasFiltradas = todasVagas;

  // Aplicar filtro de busca
  if (termoBuscaAtual) {
    vagasFiltradas = todasVagas.filter(post => {
      const textoBusca = `${post.titulo} ${post.descricao} ${post.categoria} ${post.tipo}`.toLowerCase();
      return textoBusca.includes(termoBuscaAtual.toLowerCase());
    });
  }

  // Resetar para a primeira página ao buscar
  paginaAtual = 1;
  vagasFiltradasAtuais = vagasFiltradas;

  // Atualizar título
  const titulo = document.getElementById('titulo-secao');

  if (termoBuscaAtual) {
    titulo.innerHTML = `Resultados da Busca`;
  } else {
    titulo.innerHTML = `Todas as Postagens`;
  }

  exibirVagas(vagasFiltradas);
}

// Função principal para carregar as vagas
function carregarVagas() {
  fetch('./vagas.json')
    .then(res => res.ok ? res.json() : Promise.reject('Erro ao carregar'))
    .then(posts => {
      todasVagas = posts;
      console.log('Vagas carregadas:', todasVagas.length);
      vagasFiltradasAtuais = todasVagas;
      
      // Aplicar filtro da URL se existir
      aplicarFiltroDaURL();
      
      // Se não houver filtro na URL, mostrar tudo
      const params = getUrlParams();
      if (!params.filter) {
        filtrarPorTipo('todos');
      }
    })
    .catch((error) => {
      console.error('Erro:', error);
      const container = document.getElementById('jobs-container');
      const loadingContainer = document.getElementById('loading-container');
      
      if (loadingContainer) {
        loadingContainer.style.display = 'none';
      }
      
      if (container) {
        container.innerHTML = '<p class="text-red-500 text-center py-8 col-span-3">Não foi possível carregar as postagens.</p>';
      }
    });
}

// Quando a página carregar, executar tudo
document.addEventListener('DOMContentLoaded', function () {
  console.log('Página carregada!');
  carregarVagas();

  // CONFIGURAR OS CLICKS DO MENU - ATUALIZADO
  const linksMenu = document.querySelectorAll('#menu a[data-tipo], #mobile-menu a[data-tipo]');

  linksMenu.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const tipo = this.getAttribute('data-tipo');
      console.log('Clicou em:', tipo);
      filtrarPorTipo(tipo);
    });
  });

  // CONFIGURAR A BUSCA
  const formBusca = document.querySelector('form');
  const inputBusca = document.querySelector('input[type="text"]');

  if (formBusca && inputBusca) {
    // Busca quando digitar (em tempo real)
    inputBusca.addEventListener('input', function (e) {
      const termo = e.target.value;
      executarBusca(termo);
    });

    // Busca quando enviar o formulário
    formBusca.addEventListener('submit', function (e) {
      e.preventDefault();
      const termo = inputBusca.value;
      executarBusca(termo);
    });

    console.log('Sistema de busca configurado!');
  } else {
    console.error('Elementos de busca não encontrados!');
  }
});

// Funções para gerenciar favoritos
function getFavoritos() {
    return JSON.parse(localStorage.getItem('favoritos')) || [];
}

function toggleFavorito(vagaId) {
    const favoritos = getFavoritos();
    const index = favoritos.indexOf(vagaId);
    
    if (index === -1) {
        // Adicionar
        favoritos.push(vagaId);
    } else {
        // Remover
        favoritos.splice(index, 1);
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    return index === -1; // true se adicionou, false se removeu
}

function isFavorito(vagaId) {
    const favoritos = getFavoritos();
    return favoritos.includes(vagaId);
}
// Garante que as variáveis globais estejam disponíveis
window.todasVagas = todasVagas;
window.filtroAtual = 'todos';
window.aplicarFiltro = function(tipo) {
    filtroAtual = tipo;
    const vagasFiltradas = tipo === 'todos' ? todasVagas : todasVagas.filter(vaga => vaga.tipo === tipo);
    exibirVagas(vagasFiltradas);
    
    const tituloSecao = document.getElementById('titulo-secao');
    if (tituloSecao) {
        const titulos = {
            'todos': 'Todas as Postagens',
            'vaga': 'Vagas de Emprego',
            'concurso': 'Concursos Públicos',
            'curso': 'Cursos Profissionalizantes',
            'dica': 'Dicas de Carreira'
        };
        tituloSecao.textContent = titulos[tipo] || 'Postagens Recentes';
    }
};
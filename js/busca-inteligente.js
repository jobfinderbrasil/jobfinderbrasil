// busca-inteligente.js - Sistema Verdadeiramente Inteligente

class BuscadorInteligente {
    constructor() {
        this.vagasIndexadas = [];
        this.indiceInvertido = new Map();
        this.config = {
            minSimilaridade: 0.6,
            maxSugestoes: 5,
            buscaRapidaLimite: 3 // Caracteres mínimos para busca rápida
        };
    }

    indexarVagas(vagas) {
        this.vagasIndexadas = vagas;
        this.construirIndiceInvertido(vagas);
    }

    construirIndiceInvertido(vagas) {
        this.indiceInvertido.clear();
        
        vagas.forEach((vaga, index) => {
            const texto = `${vaga.titulo} ${vaga.descricao} ${vaga.categoria} ${vaga.tipo}`.toLowerCase();
            const palavras = this.tokenizar(texto);
            
            palavras.forEach(palavra => {
                if (!this.indiceInvertido.has(palavra)) {
                    this.indiceInvertido.set(palavra, []);
                }
                this.indiceInvertido.get(palavra).push(index);
            });
        });
    }

    tokenizar(texto) {
        return texto
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(palavra => palavra.length > 2)
            .map(palavra => this.corrigirOrtografia(palavra));
    }

    // Corretor ortográfico simples
    corrigirOrtografia(palavra) {
        const correcoes = {
            // Erros comuns
            'axiliar': 'auxiliar', 'auxilar': 'auxiliar', 'asistente': 'assistente',
            'oprador': 'operador', 'tecniko': 'técnico', 'tecnica': 'técnico',
            'aprendis': 'aprendiz', 'estagio': 'estágio', 'estagiario': 'estagiário',
            'concuso': 'concurso', 'edital': 'concurso', 'vaga': 'vaga',
            'emanus': 'manaus', 'amazonas': 'manaus',
            'honda': 'honda', 'samel': 'samel', 'assai': 'assaí',
            
            // Sinônimos
            'emprego': 'vaga', 'trabalho': 'vaga', 'ocupacao': 'vaga',
            'concurso publico': 'concurso', 'seletivo': 'concurso',
            'curso': 'curso', 'capacitacao': 'curso', 'treinamento': 'curso'
        };
        
        return correcoes[palavra] || palavra;
    }

    // Busca principal - tolerante a erros
    buscar(termo, tipoFiltro = 'todos') {
        if (!termo.trim()) {
            return this.filtrarPorTipo(tipoFiltro);
        }

        const termos = this.tokenizar(termo);
        let resultados = [];

        // Estratégia 1: Busca exata
        resultados = this.buscaExata(termos, tipoFiltro);
        if (resultados.length > 0) return this.ordenarPorRelevancia(resultados, termos);

        // Estratégia 2: Busca por similaridade
        resultados = this.buscaSimilar(termos, tipoFiltro);
        if (resultados.length > 0) return this.ordenarPorRelevancia(resultados, termos);

        // Estratégia 3: Busca fonética
        resultados = this.buscaFonetica(termos, tipoFiltro);
        
        return this.ordenarPorRelevancia(resultados, termos);
    }

    buscaExata(termos, tipoFiltro) {
        const indicesEncontrados = new Set();
        
        termos.forEach(termo => {
            if (this.indiceInvertido.has(termo)) {
                this.indiceInvertido.get(termo).forEach(indice => {
                    indicesEncontrados.add(indice);
                });
            }
        });

        return this.filtrarIndicesPorTipo(Array.from(indicesEncontrados), tipoFiltro);
    }

    buscaSimilar(termos, tipoFiltro) {
        const indicesEncontrados = new Set();
        const todasPalavras = Array.from(this.indiceInvertido.keys());

        termos.forEach(termoBusca => {
            todasPalavras.forEach(palavraIndice => {
                const similaridade = this.calcularSimilaridade(termoBusca, palavraIndice);
                if (similaridade >= this.config.minSimilaridade) {
                    this.indiceInvertido.get(palavraIndice).forEach(indice => {
                        indicesEncontrados.add(indice);
                    });
                }
            });
        });

        return this.filtrarIndicesPorTipo(Array.from(indicesEncontrados), tipoFiltro);
    }

    buscaFonetica(termos, tipoFiltro) {
        const indicesEncontrados = new Set();
        const todasPalavras = Array.from(this.indiceInvertido.keys());

        termos.forEach(termoBusca => {
            todasPalavras.forEach(palavraIndice => {
                if (this.saoFoneticamenteSimilares(termoBusca, palavraIndice)) {
                    this.indiceInvertido.get(palavraIndice).forEach(indice => {
                        indicesEncontrados.add(indice);
                    });
                }
            });
        });

        return this.filtrarIndicesPorTipo(Array.from(indicesEncontrados), tipoFiltro);
    }

    calcularSimilaridade(str1, str2) {
        // Algoritmo de similaridade de Jaro-Winkler simplificado
        if (str1 === str2) return 1.0;
        
        const len1 = str1.length;
        const len2 = str2.length;
        const maxDist = Math.floor(Math.max(len1, len2) / 2) - 1;
        
        let matches = 0;
        let transpositions = 0;
        const str1Matches = new Array(len1).fill(false);
        const str2Matches = new Array(len2).fill(false);

        // Encontrar matches
        for (let i = 0; i < len1; i++) {
            const start = Math.max(0, i - maxDist);
            const end = Math.min(i + maxDist + 1, len2);
            
            for (let j = start; j < end; j++) {
                if (!str2Matches[j] && str1[i] === str2[j]) {
                    str1Matches[i] = true;
                    str2Matches[j] = true;
                    matches++;
                    break;
                }
            }
        }

        if (matches === 0) return 0.0;

        // Calcular transposições
        let k = 0;
        for (let i = 0; i < len1; i++) {
            if (str1Matches[i]) {
                while (!str2Matches[k]) k++;
                if (str1[i] !== str2[k]) transpositions++;
                k++;
            }
        }

        const jaro = (
            (matches / len1) +
            (matches / len2) + 
            ((matches - transpositions / 2) / matches)
        ) / 3.0;

        // Prefixo comum (máximo 4 caracteres)
        let prefix = 0;
        for (let i = 0; i < Math.min(4, len1, len2); i++) {
            if (str1[i] === str2[i]) prefix++;
            else break;
        }

        return jaro + (prefix * 0.1 * (1 - jaro));
    }

    saoFoneticamenteSimilares(str1, str2) {
        // Simplificação fonética - converte sons similares
        const mapaFonetico = {
            'c': 'k', 'ç': 's', 'x': 's', 'z': 's', 'ph': 'f',
            'y': 'i', 'w': 'v', 'mn': 'n', 'mb': 'b', 'mp': 'b'
        };

        let fon1 = str1.toLowerCase();
        let fon2 = str2.toLowerCase();

        // Aplica transformações fonéticas
        Object.keys(mapaFonetico).forEach(de => {
            const para = mapaFonetico[de];
            fon1 = fon1.replace(new RegExp(de, 'g'), para);
            fon2 = fon2.replace(new RegExp(de, 'g'), para);
        });

        return this.calcularSimilaridade(fon1, fon2) > 0.8;
    }

    filtrarIndicesPorTipo(indices, tipoFiltro) {
        return indices
            .map(indice => this.vagasIndexadas[indice])
            .filter(vaga => tipoFiltro === 'todos' || vaga.tipo === tipoFiltro);
    }

    ordenarPorRelevancia(vagas, termosBusca) {
        return vagas.map(vaga => {
            const score = this.calcularRelevancia(vaga, termosBusca);
            return { vaga, score };
        })
        .sort((a, b) => b.score - a.score)
        .map(item => item.vaga);
    }

    calcularRelevancia(vaga, termosBusca) {
        let score = 0;
        const texto = `${vaga.titulo} ${vaga.descricao}`.toLowerCase();

        termosBusca.forEach(termo => {
            // Peso maior no título
            if (vaga.titulo.toLowerCase().includes(termo)) score += 3;
            // Peso médio na descrição
            if (vaga.descricao.toLowerCase().includes(termo)) score += 1;
            // Peso no tipo/categoria
            if (vaga.categoria.toLowerCase().includes(termo)) score += 2;
        });

        return score;
    }

    filtrarPorTipo(tipo) {
        if (tipo === 'todos') return [...this.vagasIndexadas];
        return this.vagasIndexadas.filter(vaga => vaga.tipo === tipo);
    }

    // Busca rápida para sugestões em tempo real
    buscarSugestoes(termo) {
        if (termo.length < this.config.buscaRapidaLimite) return [];
        
        const termos = this.tokenizar(termo);
        const sugestoes = new Set();
        const todasPalavras = Array.from(this.indiceInvertido.keys());

        termos.forEach(termoBusca => {
            todasPalavras.forEach(palavra => {
                if (palavra.includes(termoBusca) || termoBusca.includes(palavra)) {
                    sugestoes.add(palavra);
                }
            });
        });

        return Array.from(sugestoes).slice(0, this.config.maxSugestoes);
    }
}

// Instância global
const buscadorInteligente = new BuscadorInteligente();

// Função de busca global
function buscarInteligente(termo, tipoFiltro = 'todos') {
    return buscadorInteligente.buscar(termo, tipoFiltro);
}

// Sistema de busca otimizado
function inicializarSistemaBusca() {
    const formBusca = document.querySelector('form');
    const inputBusca = document.getElementById('input-busca');
    
    if (!formBusca || !inputBusca) return;

    // Indexar vagas quando disponíveis
    if (typeof todasVagas !== 'undefined' && todasVagas.length > 0) {
        buscadorInteligente.indexarVagas(todasVagas);
    }

    // Busca ao enviar formulário (PRINCIPAL)
    formBusca.addEventListener('submit', function(e) {
        e.preventDefault();
        const termo = inputBusca.value.trim();
        
        if (termo) {
            const resultados = buscarInteligente(termo, filtroAtual);
            exibirResultadosBusca(resultados, termo);
        } else {
            aplicarFiltro(filtroAtual);
        }
    });

    // Busca em tempo real apenas para sugestões (OPCIONAL)
    let timeoutSugestoes;
    inputBusca.addEventListener('input', function(e) {
        clearTimeout(timeoutSugestoes);
        const termo = e.target.value.trim();
        
        // Apenas mostra sugestões para termos com mais de 2 caracteres
        if (termo.length > 2) {
            timeoutSugestoes = setTimeout(() => {
                const sugestoes = buscadorInteligente.buscarSugestoes(termo);
                mostrarSugestoesEmTempoReal(sugestoes, termo);
            }, 500);
        } else {
            esconderSugestoes();
        }
    });

    // Focar na busca quando clicar em sugestões
    inputBusca.addEventListener('focus', function() {
        const termo = this.value.trim();
        if (termo.length > 2) {
            const sugestoes = buscadorInteligente.buscarSugestoes(termo);
            mostrarSugestoesEmTempoReal(sugestoes, termo);
        }
    });

    // Esconder sugestões ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.container-busca')) {
            esconderSugestoes();
        }
    });
}

// Exibir resultados
function exibirResultadosBusca(resultados, termo) {
    if (!resultados || resultados.length === 0) {
        exibirSemResultados(termo);
        return;
    }

    if (typeof exibirVagas === 'function') {
        exibirVagas(resultados);
    }
    
    mostrarResultadoBusca(termo, resultados.length);
    esconderSugestoes();
}

function exibirSemResultados(termo) {
    const container = document.getElementById('jobs-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="max-w-md mx-auto">
                <i class="fas fa-search text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">
                    Nenhum resultado encontrado para "${termo}"
                </h3>
                <p class="text-gray-500 mb-4">
                    Mas não desista! Tente estas sugestões:
                </p>
                <div class="flex flex-wrap gap-2 justify-center">
                    <button class="sugestao-busca bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                        auxiliar de produção
                    </button>
                    <button class="sugestao-busca bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                        operador de máquinas
                    </button>
                    <button class="sugestao-busca bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition">
                        técnico em manutenção
                    </button>
                </div>
            </div>
        </div>
    `;
}

function mostrarResultadoBusca(termo, quantidade) {
    const tituloSection = document.getElementById('titulo-secao');
    if (!tituloSection) return;

    const tipos = {
        'todos': 'resultados',
        'vaga': 'vagas',
        'concurso': 'concursos', 
        'curso': 'cursos',
        'dica': 'dicas'
    };
    
    tituloSection.innerHTML = `
        <span class="text-green-600">
            <i class="fas fa-search mr-2"></i>${quantidade} ${tipos[filtroAtual] || 'resultados'} para
        </span>
        <span class="text-blue-600">"${termo}"</span>
    `;
}

// Sistema de sugestões em tempo real
function mostrarSugestoesEmTempoReal(sugestoes, termo) {
    esconderSugestoes();
    
    if (sugestoes.length === 0) return;
    
    const inputBusca = document.getElementById('input-busca');
    const container = inputBusca.parentElement;
    
    const sugestoesHTML = `
        <div class="sugestoes-container absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
            <div class="p-2">
                <div class="text-xs text-gray-500 mb-2">Sugestões:</div>
                ${sugestoes.map(sugestao => `
                    <div class="sugestao-item p-2 hover:bg-blue-50 cursor-pointer rounded text-gray-700" data-sugestao="${sugestao}">
                        <i class="fas fa-search mr-2 text-blue-500"></i>${sugestao}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.classList.add('container-busca', 'relative');
    container.insertAdjacentHTML('beforeend', sugestoesHTML);
    
    // Event listeners para sugestões
    container.querySelectorAll('.sugestao-item').forEach(item => {
        item.addEventListener('click', function() {
            const sugestao = this.getAttribute('data-sugestao');
            inputBusca.value = sugestao;
            const resultados = buscarInteligente(sugestao, filtroAtual);
            exibirResultadosBusca(resultados, sugestao);
        });
    });
}

function esconderSugestoes() {
    document.querySelectorAll('.sugestoes-container').forEach(el => el.remove());
}

// Event listeners para sugestões de fallback
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('sugestao-busca')) {
        const inputBusca = document.getElementById('input-busca');
        if (inputBusca) {
            inputBusca.value = e.target.textContent.trim();
            const resultados = buscarInteligente(e.target.textContent.trim(), filtroAtual);
            exibirResultadosBusca(resultados, e.target.textContent.trim());
        }
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar carregamento das vagas
    const checkVagasLoaded = setInterval(() => {
        if (typeof todasVagas !== 'undefined' && todasVagas.length > 0) {
            clearInterval(checkVagasLoaded);
            inicializarSistemaBusca();
        }
    }, 100);

    // Timeout de segurança
    setTimeout(() => clearInterval(checkVagasLoaded), 5000);
});
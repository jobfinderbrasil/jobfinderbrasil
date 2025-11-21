// js/menu-mobile.js

function inicializarMenuMobile() {
    const btn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!btn || !mobileMenu) {
        console.warn('Elementos do menu mobile não encontrados');
        return;
    }

    let menuOpen = false;

    // Função para fechar o menu
    function fecharMenu() {
        menuOpen = false;
        btn.classList.remove('active', 'bg-gray-200');
        mobileMenu.classList.add('hidden');
        mobileMenu.style.transform = 'translateY(-10px)';
        mobileMenu.style.opacity = '0';
        
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 200);
    }

    // Função para abrir o menu
    function abrirMenu() {
        menuOpen = true;
        btn.classList.add('active', 'bg-gray-200');
        mobileMenu.classList.remove('hidden');
        
        // Forçar reflow para a animação funcionar
        mobileMenu.offsetHeight;
        
        // Animação de entrada suave
        mobileMenu.style.transform = 'translateY(0)';
        mobileMenu.style.opacity = '1';
    }

    // Função para alternar o menu
    function toggleMenu() {
        if (menuOpen) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    }

    // Configurar estilos iniciais para animação
    mobileMenu.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    mobileMenu.style.transform = 'translateY(-10px)';
    mobileMenu.style.opacity = '0';

    // Evento no botão do menu
    btn.addEventListener('click', toggleMenu);

    // 🔥 EVENTO NOS LINKS DO MENU MOBILE - ATUALIZADO 🔥
    const linksMobile = mobileMenu.querySelectorAll('a');
    linksMobile.forEach(link => {
        link.addEventListener('click', function(e) {
            // ✅ PARA LINKS QUE REDIRECIONAM PARA INDEX.HTML COM FILTRO
            if (this.getAttribute('href') && this.getAttribute('href').includes('index.html?filter=')) {
                console.log('Redirecionando para index com filtro:', this.getAttribute('href'));
                fecharMenu();
                // DEIXA O LINK FUNCIONAR NORMALMENTE (NÃO PREVINE DEFAULT)
                return;
            }
            
            // ✅ PARA LINKS ÂNCORA NA MESMA PÁGINA
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    fecharMenu();
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            } else {
                // ✅ PARA OUTROS LINKS (CONTATO, SOBRE, ETC)
                fecharMenu();
                // Deixa o link funcionar normalmente
            }
        });
    });

    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 640) {
            fecharMenu();
        }
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (menuOpen && !btn.contains(e.target) && !mobileMenu.contains(e.target)) {
            fecharMenu();
        }
    });

    // 🔥 INICIALIZAR LINKS ENTRE PÁGINAS - NOVA FUNÇÃO 🔥
    inicializarLinksMultiPagina();
}

// 🔥 NOVA FUNÇÃO PARA LIDAR COM LINKS ENTRE PÁGINAS 🔥
function inicializarLinksMultiPagina() {
    // Links que redirecionam para index.html com filtros (menu desktop também)
    const linksFiltro = document.querySelectorAll('a[href*="index.html?filter="]');
    
    linksFiltro.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('🔗 Link de filtro clicado:', this.getAttribute('href'));
            // Não precisa prevenir default - deixa redirecionar normalmente
            // Apenas garante que o menu mobile feche se estiver aberto
            const mobileMenu = document.getElementById('mobile-menu');
            const btn = document.getElementById('menu-btn');
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                btn.classList.remove('active', 'bg-gray-200');
            }
        });
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', inicializarMenuMobile);
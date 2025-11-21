// WhatsApp Button - Versão Premium com Font Awesome (Botão X Corrigido)
console.log('✅ WhatsApp Button: Script carregado!');

function createWhatsAppButton() {
    console.log('🚀 Criando botão WhatsApp...');
    
    // Verificar se já existe
    if (document.getElementById('whatsapp-button')) {
        return;
    }

    // Adicionar Font Awesome se não estiver presente
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    const buttonHTML = `
    <div id="whatsapp-button" style="
        position: fixed; 
        bottom: 20px; 
        right: 20px; 
        z-index: 9999;
        background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
        color: white; 
        padding: 18px 22px; 
        border-radius: 50px;
        box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
        font-family: 'Segoe UI', Arial, sans-serif; 
        font-size: 15px;
        cursor: pointer; 
        display: flex; 
        align-items: center; 
        gap: 14px;
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        max-width: calc(100vw - 40px);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    ">
        <!-- Ícone WhatsApp animado -->
        <div style="
            font-size: 28px; 
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            animation: pulse 2s infinite;
            position: relative;
            z-index: 2;
        ">
            <i class="fab fa-whatsapp"></i>
        </div>
        
        <!-- Texto -->
        <div style="
            display: flex; 
            flex-direction: column; 
            text-align: left; 
            line-height: 1.4; 
            flex: 1;
            position: relative;
            z-index: 2;
        ">
            <span style="
                font-weight: 700; 
                font-size: 15px; 
                display: flex; 
                align-items: center; 
                gap: 8px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            ">
                <i class="fas fa-bullhorn" style="font-size: 14px; opacity: 0.9;"></i>
                Quer mais vagas?
            </span>
            <span style="
                font-weight: 500; 
                font-size: 13px; 
                opacity: 0.95;
                letter-spacing: 0.2px;
            ">
                Entre no nosso grupo do WhatsApp!
            </span>
        </div>

        <!-- Badge de notificação -->
        <div style="
            position: absolute;
            top: -4px;
            right: 45px;
            background: linear-gradient(135deg, #ff9f43 0%, #ff7f37 100%);
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounce 2s infinite;
            font-size: 10px;
            z-index: 3;
            box-shadow: 0 2px 8px rgba(255, 159, 67, 0.4);
            border: 2px solid white;
        ">
            <i class="fas fa-bell" style="font-size: 8px;"></i>
        </div>

        <!-- Efeito de brilho CONTAINER -->
        <div style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 50px;
            pointer-events: none;
            z-index: 1;
        ">
            <!-- Efeito de brilho REAL (agora contido) -->
            <div style="
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255,255,255,0.3), 
                    transparent
                );
                transition: left 0.7s ease;
            "></div>
        </div>
    </div>

    <!-- Botão X FORA do container principal -->
    <button id="close-wpp-btn" style="
        position: fixed;
        bottom: 82px;
        right: 22px;
        background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%);
        border: none; 
        color: white; 
        cursor: pointer;
        width: 34px; 
        height: 34px; 
        border-radius: 50%; 
        font-size: 13px;
        display: flex; 
        align-items: center; 
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
        z-index: 10000;
        border: 2px solid white;
    ">
        <i class="fas fa-times"></i>
    </button>

    <style>
        @keyframes floatUp {
            from { 
                opacity: 0; 
                transform: translateY(30px) scale(0.9); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-4px) scale(1.05); }
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }

        #whatsapp-button {
            animation: floatUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        #whatsapp-button:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 12px 30px rgba(37, 211, 102, 0.6);
        }

        #whatsapp-button:hover > div:last-child > div {
            left: 100%;
        }

        #close-wpp-btn:hover {
            background: linear-gradient(135deg, #ff3742 0%, #ff2a36 100%);
            transform: scale(1.15) rotate(90deg);
            box-shadow: 0 6px 15px rgba(255, 71, 87, 0.6);
            animation: shake 0.3s ease-in-out;
        }

        /* Responsividade melhorada */
        @media (max-width: 768px) {
            #whatsapp-button {
                bottom: 15px;
                right: 15px;
                left: 15px;
                max-width: calc(100vw - 30px);
                padding: 16px 18px;
                gap: 12px;
            }
            
            #whatsapp-button .fab.fa-whatsapp {
                font-size: 26px;
            }
            
            #close-wpp-btn {
                width: 32px;
                height: 32px;
                bottom: 47px;
                right: 27px;
            }
        }

        @media (max-width: 480px) {
            #whatsapp-button {
                padding: 14px 16px;
                font-size: 14px;
            }
            
            #whatsapp-button .fab.fa-whatsapp {
                font-size: 24px;
            }
            
            #close-wpp-btn {
                width: 30px;
                height: 30px;
                font-size: 12px;
                bottom: 44px;
                right: 25px;
            }
            
            #whatsapp-button span {
                font-size: 13px;
            }
            
            #whatsapp-button span:last-child {
                font-size: 12px;
            }
        }
    </style>`;

    // Inserir no DOM
    document.body.insertAdjacentHTML('beforeend', buttonHTML);
    console.log('✅ Botão criado com sucesso!');

    // Eventos
    const wppButton = document.getElementById('whatsapp-button');
    const closeBtn = document.getElementById('close-wpp-btn');
    const shineEffect = wppButton.querySelector('div:last-child > div');

    // Clicar no botão - abre WhatsApp
    wppButton.addEventListener('click', function(e) {
        if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
            window.open('https://chat.whatsapp.com/FQx4pF0aAkS7av9R5EAjTJ', '_blank');
        }
    });

    // Clicar no X - remove apenas nesta sessão
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Animação de saída
        closeBtn.style.transform = 'scale(0.8) rotate(45deg)';
        closeBtn.style.opacity = '0.7';
        wppButton.style.transform = 'scale(0.8) translateY(20px)';
        wppButton.style.opacity = '0';
        
        setTimeout(() => {
            wppButton.remove();
            closeBtn.remove();
            console.log('❌ Botão fechado (aparecerá novamente ao recarregar)');
        }, 400);
    });

    // Efeito de brilho no hover
    wppButton.addEventListener('mouseenter', function() {
        shineEffect.style.left = '100%';
    });
    
    wppButton.addEventListener('mouseleave', function() {
        shineEffect.style.left = '-100%';
    });
}

// Inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWhatsAppButton);
} else {
    setTimeout(createWhatsAppButton, 300);
}
/**
 * ============================================================================
 * PACIFIC FLOWERS - CONFIGURAÇÃO DOS 3 BOTÕES PRINCIPAIS (LINKS EXTERNOS/INTERNOS)
 * ============================================================================
 * Altere os links abaixo conforme os endereços das páginas de destino que você desejar!
 * Se o link começar com "http", ele abrirá automaticamente em uma nova aba (_blank).
 * Se o link começar com "#", ele fará uma rolagem suave para a seção da página.
 */
const LINKS_CONFIG = {
  // 1. BOTÃO "ENTRAR EM CONTATO"
  CONTATO_URL: "https://wa.me/5547996362387?text=Ol%C3%A1%2C%20gostaria%20de%20entrar%20em%20contato%20com%20a%20Pacific%20Flowers",

  // 2. BOTÃO "CONHECER O CATÁLOGO DE PRODUTOS"
  CATALOGO_URL: "https://catalogogeral.vercel.app/", 

  // 3. BOTÃO "FAZER UM PEDIDO"
  PEDIDO_URL: "https://catalogogeral.vercel.app/" 
};

// ============================================================================
// INICIALIZAÇÃO E APLICAÇÃO DOS LINKS NOS BOTÕES
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa ícones Lucide
  if (window.lucide) {
    lucide.createIcons();
  }

  // Atualiza ano no rodapé
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Aplica os links configurados em todos os botões correspondentes da página
  aplicarLinksConfigurados();

  // Inicializa funcionalidades interativas
  initMenuMobile();
  initFiltroCategorias();
  initFaqAccordion();
});

/**
 * Vincula a configuração dos 3 botões em todos os elementos da página com data-action
 */
function aplicarLinksConfigurados() {
  const actions = {
    contato: LINKS_CONFIG.CONTATO_URL,
    catalogo: LINKS_CONFIG.CATALOGO_URL,
    pedido: LINKS_CONFIG.PEDIDO_URL
  };

  Object.entries(actions).forEach(([actionKey, url]) => {
    if (!url) return;
    const buttons = document.querySelectorAll(`[data-action="${actionKey}"]`);
    buttons.forEach((btn) => {
      btn.setAttribute("href", url);
      if (url.startsWith("http")) {
        btn.setAttribute("target", "_blank");
        btn.setAttribute("rel", "noopener noreferrer");
      } else {
        btn.removeAttribute("target");
        btn.removeAttribute("rel");
      }

      // Meta Pixel Event Tracking
      btn.addEventListener('click', () => {
        if (typeof fbq === 'function') {
          if (actionKey === 'contato') {
            fbq('track', 'Contact');
          } else if (actionKey === 'pedido' || actionKey === 'catalogo') {
            fbq('track', 'InitiateCheckout');
          }
        }
      });
    });
  });
}

/**
 * Menu Mobile
 */
function initMenuMobile() {
  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isHidden = menu.classList.contains("hidden");
    if (isHidden) {
      menu.classList.remove("hidden");
    } else {
      menu.classList.add("hidden");
    }
  });

  // Fecha o menu ao clicar em um link interno
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });
}

/**
 * Filtro de Categorias no Catálogo de Produtos
 */
function initFiltroCategorias() {
  const tabButtons = document.querySelectorAll(".cat-tab");
  const cards = document.querySelectorAll(".product-card");

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetCategory = tab.getAttribute("data-cat");

      // Atualiza estado ativo das abas
      tabButtons.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Filtra os cards com animação suave
      cards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (targetCategory === "all" || cardCat === targetCategory) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.95)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

/**
 * Acordeão de FAQ
 */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const btn = item.querySelector(".faq-btn");
    const content = item.querySelector(".faq-content");

    if (!btn || !content) return;

    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Fecha os outros
      items.forEach((other) => {
        if (other !== item) {
          const otherBtn = other.querySelector(".faq-btn");
          const otherContent = other.querySelector(".faq-content");
          if (otherBtn && otherContent) {
            otherBtn.setAttribute("aria-expanded", "false");
            otherContent.classList.add("hidden");
          }
        }
      });

      // Alterna o atual
      if (isExpanded) {
        btn.setAttribute("aria-expanded", "false");
        content.classList.add("hidden");
      } else {
        btn.setAttribute("aria-expanded", "true");
        content.classList.remove("hidden");
      }
    });
  });
}

/**
 * Formulário de Contato Direto para WhatsApp
 */
window.handleFormSubmit = function (form) {
  const name = form.querySelector("#name")?.value || "";
  const phone = form.querySelector("#phone")?.value || "";
  const email = form.querySelector("#email")?.value || "";
  const interest = form.querySelector("#interest")?.selectedOptions[0]?.text || "";
  const message = form.querySelector("#message")?.value || "";

  const text = `*Novo Contato via Landing Page - Pacific Flowers*%0A%0A` +
    `👤 *Nome:* ${encodeURIComponent(name)}%0A` +
    `📱 *Telefone:* ${encodeURIComponent(phone)}%0A` +
    (email ? `✉️ *E-mail:* ${encodeURIComponent(email)}%0A` : "") +
    `🏷️ *Interesse:* ${encodeURIComponent(interest)}%0A` +
    (message ? `💬 *Mensagem:* ${encodeURIComponent(message)}%0A` : "");

  const whatsappUrl = `https://wa.me/5547996362387?text=${text}`;

  // Meta Pixel Event Tracking - Form Submit (Lead)
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {
      content_name: interest
    });
  }

  window.open(whatsappUrl, "_blank");
};

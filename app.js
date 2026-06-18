// Aplicação principal - Roteamento e inicialização
class App {
    constructor() {
        this.root = document.getElementById('root');
        this.setupListeners();
        this.setupHeaderListeners();
        this.setupFooterListeners();
    }

    render() {
        let pageContent = '';

        // Renderizar página apropriada
        switch (appState.currentPage) {
            case 'home':
                pageContent = Pages.renderHome();
                break;
            case 'products':
                pageContent = Pages.renderProducts();
                break;
            case 'product-detail':
                pageContent = Pages.renderProductDetail();
                break;
            case 'cart':
                pageContent = Pages.renderCart();
                break;
            case 'profile':
                pageContent = Pages.renderProfile();
                break;
            case 'tracking':
                pageContent = Pages.renderTracking();
                break;
            case 'favorites':
                pageContent = Pages.renderFavorites();
                break;
            case 'login':
                pageContent = Pages.renderLogin();
                break;
            case 'admin':
                pageContent = Pages.renderAdmin();
                break;
            case 'contact':
                pageContent = Pages.renderContact();
                break;
            case 'policy':
                pageContent = Pages.renderPolicy();
                break;
            default:
                pageContent = Pages.renderHome();
        }

        // Renderizar HTML
        this.root.innerHTML = pageContent;

        // Atualizar header fixo
        this.updateHeader();

        // Scroll ao mudar de página
        if (appState.pageChanged) {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            appState.pageChanged = false;
        }

        // Anexar event listeners após render
        this.attachEventListeners();
    }

    setupListeners() {
        // Listener do estado global
        appState.subscribe(() => this.render());
    }

    updateHeader() {
        const cartBadge = document.getElementById('cartBadge');
        const favoriteBadge = document.getElementById('favoriteBadge');
        if (cartBadge) cartBadge.textContent = appState.getCartCount();
        if (favoriteBadge) favoriteBadge.textContent = appState.favorites.length;

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = appState.searchQuery || '';
        }

        const navCategories = document.getElementById('navCategories');
        if (navCategories) {
            navCategories.innerHTML = CATEGORIAS.map(cat => `
                <button class="nav-link category-filter ${appState.selectedCategory === cat.nome ? 'active' : ''}" data-category="${cat.nome}">
                    ${cat.nome}
                </button>
            `).join('');

            navCategories.querySelectorAll('.category-filter').forEach(filter => {
                filter.addEventListener('click', () => {
                    const category = filter.getAttribute('data-category');
                    const isActive = filter.classList.contains('active');

                    navCategories.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));

                    if (!isActive) {
                        filter.classList.add('active');
                        appState.setSearchQuery('');
                        appState.setSelectedCategory(category);
                        appState.setPage('products');
                    } else {
                        appState.setSelectedCategory(null);
                        appState.setPage('home');
                    }
                });
            });
        }
    }

    setupHeaderListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchIconBtn = document.getElementById('searchIconBtn');

        if (searchInput) {
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    appState.searchQuery = e.target.value.toLowerCase();
                    appState.setPage('products');
                }
            });
        }

        if (searchIconBtn && searchInput) {
            searchIconBtn.addEventListener('click', () => {
                appState.searchQuery = searchInput.value.toLowerCase();
                appState.setPage('products');
            });
        }

        const logoBtn = document.getElementById('logoBtn');
        if (logoBtn) {
            logoBtn.addEventListener('click', () => {
                appState.setSelectedCategory(null);
                appState.setSearchQuery('');
                appState.setPage('home');
            });
        }

        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', async () => {
                if (appState.user) {
                    try {
                        const res = await fetch(`/api/compras/${appState.user.id}`);
                        if (res.ok) {
                            appState.user.compras = await res.json();
                        }
                    } catch (e) {
                        console.error('Erro ao carregar compras', e);
                    }
                    appState.setPage('profile');
                } else {
                    appState.setPage('login');
                }
            });
        }

        const favoriteBtn = document.getElementById('favoriteBtn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                appState.setPage('favorites');
            });
        }

        const trackLink = document.getElementById('trackLink');
        if (trackLink) {
            trackLink.addEventListener('click', (e) => {
                e.preventDefault();
                appState.setPage('tracking');
            });
        }
//
        const trackLinkMobile = document.getElementById('trackLinkMobile');
        if (trackLinkMobile) {
            trackLinkMobile.addEventListener('click', () => {
                appState.setPage('tracking');
            });
        }

        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                appState.setPage('cart');
            });
        }
    }

    setupFooterListeners() {
        document.querySelectorAll('.footer-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                appState.setPage(page);
            });
        });
    }

    attachEventListeners() {
        // A busca e a navegação do header são configuradas uma vez em setupHeaderListeners().

        // Filtro de categorias
        const categoryFilters = this.root.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-category');
                const isActive = filter.classList.contains('active');
                
                this.root.querySelectorAll('.category-filter').forEach(f => f.classList.remove('active'));
                
                if (!isActive) {
                    filter.classList.add('active');
                    appState.setSearchQuery('');
                    appState.setSelectedCategory(category);
                    appState.setPage('products');
                } else {
                    appState.setSelectedCategory(null);
                    appState.setPage('home');
                }
            });
        });

        // O clique no logo é tratado no header fixo, não dentro do root.
        
        const explorarBtn = this.root.querySelector('#explorarBtn');
        if (explorarBtn) {
        explorarBtn.addEventListener('click', () => {
        appState.searchQuery = ''; // limpa qualquer busca ativa
        appState.setSelectedCategory(null); // sem filtro de categoria
        appState.setPage('products'); // vai para a página de produtos
           });
        }

        // Eventos do header fixo são tratados em setupHeaderListeners().

        // Promo banners clicáveis
        const promoBanners = this.root.querySelectorAll('.promo-banner');
        promoBanners.forEach(banner => {
            banner.addEventListener('click', () => {
                const category = banner.getAttribute('data-category');
                if (category) {
                    appState.setSearchQuery('');
                    appState.setSelectedCategory(category);
                    appState.setPage('products');
                }
            });
        });

        // Banner do carrossel clicável
        const carouselSlides = this.root.querySelectorAll('.carousel-slide');
        carouselSlides.forEach(slide => {
            slide.addEventListener('click', () => {
                const category = slide.getAttribute('data-category');
                if (category) {
                    appState.setSearchQuery('');
                    appState.setSelectedCategory(category);
                    appState.setPage('products');
                }
            });
        });

        // Página de rastreamento - atualizar linha do tempo
        const trackingBtn = this.root.querySelector('#trackingBtn');
        const trackingInput = this.root.querySelector('#trackingCodeInput');
        const trackingResults = this.root.querySelector('#trackingResults');
        if (trackingBtn && trackingInput && trackingResults) {
            const updateTracking = () => {
                const code = trackingInput.value.trim();
                if (!code) {
                    trackingResults.innerHTML = '<p>Insira um código para acompanhar o andamento do seu pedido.</p>';
                    return;
                }
                const steps = Pages.generateTrackingSteps(code);
                trackingResults.innerHTML = Pages.createTrackingTimeline(steps);
            };

            trackingBtn.addEventListener('click', updateTracking);
            trackingInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    updateTracking();
                }
            });
        }

        // O botão do carrinho é tratado em setupHeaderListeners().

        // Clique em produto
        const productImages = this.root.querySelectorAll('.product-img');
        productImages.forEach(img => {
            img.addEventListener('click', () => {
                const productId = parseInt(img.getAttribute('data-product-id'));
                const product = PRODUCTS.find(p => p.id === productId);
                if (product) {
                    appState.setPage('product-detail', product);
                }
            });
        });

        // Favoritar
        const favoriteBtns = this.root.querySelectorAll('.favorite-btn');
        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                appState.toggleFavorite(productId);
            });
        });

        // Adicionar ao carrinho
        const addCartBtns = this.root.querySelectorAll('.add-cart-btn, .add-to-cart');
        addCartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(btn.getAttribute('data-product-id'));
                const product = PRODUCTS.find(p => p.id === productId);
                if (product) {
                    appState.addToCart(product);
                    this.showNotification('Adicionado ao carrinho!');
                }
            });
        });

        // Remover favorito na página de favoritos
        const removeFavoriteBtns = this.root.querySelectorAll('.remove-favorite');
        removeFavoriteBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                appState.removeFavorite(productId);
                this.showNotification('Produto removido dos favoritos');
            });
        });

        // Carrinho: Aumentar quantidade
        const increaseQtyBtns = this.root.querySelectorAll('.increase-qty');
        increaseQtyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                const item = appState.cart.find(item => item.id === productId);
                if (item) {
                    appState.updateCartQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Carrinho: Diminuir quantidade
        const decreaseQtyBtns = this.root.querySelectorAll('.decrease-qty');
        decreaseQtyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                const item = appState.cart.find(item => item.id === productId);
                if (item && item.quantity > 1) {
                    appState.updateCartQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Carrinho: Remover item
        const removeBtns = this.root.querySelectorAll('.remove-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = parseInt(btn.getAttribute('data-product-id'));
                appState.removeFromCart(productId);
                this.showNotification('Produto removido!');
            });
        });

        // Galeria de imagens na página de detalhes
        const thumbnails = this.root.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const mainImage = this.root.querySelector('#mainImage');
                if (mainImage) {
                    mainImage.src = thumb.getAttribute('data-image');
                }
            });
        });

        // Carousel do Hero
        this.initCarousel();

        // Countdown timer
        this.initCountdown();

        // Abas de tendências
        this.initTabs();
    }

    initCarousel() {
        const slides = this.root.querySelectorAll('.carousel-slide');
        const indicators = this.root.querySelectorAll('.carousel-indicators .indicator');
        const prevBtn = this.root.querySelector('#prevSlide');
        const nextBtn = this.root.querySelector('#nextSlide');

        // Retorna se não há slides (por exemplo, em outras páginas)
        if (slides.length === 0) return;

        let currentSlide = 0;

        const showSlide = (n) => {
            if (slides.length === 0) return;
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(ind => ind.classList.remove('active'));
            
            if (slides[n]) slides[n].classList.add('active');
            if (indicators[n]) indicators[n].classList.add('active');
        };

        const nextSlide = () => {
            if (slides.length === 0) return;
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            if (slides.length === 0) return;
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Auto-play a cada 5 segundos (só se houver slides)
        if (slides.length > 0) {
            setInterval(() => {
                if (slides.length > 0) nextSlide();
            }, 5000);
        }

        // Indicadores clicáveis
        indicators.forEach((ind, index) => {
            ind.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
    }

    initCountdown() {
        const timer = this.root.querySelector('#countdownTimer');
        if (!timer) return;

        const target = parseInt(timer.getAttribute('data-target'));

        const updateTimer = () => {
            const now = new Date().getTime();
            const diff = target - now;

            if (diff > 0) {
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                const hoursEl = timer.querySelector('#hours');
                const minutesEl = timer.querySelector('#minutes');
                const secondsEl = timer.querySelector('#seconds');

                if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
                if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
                if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
            }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    initTabs() {
        const tabBtns = this.root.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tab = btn.getAttribute('data-tab');
                let filtered = PRODUCTS;

                switch(tab) {
                    case 'newest':
                        filtered = PRODUCTS.slice(2, 10);
                        break;
                    case 'featured':
                        filtered = PRODUCTS.filter(p => p.desconto > 35);
                        break;
                    default:
                        filtered = PRODUCTS.slice(0, 8);
                }

                const grid = this.root.querySelector('#trendsGrid');
                if (grid) {
                    grid.innerHTML = filtered.map(p => Components.createProductCard(p)).join('');
                    this.attachEventListeners();
                }
            });
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

async function handleAdminCreateProduct(e) {
    e.preventDefault();
    
    // O FormData captura todos os campos automaticamente, incluindo o arquivo de imagem!
    const formData = new FormData(e.target);
    
    try {
        const res = await fetch('/api/produtos', {
            method: 'POST',
            // Atenção: Quando enviamos arquivos, NÃO colocamos o headers de 'Content-Type'. 
            // O próprio navegador faz isso automaticamente agora.
            body: formData 
        });
        
        if (res.ok) {
            alert('Produto criado com sucesso!');
            await fetchProducts(); // recarrega a lista do banco
            appState.setPage('admin'); // re-renderiza a tela limpa
        } else {
            alert('Erro ao criar produto.');
        }
    } catch(err) {
        console.error(err);
    }
}

async function handleAdminDeleteProduct(id) {
    if (!confirm('Deseja realmente deletar este produto?')) return;
    try {
        const res = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert('Produto deletado.');
            await fetchProducts();
            appState.setPage('admin');
        }
    } catch(err) {
        console.error(err);
    }
}

// ====== NOVAS FUNÇÕES DE EDIÇÃO ======

// 1. Função para abrir a janelinha com os dados preenchidos
function openEditForm(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    // Preenche os campos do formulário invisível com os dados do produto
    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-nome').value = product.nome;
    document.getElementById('edit-categoria').value = product.categoria;
    document.getElementById('edit-preco').value = product.preco;
    document.getElementById('edit-estoque').value = product.estoque;
    document.getElementById('edit-imagem_url').value = product.imagens ? product.imagens[0] : product.imagem_url || '';
    document.getElementById('edit-descricao').value = product.descricao || '';

    // Faz a janelinha aparecer na tela
    document.getElementById('editProductModal').style.display = 'flex';
}

// 2. Função para fechar a janelinha
function closeEditForm() {
    document.getElementById('editProductModal').style.display = 'none';
}

// 3. Função que manda os dados atualizados para o Banco de Dados
async function handleAdminUpdateProduct(e) {
    e.preventDefault(); // Impede a página de recarregar
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const id = data.id; // Pega o ID escondido
    delete data.id; // Tira o ID dos dados para não dar erro no banco
    
    // Converte os textos para números
    data.preco = parseFloat(data.preco) || 0;
    data.estoque = parseInt(data.estoque) || 0;
    
    try {
        // Manda o comando PUT (Atualizar) para o servidor
        const res = await fetch(`/api/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (res.ok) {
            alert('Produto atualizado com sucesso!');
            closeEditForm(); // Fecha a janela
            await fetchProducts(); // Baixa os produtos novos do banco
            appState.setPage('admin'); // Atualiza a tela automaticamente
        } else {
            alert('Erro ao atualizar produto.');
        }
    } catch(err) {
        console.error(err);
        alert('Erro de conexão com o servidor.');
    }
}

// Lógica de Auth
async function handleLoginSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (res.ok) {
            appState.login(resData);
            
            // Mostra o toast primeiro
            showToast('Login Sucedido!');
            
            // Espera 1.5 segundos para mudar de página suavemente
            setTimeout(() => {
                appState.setPage('home');
                render();
            }, 1500);

        } else {
            alert(resData.error || 'Erro ao fazer login');
        }
    } catch(err) {
        console.error(err);
        alert('Erro de conexão com o servidor!\n\nVerifique se você está acessando o site pelo endereço:\nhttp://localhost:3000\n\n(Não abra o arquivo index.html diretamente pelo explorador de arquivos!)');
    }
}

async function handleRegisterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const resData = await res.json();
        if (res.ok) {
            appState.login(resData);
            
            // Mostra o toast primeiro
            showToast('Registro Sucedido!');
            
            // Espera 1.5 segundos para mudar de página suavemente
            setTimeout(() => {
                appState.setPage('home');
                render();
            }, 1500);

        } else {
            alert(resData.error || 'Erro ao registrar');
        }
    } catch(err) {
        console.error(err);
        alert('Erro de conexão com o servidor!\n\nVerifique se você está acessando o site pelo endereço:\nhttp://localhost:3000\n\n(Não abra o arquivo index.html diretamente pelo explorador de arquivos!)');
    }
}

// Instância global da app
let app;

// Função de render global
function render() {
    if (!app) {
        app = new App();
    }
    app.render();
}

async function handleCheckout() {
    if (!appState.user) {
        alert('Você precisa estar logado para finalizar a compra.');
        appState.setPage('login');
        return;
    }
    if (appState.cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    const payload = {
        usuario_id: appState.user.id,
        itens: appState.cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            preco: item.preco
        })),
        total: appState.getCartTotal() > 300 ? appState.getCartTotal() : appState.getCartTotal() + 29.90
    };

    try {
        const res = await fetch('/api/compras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert('Compra finalizada com sucesso!');
            appState.clearCart();
            // Atualiza produtos (estoque foi alterado)
            await fetchProducts();
            // Vai para o perfil ver a compra
            const resCompras = await fetch(`/api/compras/${appState.user.id}`);
            if (resCompras.ok) appState.user.compras = await resCompras.json();
            appState.setPage('profile');
        } else {
            alert('Erro ao finalizar compra.');
        }
    } catch(err) {
        console.error(err);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts(); // Busca os produtos da API
    render();
});

// Função para mostrar notificações na tela
function showToast(message) {
    // Cria a caixinha
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerText = message;
    
    // Coloca na tela
    document.body.appendChild(toast);

    // Depois de 1.5 segundos, começa a sumir
    setTimeout(() => {
        toast.classList.add('fade-out');
        // Depois da animação de sumir terminar, remove o elemento do código
        setTimeout(() => toast.remove(), 500);
    }, 1500);
}
// Componentes reutilizáveis
class Components {
    // Product Card
    static createProductCard(product) {
        const isFavorite = appState.isFavorite(product.id);
        
        // PROTEÇÃO 1: Imagens
        const imageUrl = product.imagem_url || (product.imagens && product.imagens.length > 0 ? product.imagens[0] : 'https://via.placeholder.com/150');
        
        // PROTEÇÃO 2: Converte os preços para Número (caso o banco de dados mande como Texto)
        const precoAtual = parseFloat(product.preco) || 0;
        let precoOriginal = parseFloat(product.precoOriginal);
        
        // Se não tiver preço original válido ou for menor que o atual, iguala ao atual
        if (isNaN(precoOriginal) || precoOriginal < precoAtual) {
            precoOriginal = precoAtual;
        }
        
        const discount = precoOriginal > precoAtual ? Math.round(((precoOriginal - precoAtual) / precoOriginal) * 100) : 0;
        
        // NOVO CÁLCULO: Porcentagem de estoque fixa baseada no ID do produto
        const idSemente = typeof product.id === 'string' ? product.id.charCodeAt(0) : (product.id || 1);
        const vendidoPercent = (idSemente * 47) % 50 + 35; // Gera sempre um valor fixo entre 35% e 84%

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.nome}" class="product-img" data-product-id="${product.id}">
                    ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                        <i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>
                    </button>
                    <div class="sold-bar">
                        <div class="sold-fill" style="width: ${vendidoPercent}%"></div>
                        <span class="sold-text">${vendidoPercent}% vendido</span>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.nome}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${'★'.repeat(Math.floor(product.avaliacao || 5))}${'☆'.repeat(5 - Math.floor(product.avaliacao || 5))}
                        </div>
                        <span class="rating-count">${product.totalAvaliacoes || 0}</span>
                    </div>
                    <div class="product-price">
                        ${discount > 0 ? `<span class="original-price">R$ ${precoOriginal.toFixed(2)}</span>` : ''}
                        <span class="current-price">R$ ${precoAtual.toFixed(2)}</span>
                    </div>
                    <button class="add-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
    }
    // Hero Carousel
    static createHeroCarousel() {
        return `
            <section class="hero-carousel">
                <div class="carousel-container">
                    <div class="carousel-slides" id="carouselSlides">
                        ${HERO_BANNERS.map((banner, index) => `
                            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-slide="${index}" data-category="${banner.category}">
                                <img src="${banner.image}" alt="${banner.title}" class="carousel-image">
                            </div>
                        `).join('')}
                    </div>

                    <button class="carousel-nav prev" id="prevSlide"><i class="fas fa-chevron-left"></i></button>
                    <button class="carousel-nav next" id="nextSlide"><i class="fas fa-chevron-right"></i></button>

                    <div class="carousel-indicators">
                        ${HERO_BANNERS.map((_, index) => `
                            <button class="indicator ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    // Category Strip
    static createCategoryStrip() {
        return `
            <section class="category-strip">
                <div class="container">
                    <div class="categories-scroll">
                        ${CATEGORIAS.map(cat => `
                            <div class="category-item category-filter" data-category="${cat.nome}">
                                <div class="category-icon">
                                    <i class="fas ${cat.icon}"></i>
                                </div>
                                <p>${cat.nome}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

   // Promotional Banners
static createPromotionalBanners() {
    return `
        <section class="promotional-section">
            <div class="container">
                <div class="banners-grid">
                    ${PROMOTIONAL_BANNERS.map(banner => `
                        <div class="promo-banner" data-category="${banner.category}">
                            <img src="${banner.image}" alt="Promoção">
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}
    // Countdown Timer
    static createCountdownTimer() {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        tomorrow.setHours(0, 0, 0, 0);

        return `
            <div class="countdown-timer" id="countdownTimer" data-target="${tomorrow.getTime()}">
                <span>Termina em:</span>
                <div class="timer-display">
                    <span class="timer-part" id="hours">00</span>:
                    <span class="timer-part" id="minutes">00</span>:
                    <span class="timer-part" id="seconds">00</span>
                </div>
            </div>
        `;
    }

    // Daily Offers Section
    static createDailyOffers() {
        // Sorteia um número aleatório baseado na quantidade total de produtos
        const randomIndex = Math.floor(Math.random() * PRODUCTS.length);
        // Pega o produto correspondente a esse número
        const randomProduct = PRODUCTS[randomIndex];
        
        // Se a lista de produtos estiver vazia por algum motivo, não quebra a página
        const productHtml = randomProduct ? this.createProductCard(randomProduct) : '';

        return `
            <section class="daily-offers">
                <div class="container">
                    <div class="section-header">
                        <h2>Ofertas de Hoje</h2>
                        ${this.createCountdownTimer()}
                    </div>
                    <div class="offers-scroll" id="offersScroll">
                        ${productHtml}
                    </div>
                </div>
            </section>
        `;
    }

    // Trends Section
    static createTrendsSection() {
        return `
            <section class="trends-section">
                <div class="container">
                    <div class="section-header">
                        <h2>Tendências da Semana</h2>
                        <div class="tabs">
                            <button class="tab-btn active" data-tab="bestsellers">Mais Vendidos</button>
                            <button class="tab-btn" data-tab="newest">Novidades</button>
                            <button class="tab-btn" data-tab="featured">Em Destaque</button>
                        </div>
                    </div>

                    <div class="products-grid" id="trendsGrid">
                        ${PRODUCTS.slice(0, 8).map(product => this.createProductCard(product)).join('')}
                    </div>
                </div>
            </section>
        `;
    }

   static createHighlightSection() {
    const featuredProducts = PRODUCTS.slice(0, 3);

    return `
        <section class="highlight-section">
            <div class="container">
                <div class="highlight-banner">
                    <video class="highlight-video" autoplay muted loop playsinline>
                        <source src="imagens/video.mp4" type="video/mp4">
                    </video>
                    <div class="highlight-text">
                        <h2>Tecnologia que<br>Transforma</h2>
                        <p>Descobra os melhores produtos para seu estilo de vida</p>
                        <button class="btn btn-explorar" id="explorarBtn">Explorar</button>
                    </div>
                </div>
                <div class="highlight-products">
                    ${featuredProducts.map(product => this.createProductCard(product)).join('')}
                </div>
            </div>
        </section>
    `;
}

    // Bottom Banner
    static createBottomBanner() {
        return `
            <section class="bottom-banner">
                <div class="container">
                    <div class="banner-content">
                        <h2>Até 30% OFF</h2>
                        <p>Desconto imediato em produtos selecionados</p>
                        <button class="btn btn-primary">Ver mais</button>
                    </div>
                </div>
            </section>
        `;
    }

    // Cart Item
    static createCartItem(item) {
        // PROTEÇÃO 3: Mesma proteção de imagem e conversão de preço para o carrinho
        const imageUrl = item.imagem_url || (item.imagens && item.imagens.length > 0 ? item.imagens[0] : 'https://via.placeholder.com/150');
        const precoAtual = parseFloat(item.preco) || 0;
        const quantidade = parseInt(item.quantity) || 1;

        return `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${imageUrl}" alt="${item.nome}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="cart-item-price">R$ ${precoAtual.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn decrease-qty" data-product-id="${item.id}">-</button>
                    <input type="number" value="${quantidade}" readonly class="qty-input">
                    <button class="qty-btn increase-qty" data-product-id="${item.id}">+</button>
                </div>
                <div class="cart-item-total">R$ ${(precoAtual * quantidade).toFixed(2)}</div>
                <button class="remove-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }
    
    // Stars Rating
    static createStarRating(rating) {
        return `
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(star => `
                    <span class="star ${star <= rating ? 'filled' : ''}">★</span>
                `).join('')}
            </div>
        `;
    }
}

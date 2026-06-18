// Páginas da aplicação
class Pages {
    // Página inicial
    static renderHome() {
        return `
            <main class="main-content">
                ${Components.createHeroCarousel()}
                ${Components.createPromotionalBanners()}
                ${Components.createDailyOffers()}
                ${Components.createHighlightSection()}
                ${Components.createTrendsSection()}
            </main>
        `;
    }

    // Página de listagem de produtos
    static renderProducts() {
        const filteredProducts = appState.getFilteredProducts();

        if (filteredProducts.length === 0) {
            return `
                <main class="main-content">
                    <div class="container">
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <h2>Nenhum produto encontrado</h2>
                            <p>Tente ajustar seus filtros ou buscar por outro termo</p>
                            <button class="btn btn-primary" onclick="appState.setPage('home'); render();">
                                Voltar à Home
                            </button>
                        </div>
                    </div>
                </main>
            `;
        }

        return `
            <main class="main-content">
                <div class="container">
                    <div class="products-header">
                        <h1>Produtos</h1>
                        <p>${filteredProducts.length} produtos encontrados</p>
                    </div>
                    <div class="products-grid">
                        ${filteredProducts.map(product => Components.createProductCard(product)).join('')}
                    </div>
                </div>
            </main>
        `;
    }

    static renderFavorites() {
        const favorites = appState.favorites.map(id => PRODUCTS.find(product => product.id === id)).filter(Boolean);

        if (favorites.length === 0) {
            return `
                <main class="main-content favorites-page">
                    <div class="container">
                        <div class="empty-state">
                            <i class="fas fa-heart"></i>
                            <h2>Você ainda não possui produtos favoritados.</h2>
                            <p>Salve seus produtos favoritos para encontrá-los facilmente depois.</p>
                            <button class="btn btn-primary" onclick="appState.setPage('home'); render();">
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </main>
            `;
        }

        return `
            <main class="main-content favorites-page">
                <div class="container">
                    <div class="page-header">
                        <div>
                            <h1>Favoritos</h1>
                            <p>${favorites.length} produto${favorites.length > 1 ? 's' : ''} favoritado${favorites.length > 1 ? 's' : ''}</p>
                        </div>
                        <button class="btn btn-outline" onclick="appState.setPage('home'); render();">
                            Voltar à loja
                        </button>
                    </div>
                    <div class="favorites-grid">
                        ${favorites.map(product => {
            // Forçando a conversão dos preços para número antes de usar o toFixed
            const preco = Number(product.preco) || 0;
            const precoOriginal = Number(product.precoOriginal) || 0;

            return `
                            <div class="favorite-card" data-product-id="${product.id}">
                                <img src="${product.imagem_url || (product.imagens && product.imagens[0]) || ''}" alt="${product.nome}">
                                <div class="favorite-info">
                                    <h3>${product.nome}</h3>
                                    <div class="favorite-prices">
                                        <span class="current-price">R$ ${preco.toFixed(2)}</span>
                                        ${precoOriginal > preco ? `<span class="original-price">R$ ${precoOriginal.toFixed(2)}</span>` : ''}
                                    </div>
                                    ${precoOriginal > preco ? `<span class="discount-text">${Math.round(((precoOriginal - preco) / precoOriginal) * 100)}% OFF</span>` : ''}
                                </div>
                                <div class="favorite-actions">
                                    <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">Adicionar ao carrinho</button>
                                    <button class="btn btn-outline remove-favorite" data-product-id="${product.id}">Remover</button>
                                </div>
                            </div>
                        `}).join('')}
                    </div>
                </div>
            </main>
        `;
    }

    // Página de detalhes do produto
    static renderProductDetail() {
        const product = appState.selectedProduct;
        if (!product) return '';

        const isFavorite = appState.isFavorite(product.id);
        const discount = Math.round(((product.precoOriginal - product.preco) / product.precoOriginal) * 100);
        const pixDiscount = (product.preco * 0.1).toFixed(2);
        const installmentPrice = (product.preco / 12).toFixed(2);

        return `
            <main class="product-detail">
                <div class="container">
                    <div class="product-detail-grid">
                        <div class="product-gallery">
                            <div class="main-image">
                                <img id="mainImage" src="${product.imagem_url || (product.imagens && product.imagens[0]) || ''}" alt="${product.nome}">
                                <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                                    <i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>
                                </button>
                            </div>
                            <div class="thumbnails">
                                ${product.imagens ? product.imagens.map((img, idx) => `
                                    <img src="${img}" alt="Thumb ${idx}" class="thumbnail" data-image="${img}">
                                `).join('') : `
                                    <img src="${product.imagem_url || ''}" alt="Thumb 1" class="thumbnail" data-image="${product.imagem_url || ''}">
                                `}
                            </div>
                        </div>

                        <div class="product-details">
                            <div class="product-header">
                                <h1>${product.nome}</h1>
                                <div class="product-meta">
                                    <div class="rating">
                                        ${Components.createStarRating(product.avaliacao)}
                                        <span class="rating-text">${product.avaliacao} (${product.totalAvaliacoes} avaliações)</span>
                                    </div>
                                </div>
                            </div>

                            <div class="product-variants">
                                <div class="variant-group">
                                    <label>Voltagem:</label>
                                    <div class="variant-options">
                                        <button class="variant-btn active">110V</button>
                                        <button class="variant-btn">220V</button>
                                    </div>
                                </div>
                            </div>

                            <div class="product-description">
                                <h3>Descrição do Produto</h3>
                                <p>${product.descricao}</p>
                            </div>

                            <div class="product-specs">
                                <h3>Ficha Técnica</h3>
                                <table class="specs-table">
                                    ${product.fichaTecnica ? Object.entries(product.fichaTecnica).map(([key, value]) => `
                                        <tr>
                                            <td class="spec-key">${key}</td>
                                            <td class="spec-value">${value}</td>
                                        </tr>
                                    `).join('') : ''}
                                </table>
                            </div>

                            <div class="seller-info">
                                <h3>Vendido por</h3>
                                <div class="seller-card">
                                    <div class="seller-header">
                                        <h4>${product.vendedor}</h4>
                                        <span class="seller-rating">★ ${product.vendedorAvaliacao}</span>
                                    </div>
                                    <p>Vendedor há 2 anos | +${product.estoque * 10} vendas</p>
                                    <button class="btn btn-outline">Falar com lojista</button>
                                </div>
                            </div>
                        </div>

                        <div class="product-sidebar">
                            <div class="price-section">
                                <span class="original-price">R$ ${product.precoOriginal ? product.precoOriginal.toFixed(2) : product.preco.toFixed(2)}</span>
                                <div class="current-price">R$ ${product.preco.toFixed(2)}</div>
                                ${discount > 0 ? `<span class="discount-text">${discount}% de desconto</span>` : ''}
                            </div>

                            <div class="pix-badge">
                                <i class="fas fa-check-circle"></i>
                                <span>10% OFF no PIX</span>
                            </div>

                            <div class="installment-info">
                                <p>ou <strong>12x de R$ ${installmentPrice}</strong> sem juros</p>
                                <a href="#">Ver opções de pagamento</a>
                            </div>

                            <div class="cep-section">
                                <label>Calcular frete:</label>
                                <div class="cep-input-group">
                                    <input type="text" placeholder="00000-000" class="cep-input">
                                    <button class="btn btn-secondary">Calcular</button>
                                </div>
                            </div>

                            <div class="action-buttons">
                                <button class="btn btn-primary btn-large add-to-cart" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Adicionar à sacola
                                </button>
                                <button class="btn btn-outline btn-large">
                                    <i class="fas fa-bolt"></i> Comprar agora
                                </button>
                            </div>

                            <div class="store-metrics">
                                <div class="metric">
                                    <i class="fas fa-check"></i>
                                    <p>Entrega no prazo</p>
                                </div>
                                <div class="metric">
                                    <i class="fas fa-headset"></i>
                                    <p>Atendimento rápido</p>
                                </div>
                                <div class="metric">
                                    <i class="fas fa-star"></i>
                                    <p>Avaliação 4.9★</p>
                                </div>
                            </div>

                            <button class="btn btn-outline btn-full btn-follow-store">
                                <i class="far fa-heart"></i> Seguir loja
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    // Página do carrinho
    static renderCart() {
        const cart = appState.cart;
        const total = appState.getCartTotal();
        const freight = total > 300 ? 0 : 29.90;
        const finalTotal = total + freight;

        if (cart.length === 0) {
            return `
                <main class="main-content">
                    <div class="container">
                        <div class="empty-cart">
                            <i class="fas fa-shopping-cart"></i>
                            <h2>Seu carrinho está vazio</h2>
                            <p>Adicione produtos para começar</p>
                            <button class="btn btn-primary" onclick="appState.setPage('home'); render();">
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </main>
            `;
        }

        return `
            <main class="main-content">
                <div class="container">
                    <h1 class="cart-title">Meu Carrinho</h1>
                    <div class="cart-layout">
                        <div class="cart-items">
                            ${cart.map(item => Components.createCartItem(item)).join('')}
                        </div>

                        <div class="cart-summary">
                            <h2>Resumo do Pedido</h2>
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span>R$ ${total.toFixed(2)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Frete</span>
                                <span>${freight === 0 ? 'Grátis' : 'R$ ' + freight.toFixed(2)}</span>
                            </div>
                            <div class="summary-row discount">
                                <span>Desconto</span>
                                <span>R$ 0,00</span>
                            </div>
                            <div class="summary-divider"></div>
                            <div class="summary-total">
                                <span>Total</span>
                                <span>R$ ${finalTotal.toFixed(2)}</span>
                            </div>

                            <button class="btn btn-primary btn-large btn-checkout" onclick="handleCheckout()">
                                <i class="fas fa-lock"></i> Finalizar compra
                            </button>
                            <button class="btn btn-outline btn-large" onclick="appState.setPage('home'); render();">
                                Continuar comprando
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    static renderProfile() {
        if (appState.user && appState.user.is_admin) {
            return `
                <main class="main-content profile-page">
                    <div class="container" style="text-align: center; padding: 80px 20px;">
                        <i class="fas fa-user-shield" style="font-size: 4rem; color: #185FA5; margin-bottom: 20px;"></i>
                        <h2>Olá, Administrador!</h2>
                        <p style="color: #666; margin-bottom: 40px;">Bem-vindo à sua conta de gerenciamento da ShopBR. Escolha uma ação abaixo:</p>
                        
                        <div style="display: flex; gap: 20px; justify-content: center;">
                            <button class="btn btn-primary" style="font-size: 1.1rem; padding: 15px 30px;" onclick="appState.setPage('admin'); render();">
                                <i class="fas fa-cogs"></i> Acessar Painel de Administração
                            </button>
                            
                            <button class="btn btn-outline" style="font-size: 1.1rem; padding: 15px 30px; color: #dc3545; border-color: #dc3545;" onclick="showToast('Saindo da Conta...'); setTimeout(() => { appState.logout(); appState.setPage('home'); render(); }, 1500);">
                                <i class="fas fa-sign-out-alt"></i> Sair da Conta
                            </button>
                        </div>
                    </div>
                </main>
            `;
        }

        const user = appState.user;
        if (!user) {
            appState.setPage('login');
            return '';
        }

        // As compras devem ser carregadas (para simplicidade, usaremos um mock vazio por enquanto se não tiver)
        const orders = user.compras || [];

        return `
            <main class="main-content profile-page">
                <div class="container profile-layout">
                    <aside class="profile-sidebar">
                        <div class="user-card">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=random" alt="${user.nome}" class="avatar">
                            <h2>${user.nome}</h2>
                            <p>${user.email}</p>
                        </div>
                        <nav class="profile-menu">
    ${appState.user && appState.user.is_admin ? '<button class="menu-item" onclick="appState.setPage(\'admin\'); render();">Painel Admin</button>' : ''}
    
    <button class="menu-item logout" onclick="showToast('Saindo da Conta...'); setTimeout(() => { appState.logout(); appState.setPage('home'); render(); }, 1500);">Sair</button>
</nav>
                    </aside>

                    <section class="profile-main">
                        <div class="profile-header">
                            <button class="btn btn-outline" onclick="appState.setPage('home'); render();">
                                <i class="fas fa-arrow-left"></i> Voltar à loja
                            </button>
                            <h1>Meu Perfil</h1>
                        </div>

                        <div class="profile-section">
                            <div class="section-title">
                                <h2>Dados pessoais</h2>
                            </div>
                            <div class="profile-form">
                                <label>Nome</label>
                                <input type="text" value="${user.nome}" />
                                <label>E-mail</label>
                                <input type="email" value="${user.email}" />
                                <label>Telefone</label>
                                <input type="text" value="${user.telefone}" />
                                <label>Endereço</label>
                                <input type="text" value="${user.endereco}" />
                            </div>
                        </div>

                        <div class="profile-section">
                            <div class="section-title">
                                <h2>Últimos pedidos</h2>
                            </div>
                            <div class="orders-list">
                                ${orders.length === 0 ? '<p>Você ainda não possui pedidos.</p>' : ''}
                                ${orders.map(order => `
                                    <div class="order-item">
                                        <div class="order-item-row">
                                            <div class="order-item-left">
                                                <span class="order-code">Pedido #${order.id}</span>
                                                <h3 class="order-total">Total: R$ ${Number(order.total).toFixed(2)}</h3>
                                                ${order.itens && order.itens.map(item => `
                                                    <div class="order-item-product">
                                                        <img src="${item.imagem_url}" class="order-item-img">
                                                        <small>${item.quantidade}x ${item.nome}</small>
                                                    </div>
                                                `).join('')}
                                            </div>
                                            <div class="order-item-right">
                                                <span class="order-status order-status--success">${order.status}</span>
                                                <p class="order-date">${new Date(order.data_compra).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="profile-section">
                            <div class="section-title">
                                <h2>Configurações</h2>
                            </div>
                            <div class="settings-grid">
                                <label class="toggle-item">
                                    <span>Notificações</span>
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                                <label class="toggle-item">
                                    <span>Promoções</span>
                                    <input type="checkbox" checked>
                                    <span class="slider"></span>
                                </label>
                                <label class="toggle-item">
                                    <span>Autenticação em 2 fatores</span>
                                    <input type="checkbox">
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        `;
    }

    static renderTracking() {
        return `
            <main class="main-content tracking-page">
                <div class="container">
                    <div class="tracking-header">
                        <button class="btn btn-outline" onclick="appState.setPage('home'); render();">
                            <i class="fas fa-arrow-left"></i> Voltar à loja
                        </button>
                        <h1>Rastrear encomenda</h1>
                    </div>

                    <div class="tracking-panel">
                        <div class="tracking-box">
                            <h2>Digite o código do pedido</h2>
                            <p>Use BR001, BR002 ou BR003 para ver um rastreamento de exemplo.</p>
                            <div class="tracking-input-group">
                                <input id="trackingCodeInput" type="text" placeholder="Código do pedido" />
                                <button id="trackingBtn" class="btn btn-primary">Rastrear</button>
                            </div>
                        </div>
                        <div class="tracking-results" id="trackingResults">
                            <p>Insira um código para acompanhar o andamento do seu pedido.</p>
                        </div>
                    </div>
                </div>
            </main>
        `;
    }

    static createTrackingTimeline(steps) {
        return `
            <div class="tracking-timeline">
                ${steps.map((step, index) => `
                    <div class="timeline-step ${index === steps.length - 1 ? 'active' : ''}">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <span class="timeline-status">${step.status}</span>
                            <p class="timeline-meta">${step.date} • ${step.time}</p>
                            <p class="timeline-location">${step.location}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static generateTrackingSteps(code) {
        const now = new Date();
        const baseDate = new Date(now.getTime() - 1000 * 60 * 60 * 24);
        const statuses = [
            { status: 'Recebido', location: 'Recebimento ShopBr' },
            { status: 'Nota emitida', location: 'Financeiro ShopBr' },
            { status: 'Postado', location: 'Transportadora' },
            { status: 'Em trânsito', location: 'Centro de Distribuição' },
            {
                status: 'Entregue', location: 'Entrega final'
            }
        ];

        let maxStep = 4;

        if (code.toUpperCase() === 'BR001') maxStep = 2;
        else if (code.toUpperCase() === 'BR002') maxStep = 3;
        else if (code.toUpperCase() === 'BR003') maxStep = 4;
        else {
            const seed = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            maxStep = Math.min(4, Math.max(1, (seed + now.getDate()) % 5));
        }

        return statuses.slice(0, maxStep + 1).map((step, index) => {
            const stepTime = new Date(baseDate.getTime() + index * 1000 * 60 * 60 * 8);
            return {
                status: step.status,
                date: stepTime.toLocaleDateString('pt-BR'),
                time: stepTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                location: step.location
            };
        });
    }
    static renderLogin() {
        return `
            <main class="main-content login-page">
                <div class="container login-container">
                    <!-- Formulário de Login -->
                    <div class="auth-box">
                        <h2>Entrar</h2>
                        <form onsubmit="handleLoginSubmit(event)" class="auth-form">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Senha</label>
                                <input type="password" name="senha" required class="form-input">
                            </div>
                            <button type="submit" class="btn btn-primary form-submit">Fazer Login</button>
                        </form>
                    </div>

                    <!-- Formulário de Registro -->
                    <div class="auth-box">
                        <h2>Criar Conta</h2>
                        <form onsubmit="handleRegisterSubmit(event)" class="auth-form">
                            <div class="form-group">
                                <label>Nome</label>
                                <input type="text" name="nome" required class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required class="form-input">
                            </div>
                            <div class="form-group">
                                <label>Senha</label>
                                <input type="password" name="senha" required class="form-input">
                            </div>
                            <button type="submit" class="btn btn-outline form-submit">Registrar</button>
                        </form>
                    </div>
                </div>
            </main>
        `;
    }

    static renderAdmin() {
        if (!appState.user || !appState.user.is_admin) {
            return `
                <main class="main-content">
                    <div class="container access-denied-container">
                        <h2>Acesso Negado</h2>
                        <p>Você não tem permissão para acessar esta página.</p>
                        <button class="btn btn-primary" onclick="appState.setPage('home'); render();">Voltar à Home</button>
                    </div>
                </main>
            `;
        }

        return `
            <main class="main-content admin-page">
                <div class="container">
                    <h1 class="admin-title">Painel de Administração</h1>
                    
                    <div class="admin-columns">
                        <div class="admin-col-form">
                            <h2>Adicionar Produto</h2>
                            <form onsubmit="handleAdminCreateProduct(event)" class="admin-form" enctype="multipart/form-data">
                                <input type="text" name="nome" placeholder="Nome do Produto" required class="form-input">
                                
                                <select name="categoria" required class="form-input">
                                    <option value="" disabled selected>Selecione uma Categoria...</option>
                                    <option value="Computadores">Computadores</option>
                                    <option value="Câmeras">Câmeras</option>
                                    <option value="TVs">TVs</option>
                                    <option value="Smartwatches">Smartwatches</option>
                                    <option value="Games">Games</option>
                                    <option value="Celulares">Celulares</option>
                                    <option value="Acessórios">Acessórios</option>
                                </select>

                                <input type="number" name="preco" step="0.01" placeholder="Preço" required class="form-input">
                                <input type="number" name="estoque" placeholder="Estoque" required class="form-input">
                                
                                <input type="file" name="imagem" accept="image/*" required class="form-input">
                                
                                <textarea name="descricao" placeholder="Descrição..." rows="4" class="form-input"></textarea>
                                <button type="submit" class="btn btn-primary">Adicionar</button>
                            </form>
                        </div>

                        <div class="admin-col-list">
                            <h2>Gerenciar Produtos</h2>
                            <div class="admin-products-list">
                                ${PRODUCTS.map(product => `
                                    <div class="admin-product-item">
                                        <div class="admin-product-info">
                                            <img src="${product.imagens ? product.imagens[0] : product.imagem_url}" class="admin-product-img">
                                            <div>
                                                <h4 class="admin-product-name">${product.nome}</h4>
                                                <small class="admin-product-meta">Estoque: ${product.estoque} | R$ ${Number(product.preco).toFixed(2)}</small>
                                            </div>
                                        </div>
                                        <div class="admin-actions" style="display: flex; gap: 10px;">
                                            <button class="btn btn-outline" onclick="openEditForm(${product.id})" style="color: #185FA5; border-color: #185FA5;">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-outline btn-delete" onclick="handleAdminDeleteProduct(${product.id})">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div id="editProductModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
                    <div style="background: white; padding: 30px; border-radius: 8px; width: 90%; max-width: 500px;">
                        <h2>Editar Produto</h2>
                        <form onsubmit="handleAdminUpdateProduct(event)" class="admin-form" id="editProductForm" enctype="multipart/form-data">
                            <input type="hidden" name="id" id="edit-id">
                            
                            <input type="text" name="nome" id="edit-nome" placeholder="Nome do Produto" required class="form-input" style="margin-bottom: 10px;">
                            
                            <select name="categoria" id="edit-categoria" required class="form-input" style="margin-bottom: 10px;">
                                <option value="" disabled>Selecione uma Categoria...</option>
                                <option value="Computadores">Computadores</option>
                                <option value="Câmeras">Câmeras</option>
                                <option value="TVs">TVs</option>
                                <option value="Smartwatches">Smartwatches</option>
                                <option value="Games">Games</option>
                                <option value="Celulares">Celulares</option>
                                <option value="Acessórios">Acessórios</option>
                            </select>

                            <input type="number" name="preco" id="edit-preco" step="0.01" placeholder="Preço" required class="form-input" style="margin-bottom: 10px;">
                            <input type="number" name="estoque" id="edit-estoque" placeholder="Estoque" required class="form-input" style="margin-bottom: 10px;">
                            
                            <input type="file" name="imagem" id="edit-imagem" accept="image/*" class="form-input" style="margin-bottom: 10px;">
                            
                            <textarea name="descricao" id="edit-descricao" placeholder="Descrição..." rows="4" class="form-input" style="margin-bottom: 15px;"></textarea>
                            
                            <div style="display: flex; gap: 10px;">
                                <button type="submit" class="btn btn-primary" style="flex: 1;">Salvar Alterações</button>
                                <button type="button" class="btn btn-outline" style="flex: 1;" onclick="closeEditForm()">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        `;
    }

    static renderContact() {
        return `
            <main class="main-content">
                <div class="container contact-container">
                    <h1 class="page-title">Central de Ajuda e Devoluções</h1>
                    <p class="page-intro">
                        Estamos aqui para ajudar! Se você teve algum problema com sua compra, deseja fazer uma devolução ou apenas tirar uma dúvida, preencha o formulário abaixo. 
                        Nossa equipe de suporte entrará em contato com você o mais rápido possível para resolver qualquer situação.
                    </p>
                    <form action="mailto:19pablorafael@gmail.com" method="post" enctype="text/plain" class="contact-form">
                        <div class="form-group">
                            <label class="form-label">Seu Nome:</label>
                            <input type="text" name="Nome" required class="form-input">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Sua Reclamação / Dúvida:</label>
                            <textarea name="Mensagem" rows="6" required class="form-input" placeholder="Descreva aqui sua situação detalhadamente..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary form-submit">Enviar Mensagem para o Suporte</button>
                    </form>
                </div>
            </main>
        `;
    }

    static renderPolicy() {
        return `
            <main class="main-content">
                <div class="container policy-container">
                    <h1 class="page-title--center">Nossas Políticas</h1>
                    
                    <div class="policy-card">
                        <h2 class="policy-card-title">Política de Privacidade</h2>
                        <p>Na ShopBr, levamos sua privacidade a sério. Coletamos apenas as informações necessárias para processar seus pedidos e melhorar sua experiência de compra. Seus dados pessoais nunca são vendidos para terceiros. Utilizamos criptografia de ponta a ponta para proteger suas informações de pagamento e garantir uma navegação 100% segura.</p>
                    </div>

                    <div class="policy-card">
                        <h2 class="policy-card-title">Termos de Uso</h2>
                        <p>Ao utilizar nosso site, você concorda em cumprir nossos termos. A ShopBr reserva-se o direito de modificar preços e especificações de produtos sem aviso prévio. O uso indevido da plataforma, como tentativas de fraude ou criação de múltiplas contas falsas, resultará no banimento imediato do usuário. Todos os produtos estão sujeitos à disponibilidade de estoque.</p>
                    </div>

                    <div class="policy-card">
                        <h2 class="policy-card-title">Uso de Cookies</h2>
                        <p>Utilizamos cookies essenciais para manter você logado, salvar os itens do seu carrinho e lembrar de suas preferências. Também usamos cookies analíticos de forma anônima para entender como você navega em nosso site, o que nos ajuda a organizar melhor as categorias e sugerir produtos que combinam com o seu estilo.</p>
                    </div>
                </div>
            </main>
        `;
    }
}

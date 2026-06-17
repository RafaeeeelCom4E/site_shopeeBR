// Estado global da aplicação
class AppState {
    constructor() {
        this.cart = this.loadCart();
        this.favorites = this.loadFavorites();
        this.user = this.loadUser(); // Novo: Estado do usuário logado
        this.currentPage = 'home';
        this.selectedProduct = null;
        this.searchQuery = '';
        this.selectedCategory = null;
        this.pageChanged = false;
        this.listeners = [];
    }

    // Carrinho
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.notify();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.notify();
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.notify();
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.preco * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.notify();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Favoritos
    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(productId);
        }
        this.saveFavorites();
        this.notify();
    }

    isFavorite(productId) {
        return this.favorites.includes(productId);
    }

    removeFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.notify();
        }
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    }

    // Navegação
    setPage(page, data = null) {
        if (this.currentPage !== page) {
            this.pageChanged = true;
        }
        this.currentPage = page;
        if (data) {
            this.selectedProduct = data;
        }
        this.notify();
    }

    // Busca e filtro
    setSearchQuery(query) {
        this.searchQuery = query.toLowerCase();
        this.notify();
    }

    setSelectedCategory(category) {
        this.selectedCategory = category;
        this.notify();
    }

    // Obter produtos filtrados
    getFilteredProducts() {
        let filtered = PRODUCTS;

        if (this.selectedCategory) {
            filtered = filtered.filter(p => p.categoria === this.selectedCategory);
        }

        if (this.searchQuery) {
            filtered = filtered.filter(p => 
                p.nome.toLowerCase().includes(this.searchQuery) ||
                p.categoria.toLowerCase().includes(this.searchQuery)
            );
        }

        return filtered;
    }

    // Observadores
    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener());
    }

    // --- Autenticação ---
    login(userData) {
        this.user = userData;
        this.saveUser();
        this.notify();
    }

    logout() {
        this.user = null;
        this.saveUser();
        this.setPage('home');
        this.notify();
    }

    saveUser() {
        if (this.user) {
            localStorage.setItem('user', JSON.stringify(this.user));
        } else {
            localStorage.removeItem('user');
        }
    }

    loadUser() {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    }
}

// Instância global
const appState = new AppState();

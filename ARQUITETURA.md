## 🏗️ ARQUITETURA TÉCNICA - ShopBr

### 📐 Arquitetura da Aplicação

```
┌─────────────────────────────────────────┐
│          index.html (Shell)             │
├─────────────────────────────────────────┤
│ Font Awesome Icons                      │
│ data.js → state.js → components.js →  │
│ pages.js → app.js → style.css         │
└─────────────────────────────────────────┘
```

### 🔄 Fluxo de Dados

```
User Action
    ↓
app.attachEventListeners()
    ↓
appState.setPage() ou appState.toggleFavorite() etc
    ↓
appState.notify() → render()
    ↓
Components.createXXX() → Renderiza HTML
    ↓
app.attachEventListeners() novamente
```

### 📦 Módulos

#### 1. **data.js** (150 linhas)
Dados estáticos da aplicação:

```javascript
PRODUCTS = [      // Array com 12 produtos
    { id, nome, categoria, preco, ... }
]

CATEGORIAS = []   // 7 categorias
PROMOTIONAL_BANNERS = []  // 3 banners
HERO_BANNERS = [] // Carousel
```

#### 2. **state.js** (150 linhas)
Gerenciamento de estado global com padrão Observer:

```javascript
class AppState {
    // Carrinho
    addToCart(product, quantity)
    removeFromCart(productId)
    updateCartQuantity(productId, quantity)
    clearCart()
    
    // Favoritos
    toggleFavorite(productId)
    isFavorite(productId)
    
    // Navegação
    setPage(page, data)
    
    // Filtros
    setSearchQuery(query)
    setSelectedCategory(category)
    getFilteredProducts()
    
    // Observadores
    subscribe(listener)
    notify()
}

appState = new AppState()  // Instância global
```

**localStorage Keys**:
- `cart` - JSON do carrinho
- `favorites` - Array de IDs

#### 3. **components.js** (400 linhas)
Componentes reutilizáveis:

```javascript
class Components {
    // Layout Principal
    createHeader()        // Header sticky com busca
    createFooter()        // Footer com links
    
    // Seções Home
    createHeroCarousel()  // Carousel 3 slides
    createCategoryStrip() // Categorias horizontais
    createPromotionalBanners()  // 3 banners
    createDailyOffers()   // Ofertas + countdown
    createHighlightSection()    // Banner destaque
    createTrendsSection()       // Tendências com abas
    createBottomBanner()        // Banner 30% OFF
    
    // Componentes
    createProductCard(product)  // Card reutilizável
    createCartItem(item)        // Item no carrinho
    createStarRating(rating)    // Avaliação em estrelas
    
    // Utilidades
    createCountdownTimer()      // Timer regressivo
}
```

#### 4. **pages.js** (200 linhas)
Páginas da aplicação SPA:

```javascript
class Pages {
    renderHome()           // Home completa
    renderProducts()       // Listagem com filtros
    renderProductDetail()  // Detalhes (3 colunas)
    renderCart()          // Carrinho + resumo
}
```

#### 5. **app.js** (300 linhas)
Aplicação principal e roteamento:

```javascript
class App {
    constructor()
    render()              // Renderiza página atual
    setupListeners()      // Observer padrão
    attachEventListeners()  // Todos os eventos
    
    initCarousel()        // Carousel auto-play
    initCountdown()       // Timer regressivo
    initTabs()           // Abas funcionais
    showNotification()    // Notificação toast
}

function render()  // Função global para re-render
```

#### 6. **style.css** (1200 linhas)
Estilos CSS customizados (sem frameworks):

```css
:root { Variáveis de cor }

/* Componentes */
.header { ... }
.hero-carousel { ... }
.product-card { ... }
.cart-item { ... }
.product-detail { ... }

/* Responsividade */
@media (max-width: 1024px) { ... }
@media (max-width: 768px) { ... }
@media (max-width: 480px) { ... }
```

### 🎯 Fluxo de Estados

```
HOME
  ↓ (clica em categoria)
  ↓
PRODUCTS (filtrado)
  ↓ (clica em produto)
  ↓
PRODUCT-DETAIL
  ↓ (clica em carrinho ou continua shopping)
  ↓
CART
  ↓ (continua comprando)
  ↓
HOME/PRODUCTS
```

### 🔌 Integração com API REST

Atualmente o app usa dados estáticos. Para conectar uma API:

#### Opção 1: Carregar dados ao iniciar

Em `app.js`:
```javascript
async function initApp() {
    try {
        window.PRODUCTS = await fetch('/api/products')
            .then(r => r.json());
        render();
    } catch(e) {
        console.error('Erro ao carregar produtos:', e);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
```

#### Opção 2: Adicionar produto ao carrinho (backend)

```javascript
appState.addToCart = async function(product) {
    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id })
        });
        // Handle response
    } catch(e) {
        console.error('Erro ao adicionar:', e);
    }
}
```

#### Opção 3: Finalizar pedido

```javascript
async function checkout() {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                items: appState.cart,
                total: appState.getCartTotal()
            })
        });
        const order = await response.json();
        console.log('Pedido criado:', order);
    } catch(e) {
        console.error('Erro no checkout:', e);
    }
}
```

### 🔐 Autenticação

Para adicionar login:

```javascript
class Auth {
    static async login(email, password) {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const { token } = await response.json();
        localStorage.setItem('token', token);
        return token;
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static logout() {
        localStorage.removeItem('token');
    }
}
```

### 🎨 Customizando Cores

No `style.css`, editando `:root`:

```css
:root {
    --primary-blue: #185FA5;      /* Header, links */
    --primary-blue-dark: #1565C0; /* Hover */
    --secondary-white: #FFFFFF;   /* Background */
    --accent-green: #2E7D32;      /* Botões de ação */
    --accent-red: #D32F2F;        /* Preços, descontos */
    --neutral-light: #F5F5F5;     /* Background leve */
    --neutral-gray: #757575;      /* Texto secundário */
    --neutral-dark: #212121;      /* Texto principal */
}
```

### 📱 Responsividade

#### Desktop (1024px+)
- 4 colunas de produtos
- Layout de 3 colunas para detalhes
- Sidebar flutuante

#### Tablet (768px - 1024px)
- 2-3 colunas de produtos
- Layout de 2 colunas para detalhes
- Ajustes de espaçamento

#### Mobile (até 768px)
- 2 colunas de produtos
- Layout de 1 coluna para detalhes
- Navegação compacta
- Modais em lugar de sidebars

### 🚀 Performance

**Otimizações Implementadas:**
- Sem dependências externas pesadas
- CSS crítico inlined
- Lazy loading de imagens (placeholders)
- Event delegation para otimizar listeners
- LocalStorage para cache de usuário

**Tamanho dos Arquivos:**
- index.html: ~3KB
- style.css: ~35KB
- data.js: ~15KB
- state.js: ~8KB
- components.js: ~25KB
- pages.js: ~15KB
- app.js: ~20KB
- **Total: ~121KB** (muito leve!)

### 🧪 Testando Localmente

#### Servidor Local (para evitar CORS com imagens)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

### 🔧 Debug

#### Console
```javascript
// Ver estado
console.log(appState);

// Ver carrinho
console.log(appState.cart);

// Ver favoritos
console.log(appState.favorites);

// Limpar dados
localStorage.clear();

// Forçar re-render
render();
```

### 📈 Escalando para Produção

1. **Minificação**
   ```bash
   # Usar ferramentas como Webpack, Parcel
   npx terser app.js -o app.min.js
   ```

2. **Build Process**
   - CSS minificado
   - JavaScript bundled e otimizado
   - Imagens comprimidas

3. **Deploy**
   - Vercel, Netlify, Github Pages
   - CDN para imagens
   - SSL/HTTPS obrigatório

4. **Monitoramento**
   - Google Analytics
   - Sentry para erros
   - LogRocket para sessions

### 📚 Estrutura de Componentes Reutilizáveis

Cada componente segue padrão:

```javascript
static createXXX(data) {
    return `
        <div class="component">
            ${data.map(item => `
                <div class="item">
                    <!-- HTML do item -->
                </div>
            `).join('')}
        </div>
    `;
}
```

**Vantagens:**
- Fácil de reutilizar
- Renderização rápida com strings
- Sem Virtual DOM
- Totalmente previsível

### 🎓 Padrões Utilizados

- **Observer Pattern**: Sistema de listeners
- **SPA Pattern**: Roteamento sem reload
- **Component Pattern**: Componentes reutilizáveis
- **Singleton Pattern**: appState única instância
- **Factory Pattern**: Criar componentes

---

**Versão**: 1.0.0
**Última Atualização**: 16 de Maio de 2026

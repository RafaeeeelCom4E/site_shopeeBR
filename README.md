# 🛍️ ShopBr - E-Commerce Premium

Um e-commerce completo e profissional inspirado em Shopee e Magazine Luiza, desenvolvido com HTML, CSS e JavaScript vanilla.

## 📋 Características

✅ **Design profissional** seguindo padrões de mercado
✅ **Responsivo** para desktop, tablet e mobile
✅ **Hero carousel** funcional com auto-play
✅ **Busca e filtro** de produtos por categoria
✅ **Carrinho de compras** com persistência em localStorage
✅ **Favoritos** para marcar produtos preferidos
✅ **Página de detalhes** completa do produto
✅ **Countdown timer** para ofertas do dia
✅ **Sistema de abas** funcional
✅ **Notificações** de ações do usuário

## 🎨 Identidade Visual

- **Cor Primária**: Azul (#185FA5 / #1565C0)
- **Cor Secundária**: Branco (#FFFFFF)
- **CTA Botões**: Verde (#2E7D32)
- **Preços/Descontos**: Vermelho (#D32F2F)
- **Tipografia**: Sans-serif moderna
- **Cards**: Sombra leve, bordas arredondadas (8-12px)

## 📁 Estrutura de Arquivos

```
sitealo/
├── index.html          # Arquivo principal
├── style.css           # Estilos CSS
├── data.js             # Dados de produtos e categorias
├── state.js            # Gerenciamento de estado global
├── components.js       # Componentes reutilizáveis
├── pages.js            # Páginas da aplicação
├── app.js              # Aplicação principal
└── README.md           # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo `index.html` em um navegador moderno
2. A aplicação carregará automaticamente
3. Navegue pelo e-commerce de forma intuitiva

### Funcionalidades Principais

#### 🏠 Home
- Hero banner com carousel automático
- Strip de categorias
- Banners promocionais
- Ofertas do dia com countdown
- Seção de destaques
- Tendências da semana com abas

#### 🔍 Busca e Filtro
- Busque por nome de produto
- Filtre por categoria
- Resultados em tempo real

#### ❤️ Favoritos
- Clique no coração para favoritar
- Produtos salvos em localStorage
- Badge com contagem

#### 🛒 Carrinho
- Adicione produtos com quantidade
- Aumente/diminua quantidade
- Remova itens
- Calcule total com frete
- Tudo persistido em localStorage

#### 📦 Página de Produto
- Galeria de imagens com zoom
- Detalhes completos
- Ficha técnica
- Informações do vendedor
- Opções de pagamento
- Cálculo de frete por CEP
- Botões de ação destacados

## 💾 Armazenamento de Dados

Todos os dados são armazenados em localStorage:
- **cart**: Array de itens no carrinho
- **favorites**: Array de IDs de produtos favoritados

## 📱 Responsividade

- **Desktop**: Layout completo com 4 colunas
- **Tablet**: Layout adaptado com 2-3 colunas
- **Mobile**: Layout mobile-first com abas inferiores

## 🎯 Componentes Principais

### AppState
Gerencia o estado global da aplicação:
- Carrinho de compras
- Produtos favoritos
- Página atual
- Busca e filtros
- Sistema de observadores (listeners)

### Components
Componentes reutilizáveis:
- Header
- Footer
- Product Card
- Hero Carousel
- Category Strip
- Promotional Banners
- Daily Offers
- Trends Section
- Cart Items

### Pages
Páginas da aplicação:
- Home
- Products (Listagem)
- Product Detail
- Cart

### App
Aplicação principal:
- Roteamento SPA
- Gerenciamento de eventos
- Inicialização de componentes

## 📊 Estrutura de Dados

Cada produto contém:
```javascript
{
  id: número,
  nome: string,
  categoria: string,
  preco: número,
  precoOriginal: número,
  desconto: número,
  imagens: array,
  avaliacao: número (0-5),
  totalAvaliacoes: número,
  estoque: número,
  vendedor: string,
  vendedorAvaliacao: número (0-5),
  vendedorSeguindo: boolean,
  descricao: string,
  fichaTecnica: object
}
```

## 🔄 Fluxo de Navegação

1. **Home** → Visualize produtos
2. **Busca/Filtro** → Encontre o que quer
3. **Detalhes** → Veja informações completas
4. **Carrinho** → Adicione itens
5. **Checkout** → Finalize compra

## 🎉 Próximas Melhorias

- [ ] Integração com API REST
- [ ] Sistema de autenticação
- [ ] Página de checkout completa
- [ ] Integração de pagamento
- [ ] Dashboard do usuário
- [ ] Sistema de avaliações
- [ ] Chat com lojista
- [ ] Histórico de pedidos

## 📝 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

## 👨‍💻 Desenvolvido com

- HTML5
- CSS3
- JavaScript ES6+
- Font Awesome Icons
- LocalStorage API

---

**ShopBr** - Sua loja online de excelência 🚀

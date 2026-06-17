## 🚀 INÍCIO RÁPIDO - ShopBr

### 📁 Arquivos do Projeto

```
sitealo/
├── index.html          (Arquivo principal)
├── style.css           (Estilos - ~1000 linhas)
├── data.js             (Dados de 12 produtos)
├── state.js            (Estado global com localStorage)
├── components.js       (Componentes reutilizáveis)
├── pages.js            (Páginas: Home, Products, Detail, Cart)
├── app.js              (Lógica de roteamento)
├── README.md           (Documentação completa)
├── TESTES.md           (Sumário de testes)
└── INÍCIO_RÁPIDO.md    (Este arquivo)
```

### 🎯 Como Abrir

1. Localize o arquivo `index.html`
2. Abra em um navegador (Chrome, Firefox, Safari, Edge)
3. **Pronto!** O e-commerce está funcionando

### 💡 Funcionalidades Principais

#### 🏠 Home
- Hero carousel com 3 slides
- Categorias para navegar
- Banners promocionais (Vermelho, Azul, Verde)
- Ofertas do dia com countdown timer
- Produtos em destaque
- Tendências da semana

#### 🔍 Busca
- Digite na barra de busca
- Pressione Enter ou clique na lupa
- Resultados em tempo real

#### 🏷️ Filtros
- Clique em uma categoria no header
- Clique em "Produtos" para sair do filtro

#### 💚 Favoritos
- Clique no coração em qualquer produto
- Veja o badge com o número de favoritos

#### 🛒 Carrinho
1. Clique em "Adicionar" em um produto
2. Clique no ícone do carrinho
3. Aumente/diminua a quantidade
4. Remova itens se quiser
5. Veja o resumo do pedido
6. **Frete é grátis acima de R$300!**

#### 📦 Detalhes do Produto
- Clique na imagem ou nome do produto
- Veja galeria de imagens (clique nas miniaturas)
- Escolha voltagem (110V/220V)
- Leia a descrição e ficha técnica
- Veja informações do vendedor
- Calcule o frete pelo CEP
- Escolha quantidade
- Adicione ao carrinho

### 🎨 Paleta de Cores

| Cor | Uso | Código |
|-----|-----|--------|
| Azul | Primária (Header, Botões) | #185FA5 |
| Azul Escuro | Hover/Active | #1565C0 |
| Verde | CTAs (Comprar) | #2E7D32 |
| Vermelho | Preços/Descontos | #D32F2F |
| Branco | Secundária | #FFFFFF |

### 📱 Testado em

- ✅ Desktop (1920x1080+)
- ✅ Tablet (768x1024)
- ✅ Mobile (480x800)
- ✅ Chrome/Firefox/Safari/Edge

### 🔐 Dados Persistentes

O carrinho e favoritos são salvos automaticamente em **localStorage**:
- `cart` - Itens do carrinho
- `favorites` - IDs de produtos favoritados

Mesmo se fechar o navegador, os dados permanecem!

### 📊 Base de Dados

12 produtos com informações completas:
- Fone Bluetooth Premium
- Smartwatch Esportivo 2024
- Câmera Digital Mirrorless
- Smartphone Flagship 256GB
- Monitor Gaming 27" 4K
- Console Gaming Next-Gen
- TV 4K 65 polegadas
- Caixa de Som Bluetooth Portátil
- Power Bank 30000mAh
- Controle Sem Fio Gaming
- Teclado Mecânico RGB
- Mouse Gaming Profissional

### 🎮 Próximos Passos

#### Para Desenvolvedores

1. **Conectar API REST**:
   ```javascript
   // Em data.js, substitua PRODUCTS por:
   const PRODUCTS = await fetch('/api/products').then(r => r.json());
   ```

2. **Adicionar Autenticação**:
   - Criar página de login
   - Salvar token JWT
   - Proteger rotas

3. **Sistema de Pagamento**:
   - Integrar Stripe ou PagSeguro
   - Página de checkout
   - Confirmação de pedido

4. **Admin Panel**:
   - Gerenciar produtos
   - Visualizar pedidos
   - Estatísticas

#### Para Usuários

- ✅ Explorar produtos
- ✅ Usar filtros e busca
- ✅ Adicionar ao favoritos
- ✅ Fazer pedidos (UI pronta para integração)

### ⚙️ Customizações Fáceis

#### Mudar Nome da Loja
Em `components.js`, linha 18:
```javascript
<span>ShopBr</span>  // Mude para seu nome
```

#### Mudar Cores
Em `style.css`, linhas 12-18:
```css
:root {
    --primary-blue: #185FA5;     /* Mude aqui */
    --accent-green: #2E7D32;     /* E aqui */
    --accent-red: #D32F2F;       /* E aqui */
}
```

#### Adicionar Produtos
Em `data.js`, adicione ao array `PRODUCTS`:
```javascript
{
    id: 13,
    nome: "Seu Produto",
    categoria: "Acessórios",
    preco: 99.90,
    // ... outros campos
}
```

### 🐛 Troubleshooting

**P: As imagens não carregam?**
R: Usamos placeholders de picsum.photos. Se offline, adicione imagens locais.

**P: Dados do carrinho desapareceram?**
R: Verifique se localStorage está habilitado no navegador.

**P: Preciso limpar o carrinho?**
R: Abra o console (F12) e digite: `localStorage.clear()`

### 📞 Suporte

- Verifique o arquivo README.md para documentação completa
- Veja TESTES.md para lista de funcionalidades testadas
- Consulte os comentários no código-fonte

### 🎉 Divirta-se!

O ShopBr está pronto para usar. Explore, customize e amplie conforme necessário!

---

**Última Atualização**: 16 de Maio de 2026
**Versão**: 1.0.0

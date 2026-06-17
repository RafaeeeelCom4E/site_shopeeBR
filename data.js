// Variável global para armazenar os produtos do banco de dados
let PRODUCTS = [];

// Função para buscar produtos da API
async function fetchProducts() {
    try {
        const response = await fetch('/api/produtos');
        if (!response.ok) throw new Error('Falha ao buscar produtos');
        PRODUCTS = await response.json();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        PRODUCTS = []; // array vazio em caso de falha
    }
}

// Dados do usuário para a página de perfil
const USER_PROFILE = {
    nome: "João Silva",
    email: "joao.silva@example.com",
    avatar: "https://i.pravatar.cc/150?img=32",
    telefone: "(11) 91234-5678",
    endereco: "Av. Paulista, 1000, São Paulo - SP"
};

// Categorias
const CATEGORIAS = [
    { id: 1, nome: "Computadores", icon: "fa-laptop" },
    { id: 2, nome: "Câmeras", icon: "fa-camera" },
    { id: 3, nome: "TVs", icon: "fa-tv" },
    { id: 4, nome: "Smartwatches", icon: "fa-watch" },
    { id: 5, nome: "Games", icon: "fa-gamepad" },
    { id: 6, nome: "Celulares", icon: "fa-mobile" },
    { id: 7, nome: "Acessórios", icon: "fa-headphones" }
];

// Banners promocionais
const PROMOTIONAL_BANNERS = [
   {
    id: 1,
    image: "imagens/promo1.png",   // ← caminho da sua imagem
    category: "Celulares"
    },
 {
    id: 2,
    image: "imagens/promo2.png",   // ← caminho da sua imagem
    category: "Celulares"
},
    {
    id: 3,
    image: "imagens/promo3.png",   // ← caminho da sua imagem
    category: "Celulares"
},
   ];
// Hero banners para carrossel
const HERO_BANNERS = [
    {
        id: 1,
        category: "Computadores",
        title: "Leve o Gaming para Outro Nível",
        subtitle: "Monitores 4K com até 144Hz",
        price: "A partir de R$ 1.299,90",
        image: "imagens/banner1.png",
        discount: "-35%"
    },
    {
        id: 2,
        category: "Smartwatches",
        title: "Tecnologia no seu Pulso",
        subtitle: "Smartwatches com 4G integrado",
        price: "A partir de R$ 349,90",
        image: "imagens/banner2.png",
        discount: "-42%"
    },
    {
        id: 3,
        category: "Câmeras",
        title: "Imagem em 4K Profissional",
        subtitle: "Câmeras mirrorless com 45MP",
        price: "A partir de R$ 2.899,90",
        image: "imagens/banner3.png",
        discount: "-36%"
    }
];

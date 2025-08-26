

let containerProdutos = document.querySelector(".products-container") 
let input = document.querySelector(".search-input")


// vai trazer todos os botões que tem essa classe ALL=> significa todos
let botoes = document.querySelectorAll(".category-btn")


let textoPesquisa = ""
let categoriaAtual = "all" // começar mostrando todos na tela
let produtos = [
    {
        id: 1,
        nome: "iPhone 15 Pro",
        categoria: "smartphones",
        preco: 7999,
        precoOriginal: 8999,
        desconto: 11,
        imagem: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
        descricao: "Smartphone Apple com câmera avançada"
    },
    {
        id: 2,
        nome: "MacBook Air M2",
        categoria: "laptops",
        preco: 8999,
        precoOriginal: 10999,
        desconto: 18,
        imagem: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        descricao: "Notebook Apple ultrafino e potente"
    },
    {
        id: 3,
        nome: "AirPods Pro",
        categoria: "headphones",
        preco: 1899,
        precoOriginal: 2299,
        desconto: 17,
        imagem: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
        descricao: "Fones sem fio com cancelamento de ruído"
    },
    {
        id: 4,
        nome: "Samsung Galaxy S24",
        categoria: "smartphones",
        preco: 5499,
        precoOriginal: 6299,
        desconto: 13,
        imagem: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
        descricao: "Smartphone Samsung com tela AMOLED"
    },
    {
        id: 5,
        nome: "Apple Watch Series 9",
        categoria: "smartwatch",
        preco: 3299,
        precoOriginal: 3799,
        desconto: 13,
        imagem: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
        descricao: "Relógio inteligente com monitoramento"
    },
    {
        id: 6,
        nome: "Teclado Mecânico",
        categoria: "accessories",
        preco: 499,
        precoOriginal: null,
        desconto: null,
        imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
        descricao: "Teclado mecânico RGB para gamers"
    },
    {
        id: 7,
        nome: "Sony WH-1000XM5",
        categoria: "headphones",
        preco: 2499,
        precoOriginal: 2999,
        desconto: 17,
        imagem: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
        descricao: "Fone com cancelamento de ruído"
    },
    {
        id: 8,
        nome: "Dell XPS 13",
        categoria: "laptops",
        preco: 7999,
        precoOriginal: null,
        desconto: null,
        imagem: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400",
        descricao: "Notebook Windows premium"
    }
];




// colocando os produtos na tela
function mostrarProdutos () {

    let htmlProdutos = ""

    // filtragem de produtos
let produtosFiltrados = produtos.filter(prd => {

// se a categoria estiver com all, coloca os produtos, se for igual a categoriaAtual também
let passouCategoria = (categoriaAtual === "all" || prd.categoria === categoriaAtual)




    // includes => verifica se o que pesquisou tem dentro dos produtos
    // toLowerCase => passa tudo para letra menuscula e na hora de pesquisar consegue encontrar independente como está
    let passouPesquisa = prd.nome.toLowerCase().includes(textoPesquisa.toLowerCase())

    return passouPesquisa && passouCategoria
})




// através do foreach coloca todo array na tela
    produtosFiltrados.forEach(produto => {
        htmlProdutos = htmlProdutos +`
        <div class="product-card">
        <img class="product-img" src="${produto.imagem}" alt="${produto.nome}>
        <div class="product-info">
        <h3 class="product-name"> ${produto.nome}</h3>
        <p class="product-description"> ${produto.descricao}</p>
        <p class="product-price">R$ ${produto.preco}</p>
        <button class="product-button"> Comprar</button>
        </div>
        
        
        </div>
        `
    })

    // com innerHTML colocamos todo array dentro da div criada no html
    containerProdutos.innerHTML = htmlProdutos
}

// função do input
function pesquisar(){
textoPesquisa = input.value

    mostrarProdutos()

}

function trocarCategoria(categoria){
   categoriaAtual = categoria


   // ao clicar em qualquer botão eu removo a classe active
botoes.forEach( botao => {
    botao.classList.remove("active")

    // se o botão que tiver essa data-category for igual a categoria ai coloca a classe "active"
    if (botao.getAttribute("data-category") === categoria){
        botao.classList.add("active")
    }
})


   mostrarProdutos()
}





// obeservando e carregando todos os produtos quando iniciar
window.addEventListener("DOMContentLoaded", () => {
   
    // mostra todos os produtos na tela
    mostrarProdutos()

    //ficar ouvindo o que se escreve no input
    input.addEventListener('input', pesquisar)


//fazendo a função do botão de categoria, para quando for clicado
    botoes.forEach(botao => {
        botao.addEventListener('click', () =>{
           
           // quando o botão é clicado através do data-category ele vai pegar o nome do botão certo
            let categoria = botao.getAttribute("data-category")
           
            trocarCategoria(categoria)

        })
    })

})






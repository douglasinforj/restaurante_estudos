//Buscando os ids da pagina:


const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];    //criar a lista para o carrinho, array vazio



//Abrior o modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();                           //vai manter o carrinho atualizado
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

//Fechar o modal no botão fechar
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")    //adicionamos a class que queremos acionar com o botão

    //console.log(parentButton);    //testar a saida do click

    //vamos buscar os atributos como name, price

    if (parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))  //cnvertendo em numero

        //Verificando se esta recebendo os valores
        console.log(name)
        console.log(price)

        //Chamando a função adicionar carrinho "addToCart"
        addToCart(name, price)

    }

})


//Criando a função para adicionar no carrinho
function addToCart(name, price){
    
    //verificar se ja existe o item
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        //se o item ja existe, aumenta somente a quantidade + 1
        existingItem.quantity +=1        //pega o elemento duplicado, busca a propriedade quantity e adiciona +1
    }else{

        cart.push({       //adicionar objetos no carrinho
            name,         //propriedade
            price,        //propriedade
            quantity: 1,  //o clicar de primeira ele vai começar com 1
    
        })
    }

    //chama a função para atualizar o modal
    updateCartModal()
    
    
}

//Atualizando o carrinho na tela:
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{      //percorre cada item adicionado no carrinho
        //console.log(item)
        const cartItemElement = document.createElement("div");  //criando um elemento div no html 
        
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")     //Estitlizando a div pai

        //monta nosso elemento no html adicionando divs
        cartItemElement.innerHTML = `
            <div  class="flex items-center justify-between">   
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">${item.price}</p>  
                </div>

                <div>
                    <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                    </button>
                </div>

            </div>
        `
        total += item.price * item.quantity;   //soma os itens

        cartItemsContainer.appendChild(cartItemElement)     //adicionando toda a estrutura que criamos no html
       
        
    })

    //Fora do foreach
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    //adicionar ao contador do item de carrinho:
    cartCounter.innerHTML = cart.length;
 
}



//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){       //container do modal
    if(event.target.classList.contains("remove-from-cart-btn")){    //se for o botão com a class
        const name = event.target.getAttribute("data-name")         //pega o atributo

        console.log(name)   //verifica que esta pegando a tributo, testar desenv.

        removeItemCart(name);  //chamar a função de remover item do carrinho
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);   //tentando encontra o index do item a posição dele 

    if(index !== -1){               //ele vai encontra o item na lista
        const item = cart[index];  //pegando o item passado a posição dele
        console.log(item)         //ver o item no index

        //verificação se tem mais de um item:
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();     //vai remontar o modal, sem o item removido
            return;                //parar a execução
        }

        //caso tenha somente um:
        cart.splice(index, 1);     //pegamos a posição dele e remove este item da lista
        updateCartModal();        //vai remontar o modal, sem o item removido

    }
}



//Tratando o campo de endereço de entrega, adicionadno regras:

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")   //remove a borda vermelha caso seja escrito algo no input
        addressWarn.classList.add("hidden")               //vai remover o aviso de texto da validação
    }
})





//Validação do campo de endereço de entrega
//------------------------------Finaliza pedido-------------------------------------
checkoutBtn.addEventListener("click", function(){


    //barra pedido após horario
    const isOpen = checkRestaurantOpen();         //chamar a função de verificação do resturante aberto
    if(!isOpen){
        
        Toastify({
            text: "Ops!!! O Restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;                                    //para a execução
    }


    if(cart.length === 0 ) return;                   //senão tiver nada no carrinho, faz nada
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")       //Faz aparecer o aviso que criamos la no html que esta oculto
        addressInput.classList.add("border-red-500") //muda a cor do imput
        return;
    }

    //----Enviar pedido para api whatsApp
    const cartItems = cart.map((item) => {      //percorre os items dentro de item
        return (                                //devolver cada string dos itens do carrinho
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} |`
        )
    }).join("")                                 //junta todo array, devolvendo um texto

    //---Mensagem whatsap
    const message = encodeURIComponent(cartItems)     //pega os itens
    const phone = "+5521965238304"

    //Enviando 
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    //limpnado o carrinho:
    cart = []
    updateCartModal();   //atualizar o modal do carrinho para vazio

})




//----------Vericação da Loja Aberta, verificar a hora a manipular o cart horário-------------

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 10 && hora < 22;   //true = restaurante aberto
    console.log(hora)
}

//Manipular a as cores para fechado e aberto no span com a hora:

const spanItem = document.getElementById("date-span")   //pegamos o elemento com a hora
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
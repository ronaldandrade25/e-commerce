document.addEventListener("DOMContentLoaded", () => {
    // --- SELETORES GLOBAIS ---
    // Adicionar junto com os outros seletores no início do <script>
    const viewCartBanner = document.querySelector(".view-cart-banner");
    const bannerTotalElem = document.getElementById("banner-total");
    const viewCartBannerBtn = document.querySelector(".view-cart-banner-btn");
    const containerProdutos = document.querySelector(".products-container");
    const input = document.querySelector(".search-input");
    const botoesCategoria = document.querySelectorAll(".category-btn");
    const cartIcon = document.querySelector(".cart-icon"),
        cartSidebar = document.querySelector(".cart-sidebar"),
        cartOverlay = document.querySelector(".cart-overlay"),
        closeCartBtn = document.querySelector(".close-cart-btn"),
        cartBody = document.querySelector(".cart-body"),
        subtotalElem = document.getElementById("cart-subtotal"),
        shippingElem = document.getElementById("cart-shipping"),
        totalElem = document.getElementById("cart-total"),
        cartBadge = document.querySelector(".cart-badge"),
        checkoutBtn = document.querySelector(".checkout-btn"),
        shippingIncentiveText = document.getElementById("shipping-incentive-text"),
        shippingProgressBar = document.getElementById("shipping-progress-bar"),
        shippingOptionsContainer = document.querySelector(
            ".shipping-options-container",
        ),
        cepBtn = document.querySelector(".cep-btn"),
        deliveryToggleBtns = document.querySelectorAll(".delivery-btn"),
        deliveryInfo = document.getElementById("delivery-info"),
        pickupInfo = document.getElementById("pickup-info");
    const checkoutModalOverlay = document.querySelector(
        ".checkout-modal-overlay",
    ),
        checkoutModal = document.querySelector(".checkout-modal"),
        closeCheckoutModalBtn = document.querySelector(".checkout-modal-close-btn"),
        cardNumberInput = document.getElementById("card-number");
    const couponInput = document.getElementById("coupon-input"),
        applyCouponBtn = document.getElementById("apply-coupon-btn"),
        couponFeedback = document.getElementById("coupon-feedback"),
        cartDiscountElem = document.getElementById("cart-discount"),
        discountLineElem = document.querySelector(".discount-line");

    // --- ESTADO DA APLICAÇÃO ---
    const produtos = [
        {
            id: 1,
            nome: "iPhone 15 Pro",
            categoria: "smartphones",
            preco: 7999,
            imagem:
                "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400",
            descricao: "Smartphone Apple com câmera avançada",
        },
        {
            id: 2,
            nome: "MacBook Air M2",
            categoria: "laptops",
            preco: 8999,
            imagem:
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
            descricao: "Notebook Apple ultrafino e potente",
        },
        {
            id: 3,
            nome: "AirPods Pro",
            categoria: "headphones",
            preco: 1899,
            imagem:
                "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
            descricao: "Fones sem fio com cancelamento de ruído",
        },
        {
            id: 4,
            nome: "Samsung Galaxy S24",
            categoria: "smartphones",
            preco: 5499,
            imagem:
                "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400",
            descricao: "Smartphone Samsung com tela AMOLED",
        },
        {
            id: 5,
            nome: "Apple Watch Series 9",
            categoria: "smartwatch",
            preco: 3299,
            imagem:
                "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
            descricao: "Relógio inteligente com monitoramento",
        },
        {
            id: 6,
            nome: "Magic Keyboard",
            categoria: "accessories",
            preco: 499,
            imagem:
                "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",
            descricao: "Teclado mecânico RGB para gamers",
        },
        {
            id: 7,
            nome: "Sony WH-1000XM5",
            categoria: "headphones",
            preco: 2499,
            imagem:
                "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400",
            descricao: "Fone com cancelamento de ruído",
        },
        {
            id: 8,
            nome: "Dell XPS 13",
            categoria: "laptops",
            preco: 7999,
            imagem:
                "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400",
            descricao: "Notebook Windows premium",
        },
        {
            id: 9,
            nome: "Capa de Silicone iPhone",
            categoria: "accessories",
            preco: 299,
            imagem:
                "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MPU63?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1661472856272",
            descricao: "Proteção e estilo para seu iPhone",
        },
        {
            id: 10,
            nome: "Carregador MagSafe",
            categoria: "accessories",
            preco: 450,
            imagem:
                "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1661269784338",
            descricao: "Carregamento sem fio rápido e fácil",
        },
    ];
    const validCoupons = [{ code: "DESCONTO10", type: "percentage", value: 10 }];
    let textoPesquisa = "",
        categoriaAtual = "all",
        carrinho = [],
        taxaEntregaSelecionada = null,
        tipoEntrega = "delivery",
        checkoutCurrentStep = 1,
        appliedCoupon = null;
    const META_FRETE_GRATIS = 250;

    const formatarMoeda = (v) =>
        v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // --- LÓGICA DE BLOQUEIO DE SCROLL (NOVA) ---
    const getScrollbarWidth = () =>
        window.innerWidth - document.documentElement.clientWidth;
    const lockScroll = () => {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.classList.add("no-scroll");
    };
    const unlockScroll = () => {
        document.body.style.paddingRight = "";
        document.body.classList.remove("no-scroll");
    };

    const abrirCarrinho = () => {
        cartSidebar.classList.add("show");
        cartOverlay.classList.add("show");
        lockScroll();
    };
    const fecharCarrinho = () => {
        cartSidebar.classList.remove("show");
        cartOverlay.classList.remove("show");
        unlockScroll();
    };

    const animacaoVoarParaCarrinho = (productCard) => {
        const productImg = productCard.querySelector(".product-img"),
            imgRect = productImg.getBoundingClientRect(),
            cartRect = cartIcon.getBoundingClientRect(),
            flyingImg = document.createElement("img");
        flyingImg.src = productImg.src;
        flyingImg.classList.add("product-image-fly");
        flyingImg.style.left = `${imgRect.left}px`;
        flyingImg.style.top = `${imgRect.top}px`;
        flyingImg.style.width = `${imgRect.width}px`;
        flyingImg.style.height = `${imgRect.height}px`;
        document.body.appendChild(flyingImg);
        requestAnimationFrame(() => {
            flyingImg.style.left = `${cartRect.left + cartRect.width / 2}px`;
            flyingImg.style.top = `${cartRect.top + cartRect.height / 2}px`;
            flyingImg.style.width = "0px";
            flyingImg.style.height = "0px";
            flyingImg.style.opacity = "0";
        });
        flyingImg.addEventListener("transitionend", () => flyingImg.remove());
    };

    const adicionarAoCarrinho = (produtoId, productCard) => {
        if (productCard) animacaoVoarParaCarrinho(productCard);
        const produto = produtos.find((p) => p.id === produtoId),
            itemNoCarrinho = carrinho.find((item) => item.id === produtoId);
        if (itemNoCarrinho) itemNoCarrinho.quantidade++;
        else carrinho.push({ ...produto, quantidade: 1 });
        atualizarCarrinho();
    };

    const alterarQuantidade = (produtoId, acao) => {
        const item = carrinho.find((i) => i.id === produtoId);
        if (!item) return;
        if (acao === "aumentar") item.quantidade++;
        else if (acao === "diminuir") {
            item.quantidade--;
            if (item.quantidade <= 0)
                carrinho = carrinho.filter((i) => i.id !== produtoId);
        }
        atualizarCarrinho();
    };

    const atualizarCarrinho = () => {
        if (carrinho.length === 0) {
            cartBody.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-box-open"></i><p>Seu carrinho está vazio.</p></div>`;
        } else {
            cartBody.innerHTML = carrinho
                .map(
                    (item) =>
                        `<div class="cart-item" data-id="${item.id}"><img src="${item.imagem}" alt="${item.nome}" class="cart-item-img"><div class="cart-item-info"><h4 class="cart-item-name">${item.nome}</h4><p class="cart-item-price">${formatarMoeda(item.preco)}</p><div class="cart-item-controls"><button class="quantity-btn" data-action="diminuir">-</button><span class="quantity">${item.quantidade}</span><button class="quantity-btn" data-action="aumentar">+</button></div></div><button class="remove-item-btn">&times;</button></div>`,
                )
                .join("");
        }

        const subtotal = carrinho.reduce(
            (acc, item) => acc + item.preco * item.quantidade,
            0,
        );
        let discountAmount = 0;
        if (appliedCoupon && appliedCoupon.type === "percentage")
            discountAmount = subtotal * (appliedCoupon.value / 100);

        const taxaFinal =
            taxaEntregaSelecionada === null ? 0 : taxaEntregaSelecionada.preco;
        const total = subtotal - discountAmount + taxaFinal;

        subtotalElem.textContent = formatarMoeda(subtotal);
        if (discountAmount > 0) {
            cartDiscountElem.textContent = `- ${formatarMoeda(discountAmount)}`;
            discountLineElem.style.display = "flex";
        } else {
            discountLineElem.style.display = "none";
        }
        if (tipoEntrega === "pickup") {
            shippingElem.textContent = "Grátis";
        } else {
            shippingElem.textContent =
                taxaEntregaSelecionada === null
                    ? "A calcular"
                    : formatarMoeda(taxaEntregaSelecionada.preco);
        }
        totalElem.textContent = formatarMoeda(total);

        cartBadge.textContent = carrinho.reduce(
            (acc, item) => acc + item.quantidade,
            0,
        );
        checkoutBtn.disabled = carrinho.length === 0;

        if (subtotal >= META_FRETE_GRATIS) {
            shippingIncentiveText.textContent =
                "Parabéns! Você conseguiu Frete Grátis!";
            shippingProgressBar.style.width = "100%";
        } else {
            const faltante = META_FRETE_GRATIS - subtotal;
            shippingIncentiveText.textContent = `Faltam ${formatarMoeda(faltante)} para Frete Grátis!`;
            shippingProgressBar.style.width = `${(subtotal / META_FRETE_GRATIS) * 100}%`;
        }

        if (carrinho.length > 0 && window.innerWidth <= 768) {
            bannerTotalElem.textContent = formatarMoeda(total);
            viewCartBanner.classList.add("show");
        } else {
            viewCartBanner.classList.remove("show");
        }
    };

    const mostrarProdutos = () => {
        const filtrados = produtos.filter(
            (p) =>
                (categoriaAtual === "all" || p.categoria === categoriaAtual) &&
                p.nome.toLowerCase().includes(textoPesquisa.toLowerCase()),
        );
        containerProdutos.innerHTML = filtrados
            .map(
                (p) =>
                    `<div class="product-card" data-id="${p.id}"><img class="product-img" src="${p.imagem}" alt="${p.nome}"><div class="product-info"><h3 class="product-name">${p.nome}</h3><p class="product-description">${p.descricao}</p><p class="product-price">${formatarMoeda(p.preco)}</p><button class="product-button">Comprar</button></div></div>`,
            )
            .join("");
    };

    const calcularFrete = () => {
        shippingOptionsContainer.innerHTML = `<p style="text-align:center;">Calculando...</p>`;
        setTimeout(() => {
            const subtotal = carrinho.reduce(
                (acc, item) => acc + item.preco * item.quantidade,
                0,
            );
            const opcoes = [
                { nome: "Padrão", prazo: 7, preco: 15.5 },
                { nome: "Expressa", prazo: 3, preco: 32.0 },
            ];
            if (subtotal >= META_FRETE_GRATIS)
                opcoes.unshift({ nome: "Grátis (Promocional)", prazo: 7, preco: 0 });
            shippingOptionsContainer.innerHTML = opcoes
                .map(
                    (opt, index) =>
                        `<div class="shipping-option" data-index="${index}"><span>${opt.nome} (${opt.prazo} dias)</span><span class="price">${opt.preco === 0 ? "Grátis" : formatarMoeda(opt.preco)}</span></div>`,
                )
                .join("");
            document.querySelectorAll(".shipping-option").forEach((optionEl) => {
                optionEl.addEventListener("click", () => {
                    document
                        .querySelectorAll(".shipping-option")
                        .forEach((el) => el.classList.remove("selected"));
                    optionEl.classList.add("selected");
                    taxaEntregaSelecionada =
                        opcoes[Number.parseInt(optionEl.dataset.index)];
                    atualizarCarrinho();
                });
            });
        }, 1000);
    };

    const applyCoupon = () => {
        const code = couponInput.value.trim().toUpperCase(),
            foundCoupon = validCoupons.find((c) => c.code === code);
        couponFeedback.classList.remove("success", "error");
        if (foundCoupon) {
            appliedCoupon = foundCoupon;
            couponFeedback.textContent = "Cupom aplicado com sucesso!";
            couponFeedback.classList.add("success");
        } else {
            appliedCoupon = null;
            couponFeedback.textContent = "Cupom inválido ou expirado.";
            couponFeedback.classList.add("error");
        }
        atualizarCarrinho();
    };

    const openCheckoutModal = () => {
        if (carrinho.length === 0) return;
        fecharCarrinho();
        lockScroll();
        checkoutModalOverlay.style.display = "flex";
        goToCheckoutStep(1);
    };
    const closeCheckoutModal = () => {
        checkoutModalOverlay.style.display = "none";
        unlockScroll();
    };

    const goToCheckoutStep = (step) => {
        checkoutCurrentStep = step;
        document
            .querySelectorAll(".checkout-step")
            .forEach((el) => el.classList.remove("active"));
        document
            .querySelector(`.checkout-step[data-step="${step}"]`)
            .classList.add("active");
        document
            .querySelectorAll(".checkout-btn-group")
            .forEach((el) => (el.style.display = "none"));
        document.querySelector(
            `.checkout-btn-group[data-step="${step}"]`,
        ).style.display = "flex";
        document.querySelectorAll(".progress-step").forEach((el, index) => {
            el.classList.remove("active", "completed");
            if (index + 1 < step) el.classList.add("completed");
            if (index + 1 === step) el.classList.add("active");
        });
        if (step === 3) populateReviewStep();
    };

    const populateReviewStep = () => {
        const name = document.getElementById("name").value,
            address = document.getElementById("address").value,
            number = document.getElementById("number").value;
        document.getElementById("review-address").innerHTML =
            `<strong>${name}</strong><br>${address}, ${number}`;
        document.getElementById("review-items").innerHTML = carrinho
            .map(
                (item) =>
                    `<p>${item.quantidade}x ${item.nome} - ${formatarMoeda(item.preco * item.quantidade)}</p>`,
            )
            .join("");
        const subtotal = carrinho.reduce(
            (acc, item) => acc + item.preco * item.quantidade,
            0,
        );
        let discountAmount = 0;
        if (appliedCoupon) discountAmount = subtotal * (appliedCoupon.value / 100);
        const shipping = taxaEntregaSelecionada?.preco || 0;
        let summaryHTML = `<p>Subtotal: ${formatarMoeda(subtotal)}</p>`;
        if (discountAmount > 0)
            summaryHTML += `<p>Desconto: - ${formatarMoeda(discountAmount)}</p>`;
        summaryHTML += `<p>Frete: ${formatarMoeda(shipping)}</p><p><strong>Total: ${formatarMoeda(subtotal - discountAmount + shipping)}</strong></p>`;
        document.getElementById("review-summary").innerHTML = summaryHTML;
    };

    const formatCardNumber = (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 16);
        const parts = value.match(/.{1,4}/g) || [];
        e.target.value = parts.join(" ");
    };

    const validateStep1 = () => {
        let isValid = true;
        const inputs = document.querySelectorAll(
            '.checkout-step[data-step="1"] input[required]',
        );
        inputs.forEach((input) => {
            if (input.value.trim() === "") {
                input.closest(".form-group").classList.add("error");
                isValid = false;
            } else {
                input.closest(".form-group").classList.remove("error");
            }
        });
        return isValid;
    };

    const validateStep2 = () => {
        let isValid = true;
        const activePayment = document.querySelector(".payment-tab.active").dataset
            .payment;
        if (activePayment === "credit-card") {
            const inputs = document.querySelectorAll(
                '.payment-content[data-payment="credit-card"] input[required]',
            );
            inputs.forEach((input) => {
                if (input.value.trim() === "") {
                    input.closest(".form-group").classList.add("error");
                    isValid = false;
                } else {
                    input.closest(".form-group").classList.remove("error");
                }
            });
        }
        return isValid;
    };

    const resetApp = () => {
        carrinho = [];
        taxaEntregaSelecionada = null;
        appliedCoupon = null;
        shippingOptionsContainer.innerHTML = "";
        couponInput.value = "";
        couponFeedback.textContent = "";
        couponFeedback.classList.remove("success", "error");
        document.querySelector(".cep-input").value = "";
        [
            "name",
            "email",
            "phone",
            "address",
            "number",
            "neighborhood",
            "card-number",
            "card-name",
            "card-expiry",
            "card-cvv",
        ].forEach((id) => (document.getElementById(id).value = ""));
        atualizarCarrinho();
        closeCheckoutModal();
    };

    // --- EVENT LISTENERS ---
    cartIcon.addEventListener("click", abrirCarrinho);
    viewCartBannerBtn.addEventListener("click", abrirCarrinho);
    closeCartBtn.addEventListener("click", fecharCarrinho);
    cartOverlay.addEventListener("click", fecharCarrinho);
    cepBtn.addEventListener("click", calcularFrete);
    checkoutBtn.addEventListener("click", openCheckoutModal);
    closeCheckoutModalBtn.addEventListener("click", closeCheckoutModal);
    cardNumberInput.addEventListener("input", formatCardNumber);
    applyCouponBtn.addEventListener("click", applyCoupon);
    input.addEventListener("input", (e) => {
        textoPesquisa = e.target.value;
        mostrarProdutos();
    });

    botoesCategoria.forEach((b) =>
        b.addEventListener("click", () => {
            categoriaAtual = b.dataset.category;
            botoesCategoria.forEach((btn) => btn.classList.remove("active"));
            b.classList.add("active");
            mostrarProdutos();
        }),
    );
    deliveryToggleBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
            deliveryToggleBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            tipoEntrega = btn.dataset.option;
            if (tipoEntrega === "delivery") {
                deliveryInfo.classList.add("active");
                pickupInfo.classList.remove("active");
                taxaEntregaSelecionada = null;
            } else {
                deliveryInfo.classList.remove("active");
                pickupInfo.classList.add("active");
                taxaEntregaSelecionada = { preco: 0 };
            }
            shippingOptionsContainer.innerHTML = "";
            atualizarCarrinho();
        }),
    );

    document.body.addEventListener("click", (e) => {
        const productCard = e.target.closest(".product-card");
        if (e.target.matches(".product-button") && productCard)
            adicionarAoCarrinho(Number.parseInt(productCard.dataset.id), productCard);
        const cartItem = e.target.closest(".cart-item");
        if (cartItem) {
            const produtoId = Number.parseInt(cartItem.dataset.id);
            if (e.target.matches(".quantity-btn"))
                alterarQuantidade(produtoId, e.target.dataset.action);
            if (e.target.matches(".remove-item-btn")) {
                carrinho = carrinho.filter((i) => i.id !== produtoId);
                atualizarCarrinho();
            }
        }
    });

    document.querySelector(".checkout-modal").addEventListener("click", (e) => {
        const triggerShake = () => {
            checkoutModal.classList.add("shake");
            checkoutModal.addEventListener(
                "animationend",
                () => checkoutModal.classList.remove("shake"),
                { once: true },
            );
        };
        if (e.target.dataset.action === "next-step") {
            if (checkoutCurrentStep === 1) {
                if (validateStep1()) {
                    goToCheckoutStep(2);
                } else {
                    triggerShake();
                }
            } else if (checkoutCurrentStep === 2) {
                if (validateStep2()) {
                    goToCheckoutStep(3);
                } else {
                    triggerShake();
                }
            }
        }
        if (e.target.dataset.action === "prev-step") {
            goToCheckoutStep(checkoutCurrentStep - 1);
        }
        if (e.target.dataset.action === "confirm-purchase") {
            const btn = e.target.closest(".btn-primary");
            btn.classList.add("loading");
            btn.disabled = true;
            setTimeout(() => {
                document.getElementById("order-number").textContent =
                    `#${Math.floor(Math.random() * 90000) + 10000}`;
                goToCheckoutStep(4);
                btn.classList.remove("loading");
                btn.disabled = false;
            }, 2000);
        }
        if (e.target.dataset.action === "reset") {
            resetApp();
        }
    });
    document
        .querySelectorAll(".checkout-modal input[required]")
        .forEach((input) => {
            input.addEventListener("input", () => {
                if (input.value.trim() !== "")
                    input.closest(".form-group").classList.remove("error");
            });
        });

    document.querySelectorAll(".payment-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll(".payment-tab")
                .forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            const paymentMethod = tab.dataset.payment;
            document.querySelectorAll(".payment-content").forEach((content) => {
                content.classList.remove("active");
                if (content.dataset.payment === paymentMethod)
                    content.classList.add("active");
            });
            document
                .querySelectorAll(
                    '.payment-content[data-payment="credit-card"] .form-group.error',
                )
                .forEach((el) => el.classList.remove("error"));
        });
    });

    // --- INICIALIZAÇÃO ---
    mostrarProdutos();
    atualizarCarrinho();
});
import { IProduct } from "./Product";
const baseUrl = "http://localhost:5000/products";
const checkColors = document.querySelectorAll(
  '.colors-filters input[type="checkbox"]'
);
const checkSizes = document.querySelectorAll(
  '.size-filters input[type="checkbox"]'
);
const checkPrices = document.querySelectorAll(
  '.price-filters input[type="checkbox"]'
);
const moreProductButton = document.getElementById("more-product");
const orderSelect = document.getElementById("order");

// Carregar produtos do server
function loadProducts(callback: (products: IProduct[]) => void) {
  const url: string = `${baseUrl}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Não foi possível obter os produtos da API");
      }
      return response.json();
    })
    .then((data) => {
      callback(data);
      console.log("Produtos obtidos com sucesso");
    })
    .catch((error) => {
      console.error("Erro ao obter os produtos:", error);
    });
}

// Verificar se checkbox foi marcado
function getCheckValues(checks: NodeListOf<Element>): string[] {
  const values: string[] = [];
  checks.forEach((check) => {
    if ((check as HTMLInputElement).checked) {
      values.push(check.getAttribute("id") || "");
    }
  });
  return values;
}

// Filtrar produtos com base nas seleções do usuário
function filterProducts(
  products: IProduct[],
  selectedColors: string[],
  selectedSizes: string[],
  selectedPrices: string[]
): IProduct[] {
  return products.filter((product) => {
    const valueColor =
      selectedColors.length === 0 || selectedColors.includes(product.color);
    const valueSize =
      selectedSizes.length === 0 ||
      product.size.some((size) => selectedSizes.includes(size));
    const valuePrice =
      selectedPrices.length === 0 ||
      selectedPrices.includes(getPriceRange(product.price));
    return valueColor && valueSize && valuePrice;
  });
}
// Eventos dos filtros(checkbox)
checkColors.forEach((check) => {
  check.addEventListener("change", updateProductList);
});
checkSizes.forEach((check) => {
  check.addEventListener("change", updateProductList);
});
checkPrices.forEach((check) => {
  check.addEventListener("change", updateProductList);
});

// Faixa de preço com base no preço dos produtos
function getPriceRange(price: number): string {
  if (price >= 0 && price <= 50) return "0-50";
  if (price > 50 && price <= 150) return "51-150";
  if (price > 150 && price <= 300) return "151-300";
  if (price > 300 && price <= 500) return "301-500";
  if (price >= 500) return "500-more";
  return;
}

// Criando elemento HTML
function createProductHTML(product: IProduct): HTMLElement {
  const productHTML: HTMLElement = document.createElement("li");
  productHTML.innerHTML = `
  <img class="card-photo" src="${product.image}" alt="${product.name}" />
  <h4 class="card-name">${product.name}</h2>
    <div class="card-price">
      <p>R$ ${product.price}</p>
      <p>até ${product.parcelamento.join("x de R$")}</p>
    </div>
    <div class="card-content-size">
      <div class="card-size">${product.size.join(", ")}</div>
    </div>
    <a href="#" class="card-buy">Comprar</a>
  `;
  return productHTML;
}

// Atualização de filtragem de produtos
function updateProductList(sortingOrder: any) {
  const selectedColors = getCheckValues(checkColors);
  const selectedSizes = getCheckValues(checkSizes);
  const selectedPrices = getCheckValues(checkPrices);

  loadProducts((products) => {
    const productList = document.getElementById("products");
    if (productList) {
      // Limpando productList
      productList.innerHTML = "";
      // Filtragem de produtos selecionados
      const filteredProducts = filterProducts(
        products,
        selectedColors,
        selectedSizes,
        selectedPrices
      );

      // filtragem por ordenação
      if (sortingOrder === "1") {
        filteredProducts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      } else if (sortingOrder === "2") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (sortingOrder === "3") {
        filteredProducts.sort((a, b) => a.price - b.price);
      }

      if (filteredProducts.length !== 0) {
        // Criação e renderização da lista sem filtros
        products.forEach((product: IProduct) => {
          const productDiv: HTMLElement = createProductHTML(product);
          productList.appendChild(productDiv);
        });
        // Limpando productList
        productList.innerHTML = "";
        // Criação e renderização da lista filtrada
        filteredProducts.forEach((product: IProduct) => {
          const productDiv: HTMLElement = createProductHTML(product);
          productList.appendChild(productDiv);
        });
      } else {
        // Mensagem caso nenhum produto atenda aos filtros selecionados
        const alertMessage: HTMLElement = document.createElement("li");
        alertMessage.classList.add("alert-message");
        alertMessage.innerText = "Nenhum produto encontrado.";
        productList.appendChild(alertMessage);
        moreProductButton.style.display = "none";
      }
    }
  });
}

// Adição de evento ao elemento order.
orderSelect.addEventListener("change", () => {
  const selectedOrder = (orderSelect as HTMLInputElement).value;
  if (selectedOrder !== "0") {
    updateProductList(selectedOrder);
  }
});

// Atualização de lista de produtos ao inicializar
document.addEventListener("DOMContentLoaded", updateProductList);

// Modal
document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("modal");
  var openBtn = document.getElementById("filters-button-mobile");
  var closeBtn = document.getElementById("filter-close-button");
  var filtrarBtn = document.getElementById("aplicar-filtro");

  // Abrir modal ao clicar no botão
  openBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Fechar modal ao clicar no botão de fechar
  closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Fechar modal ao clicar no botão de fechar
  filtrarBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Fechar modal ao clicar fora do conteúdo modal
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
});

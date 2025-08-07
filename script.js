const products = [
      {
        id: 1,
        name: "Tie-Dye Lounge Set",
        price: 150.00,
        image: "assets/photo-1432149877166-f75d49000351.jpg"
      },
      {
        id: 2,
        name: "Sunburst Tracksuit",
        price: 150.00,
        image: "assets/photo-1515886657613-9f3515b0c78f.jpg"
      },
      {
        id: 3,
        name: "Retro Rad Sweatshirt",
        price: 150.00,
        image: "assets/photo-1529139574466-a303027c1d8b.jpg"
      },
      {
        id: 4,
        name: "Urban Sportswear Combo",
        price: 150.00,
        image: "assets/photo-1588117260148-b47818741c74.jpg"
      },
      {
        id: 5,
        name: "Oversized Knit & Coat",
        price: 150.00,
        image: "assets/photo-1608748010899-18f300247112.jpg"
      },
      {
        id: 6,
        name: "Chic Monochrome Blazer",
        price: 150.00,
        image: "assets/photo-1632149877166-f75d49000351.jpg"
      }
    ];

    let selectedProducts = [];
    const DISCOUNT_THRESHOLD = 3;
    const DISCOUNT_PERCENTAGE = 0.3;

    const productsGrid = document.getElementById("productsGrid");
    const selectedProductsContainer = document.getElementById("selectedProducts");
    const progressText = document.getElementById("progressText");
    const progressFill = document.getElementById("progressFill");
    const discountAmount = document.getElementById("discountAmount");
    const subtotalAmount = document.getElementById("subtotalAmount");
    const proceedBtn = document.getElementById("proceedBtn");

    function init() {
      renderProducts();
      updateUI();
    }

    function renderProducts() {
      const limitedProducts = products.slice(0, 6);
      productsGrid.innerHTML = limitedProducts
        .map(
          (product) => {
            const isSelected = selectedProducts.some((p) => p.id === product.id);
            return `
        <div class="product-card">
          <div class="product-image" style="background-image: url('${product.image}')"></div>
          <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-bundle-btn${isSelected ? " added" : ""}" onclick="toggleProduct(${product.id})" id="btn-${product.id}">
              ${isSelected ? "Added to Bundle <span class='icon-tick' style='margin-left:8px;'>✓</span>" : "Add to Bundle <span class='icon-plus' style='margin-left:8px;'>+</span>"}
            </button>
          </div>
        </div>`;
          }
        )
        .join("");
    }

    function toggleProduct(productId) {
      const product = products.find((p) => p.id === productId);
      const index = selectedProducts.findIndex((p) => p.id === productId);

      if (index === -1) {
        selectedProducts.push({ ...product, quantity: 1 });
      } else {
        selectedProducts.splice(index, 1);
      }

      updateUI();
    }

    function increaseQty(productId) {
      const product = selectedProducts.find((p) => p.id === productId);
      if (product) {
        product.quantity += 1;
        updateUI();
      }
    }

    function decreaseQty(productId) {
      const product = selectedProducts.find((p) => p.id === productId);
      if (product.quantity > 1) {
        product.quantity -= 1;
      } else {
        removeProduct(productId);
      }
      updateUI();
    }

    function removeProduct(productId) {
      selectedProducts = selectedProducts.filter((p) => p.id !== productId);
      updateUI();
    }

    function updateUI() {
      updateProductButtons();
      updateProgress();
      updateSelectedProducts();
      updatePricing();
      updateProceedButton();
    }

    function updateProductButtons() {
      products.forEach((product) => {
        const btn = document.getElementById(`btn-${product.id}`);
        const isSelected = selectedProducts.some((p) => p.id === product.id);

        if (btn) {
          if (isSelected) {
            btn.classList.add("added");
            btn.innerHTML = `Added to Bundle <span class='icon-tick' style='margin-left:8px;'>✓</span>`;
          } else {
            btn.classList.remove("added");
            btn.innerHTML = `Add to Bundle <span class='icon-plus' style='margin-left:8px;'>+</span>`;
          }
        }
      });
    }

    function updateProgress() {
      const count = selectedProducts.length;
      const percentage = Math.min((count / DISCOUNT_THRESHOLD) * 100, 100);
      progressText.textContent = `${count} of ${DISCOUNT_THRESHOLD} products selected`;
      progressFill.style.width = `${percentage}%`;
    }

    function updateSelectedProducts() {
      if (selectedProducts.length === 0) {
        selectedProductsContainer.innerHTML = '<div class="empty-state">No products selected yet</div>';
        return;
      }

      selectedProductsContainer.innerHTML = selectedProducts
        .map(
          (product) => `
      <div class="selected-product">
        <div class="selected-product-image" style="background-image: url('${product.image}')"></div>
        <div class="selected-product-info">
          <div class="selected-product-name">${product.name}</div>
          <div class="selected-product-price">$${product.price.toFixed(2)} × ${product.quantity}</div>
          <div class="qty-controls">
            <button onclick="decreaseQty(${product.id})">−</button>
            <span class="qty-count">${product.quantity}</span>
            <button onclick="increaseQty(${product.id})">+</button>
            <button class="remove-btn" onclick="removeProduct(${product.id})" title="Remove" style="margin-left: 12px;">🗑️</button>
          </div>
        </div>
      </div>
    `
        )
        .join("");
    }

    function updatePricing() {
      const originalTotal = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const discountValue = originalTotal * DISCOUNT_PERCENTAGE;
      const hasDiscount = selectedProducts.length >= DISCOUNT_THRESHOLD;
      const finalTotal = hasDiscount ? originalTotal - discountValue : originalTotal;

      // Always show the discount row, but only apply discount if threshold met
      if (selectedProducts.length > 0) {
        discountAmount.textContent = hasDiscount
          ? `-$${discountValue.toFixed(2)} (${Math.round(DISCOUNT_PERCENTAGE * 100)}%)`
          : `-$${discountValue.toFixed(2)} (${Math.round(DISCOUNT_PERCENTAGE * 100)}%)`;
        discountAmount.parentElement.classList.add("discount-row");
      } else {
        discountAmount.textContent = "-$0.00 (0%)";
        discountAmount.parentElement.classList.remove("discount-row");
      }

      subtotalAmount.textContent = `$${finalTotal.toFixed(2)}`;
    }

    function updateProceedButton() {
      const count = selectedProducts.length;
      if (count >= DISCOUNT_THRESHOLD) {
        proceedBtn.disabled = false;
        proceedBtn.textContent = "Add Bundle to Cart";
      } else {
        proceedBtn.disabled = true;
        const remaining = DISCOUNT_THRESHOLD - count;
        proceedBtn.textContent = `Add ${remaining} More Item${remaining > 1 ? "s" : ""} to Proceed`;
      }
    }

    proceedBtn.addEventListener("click", function () {
      if (selectedProducts.length >= DISCOUNT_THRESHOLD) {
        console.log("Bundle created:", {
          products: selectedProducts,
          originalTotal: selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0),
          discount: selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) * DISCOUNT_PERCENTAGE,
          finalTotal: selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0) * (1 - DISCOUNT_PERCENTAGE)
        });

        alert("Bundle added to cart! Check console for details.");
      }
    });

    init();
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const productTableBody = document.getElementById("productTableBody");

    // Event listener for search input
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        if (query) {
            fetchProducts(query);
        } else {
            productTableBody.innerHTML = ""; // Clear table if search is empty
        }
    });

    // Fetch products from the Netlify function
    async function fetchProducts(query) {
        try {
            const response = await axios.get(`/.netlify/functions/shopifyProducts`, {
                params: { title: query } // Pass the search term as a query parameter
            });
            displayProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
            productTableBody.innerHTML = `<tr><td colspan="3" class="text-danger">Error fetching products</td></tr>`;
        }
    }

    // Display products in the table
    function displayProducts(products) {
        productTableBody.innerHTML = ""; // Clear existing results

        if (products.length === 0) {
            productTableBody.innerHTML = `<tr><td colspan="3" class="text-warning">No products found</td></tr>`;
            return;
        }

        products.forEach(product => {
            const title = product.title;
            const inventoryQty = product.variants[0].inventory_quantity;
            const imageUrl = product.images.length > 0 ? product.images[0].src : "https://via.placeholder.com/50";

            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${imageUrl}" alt="${title}" style="width: 50px; height: auto;"></td>
                <td>${title}</td>
                <td>${inventoryQty}</td>
            `;
            productTableBody.appendChild(row);
        });
    }
});

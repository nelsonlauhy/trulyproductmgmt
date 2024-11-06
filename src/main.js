async function fetchProducts() {
    const url = '/.netlify/functions/shopifyProducts'; // Use the Netlify function endpoint

    try {
        const response = await axios.get(url);
        displayProducts(response.data.products);
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("productList").innerHTML = `<li class="list-group-item text-danger">Error fetching products</li>`;
    }
}

// Function to display the fetched products
function displayProducts(products) {
    const productList = document.getElementById("productList");
    productList.innerHTML = '';
    products.forEach(product => {
        const title = product.title;
        const price = product.variants[0].price;
        const inventoryQty = product.variants[0].inventory_quantity;

        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerHTML = `
            <strong>Title:</strong> ${title}<br>
            <strong>Price:</strong> $${price}<br>
            <strong>Inventory Quantity:</strong> ${inventoryQty}
        `;
        productList.appendChild(listItem);
    });
}

// Fetch products on page load
fetchProducts();

const axios = require('axios');

exports.handler = async function(event, context) {
    const shopName = process.env.SHOP_NAME;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPassword = process.env.SHOPIFY_API_PASSWORD;

    const query = event.queryStringParameters.title;

    // Shopify API URL
    const url = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json?limit=50`;

    // Recursive function to fetch all pages
    async function fetchAllProducts(url, products = []) {
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiPassword
            }
        });

        // Combine current page products with accumulated products
        products = products.concat(response.data.products);

        // Check for pagination and continue fetching if more pages exist
        const nextLink = response.headers.link && response.headers.link.includes('rel="next"')
            ? response.headers.link.match(/<(.*?)>; rel="next"/)[1]
            : null;

        if (nextLink) {
            // Recursive call to fetch the next page
            return fetchAllProducts(nextLink, products);
        } else {
            // No more pages, return the accumulated products
            return products;
        }
    }

    try {
        // Fetch all products across pages
        let products = await fetchAllProducts(url);

        // Filter products by title if query is provided
        if (query) {
            products = products.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ products })
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching products' })
        };
    }
};

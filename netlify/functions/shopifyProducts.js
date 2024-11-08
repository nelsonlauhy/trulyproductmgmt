const axios = require('axios');

exports.handler = async function(event, context) {
    const shopName = process.env.SHOP_NAME;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPassword = process.env.SHOPIFY_API_PASSWORD;

    // Capture the search term and pagination parameters
    const query = event.queryStringParameters.title;
    const page = event.queryStringParameters.page || 1; // Default to page 1
    const limit = event.queryStringParameters.limit || 50; // Default to 50 items per page

    // Shopify API URL with pagination parameters
    const url = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json?limit=${limit}&page=${page}`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiPassword
            }
        });

        let products = response.data.products;

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

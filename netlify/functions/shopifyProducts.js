const axios = require('axios');

exports.handler = async function(event, context) {
    const shopName = process.env.SHOP_NAME;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPassword = process.env.SHOPIFY_API_PASSWORD;

    // Simple URL to fetch the first 50 products
    const url = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json?limit=50`;

    try {
        console.log("Requesting products from Shopify:", url); // Debugging log
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiPassword
            }
        });

        console.log("Fetched products count:", response.data.products.length); // Debugging log

        return {
            statusCode: 200,
            body: JSON.stringify({ products: response.data.products })
        };
    } catch (error) {
        console.error("Error fetching products:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching products', error: error.message })
        };
    }
};

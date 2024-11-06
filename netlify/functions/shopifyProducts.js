const axios = require('axios');

exports.handler = async function(event, context) {
    const shopName = process.env.SHOP_NAME;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPassword = process.env.SHOPIFY_API_PASSWORD;

    const url = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json`;

    try {
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiPassword
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching products' })
        };
    }
};

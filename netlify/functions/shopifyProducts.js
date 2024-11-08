const axios = require('axios');

exports.handler = async function(event, context) {
    const shopName = process.env.SHOP_NAME;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPassword = process.env.SHOPIFY_API_PASSWORD;

    // Log incoming parameters for debugging
    const query = event.queryStringParameters.title;
    const page = event.queryStringParameters.page || 1;
    const limit = event.queryStringParameters.limit || 50;
    console.log("Received query parameters:", { query, page, limit });

    // Construct the Shopify API URL
    let url = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json?limit=${limit}&page=${page}`;
    console.log("Constructed URL:", url);

    try {
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiPassword
            }
        });

        let products = response.data.products;
        console.log("Fetched products count:", products.length);

        // Filter products if a search query is provided
        if (query) {
            products = products.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase())
            );
            console.log("Filtered products count:", products.length);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ products })
        };
    } catch (error) {
        // Log the error details for debugging
        console.error("Error fetching products:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching products', error: error.message })
        };
    }
};

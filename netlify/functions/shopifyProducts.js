const axios = require('axios');

exports.handler = async function(event, context) {
    const shopName = process.env.SHOP_NAME;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const apiPassword = process.env.SHOPIFY_API_PASSWORD;
    
    // Capture the search term from the query parameters
    const query = event.queryStringParameters.title;
    
    // Construct the URL, adding the title filter if a query is provided
    let url = `https://${shopName}.myshopify.com/admin/api/2023-07/products.json`;
    if (query) {
        url += `?title=${encodeURIComponent(query)}`;
    }
    
    console.log("Request URL:", url); // Log the URL for debugging

    try {
        const response = await axios.get(url, {
            auth: {
                username: apiKey,
                password: apiPassword
            }
        });

        console.log("Response Data:", response.data); // Log response data for debugging

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

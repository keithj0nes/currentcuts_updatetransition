SELECT DISTINCT on (products.id) products.*, prices.price FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
WHERE active = true AND (archived IS NULL OR archived = false)
ORDER BY products.id, prices.price LIMIT 3 offset $1;

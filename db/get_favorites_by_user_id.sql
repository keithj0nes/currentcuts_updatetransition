SELECT DISTINCT on (favorites.id) products.*, prices.price FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN favorites ON favorites.product_id = products.id
WHERE user_id = $1 AND (products.archived IS NULL OR products.archived = false)
ORDER BY favorites.id ASC, prices.price

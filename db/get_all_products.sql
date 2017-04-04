-- SELECT * FROM products where active = true;
-- ORDER BY random()
-- LIMIT 3;

-- SELECT first(products.id, products.name, products.img1, prices.price) FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId

SELECT DISTINCT on (products.id) products.*, prices.price FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
ORDER BY products.id, prices.price

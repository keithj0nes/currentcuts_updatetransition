-- SELECT DISTINCT on (products.id) products.*, prices.price FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId
-- ORDER BY products.id, prices.price

-- SELECT * FROM products WHERE NOT archived = true;
SELECT * FROM products WHERE (archived IS NULL OR archived = false)

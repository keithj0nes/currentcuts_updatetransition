-- SELECT DISTINCT on (products.id) products.*, prices.price FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId
-- WHERE UPPER(name) LIKE UPPER($1) AND active = true AND (archived IS NULL OR archived = false)
-- ORDER BY products.id, prices.price;

-- Search products for name or for tag
SELECT DISTINCT on (products.id) products.*, prices.price FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
WHERE (UPPER(name) LIKE UPPER($1) OR UPPER(tags) LIKE UPPER($1)) AND active = true AND (archived IS NULL OR archived = false)
ORDER BY products.id, prices.price;

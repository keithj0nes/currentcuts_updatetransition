-- SELECT * FROM products WHERE UPPER(name) LIKE UPPER($1);


SELECT DISTINCT on (products.id) products.*, prices.price FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
WHERE UPPER(name) LIKE UPPER($1)
ORDER BY products.id, prices.price;

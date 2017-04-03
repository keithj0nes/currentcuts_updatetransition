SELECT * FROM products WHERE id = $1;


-- SELECT products.*, prices.price, sizes.height, sizes.width
-- FROM product_price_size
-- INNER JOIN products ON product_price_size.productId = products.id
-- INNER JOIN prices ON product_price_size.priceId = prices.id
-- INNER JOIN sizes  ON product_price_size.sizeId = sizes.id
-- WHERE id = $1


-- SELECT DISTINCT on (products.id) products.*, products.name, products.img1, prices.price FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId
--
-- WHERE products.id = $1
--
--
-- SELECT products.name, prices.price, sizes.height, sizes.width FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId
-- INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
-- WHERE products.id = 1
--
--
-- SELECT DISTINCT ON (products) products.name, prices.price, sizes.height, sizes.width FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId
-- INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
-- ORDER BY products, prices.price

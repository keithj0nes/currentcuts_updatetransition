SELECT prices.price, sizes.height, sizes.width FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
WHERE products.id = $1
ORDER BY prices.price

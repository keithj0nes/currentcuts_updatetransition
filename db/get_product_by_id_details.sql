SELECT prices.price, sizes.height, sizes.width FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
WHERE products.id = $1
ORDER BY prices.price



SELECT prices.price, sizes.height, sizes.width, categories.name FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
INNER JOIN product_category ON products.id = product_category.product_id
INNER JOIN categories ON categories.id = product_category.category_id
WHERE products.id = $1
ORDER BY prices.price



SELECT DISTINCT on (products.id) products.*, prices.price FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN product_category ON products.id = product_category.product_id
INNER JOIN categories ON categories.id = product_category.category_id
WHERE active = true AND (archived IS NULL OR archived = false) AND categories.name = $1
ORDER BY products.id, prices.price


SELECT categories.name FROM categories
WHERE categories.parent_id = 2;

SELECT prices.price, sizes.height, sizes.width FROM products
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN sizes ON sizes.id = product_price_size.sizeId
WHERE products.id = $1
order by product_price_size.id















--get open orders

select * from orders

select orders.id, orders.datesold, orders.completed, orders.tracking, orders.datecompleted,
shipping.price,
users.email, guest_users.email,
products.name,
prices.price, sizes.height, sizes.width from orders
inner join shipping on shipping.id = orders.shippingid
inner join users on users.id = orders.userid
inner join guest_users on guest_users.id = orders.guestuserid
inner join orderline on orderline.orderid = orders.id
inner join products on products.id = orderline.productid
INNER JOIN product_price_size ON products.id = product_price_size.productId
INNER JOIN prices ON prices.id = product_price_size.priceId
INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
where completed = false

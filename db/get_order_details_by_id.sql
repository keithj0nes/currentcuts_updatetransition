-- SELECT * FROM orders WHERE id = $1
--
--
--
-- select * from orders
-- join users on orders.userid = users.id
-- join orderline on orders.id = orderline.orderid
-- join products on orderline.productid = products.id
-- where orders.id = 68
--
--
-- SELECT prices.price, sizes.height, sizes.width FROM products
-- INNER JOIN product_price_size ON products.id = product_price_size.productId
-- INNER JOIN prices ON prices.id = product_price_size.priceId
-- INNER JOIN sizes  ON sizes.id  = product_price_size.sizeId
-- WHERE products.id = $1
-- ORDER BY prices.price
--
-- -- I need:
-- --   product name
-- --   product image
-- --   product color
-- --   product price
-- --   product size
-- --   product quantity
-- --   order date
-- --   total price
-- --   shipping price
--
--
-- select * from orderline
-- join orders on orderline.orderid = orders.id
-- join products on orderline.productid = products.id
-- join product_price_size on products.id = product_price_size.productid
-- where orders.id = 69

-- THIS ONE SHOULD WORK!
select products.name, products.img1, sizes.height, sizes.width, prices.price, orderline.quantsold, orderline.color, orders.userid, orders.datesold, orders.ordertotal, shipping.price AS shipping from orderline
join orders on orderline.orderid = orders.id
join products on orderline.productid = products.id
join sizes on orderline.sizeid = sizes.id
join prices on orderline.priceid = prices.id
join shipping on orders.shippingid = shipping.id
where orders.id = $1 and orders.userid = $2;

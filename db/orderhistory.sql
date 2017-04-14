-- select * from users
-- join orders on users.id = orders.userid
-- join orderline on orders.id = orderline.orderid
-- join products on orderline.productid = products.id
-- WHERE users.id = $1;


SELECT orders.id, orders.datesold, orders.ordertotal FROM orders
JOIN users on orders.userId = users.id
WHERE users.id = $1

-- select * from orders
-- join users on orders.userid = users.id
-- join orderline on orders.id = orderline.orderid
-- join products on orderline.productid = products.id


-- select distinct on (orders.id) * from orders
-- join orderline on orders.id = orderline.orderid

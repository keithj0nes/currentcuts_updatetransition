select * from users
join orders on users.id = orders.userid
join orderline on orders.id = orderline.orderid
join products on orderline.productid = products.id

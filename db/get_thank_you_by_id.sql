select products.name, products.img1, sizes.height, sizes.width, prices.price, orderline.quantsold, orderline.color, orders.userid, orders.datesold, orders.ordertotal, shipping.price AS shipping from orderline
join orders on orderline.orderid = orders.id
join products on orderline.productid = products.id
join sizes on orderline.sizeid = sizes.id
join prices on orderline.priceid = prices.id
join shipping on orders.shippingid = shipping.id
where (orders.id = $1) and (orders.tyexpired is null or orders.tyexpired = false);

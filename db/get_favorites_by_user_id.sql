SELECT products.name, products.img1, products.id FROM favorites
INNER JOIN products ON favorites.product_id = products.id
WHERE user_id = $1 ORDER BY favorites.id ASC

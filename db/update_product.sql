UPDATE products
SET name = $1,
    description = $2,
    price = $3,
    img1 = $4,
    img2 = $5
WHERE id = $6;

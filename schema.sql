CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price INT,
  img1 TEXT,
  img2 TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName TEXT,
  lastName TEXT,
  email TEXT,
  password TEXT,
  paypalId TEXT,
  registered TIMESTAMP
);

-- CREATE TABLE cart (
--   id SERIAL PRIMARY KEY,
--   productId INTEGER REFERENCES products(id),
--   userId INTEGER REFERENCES users(id),
--   totalPrice INT
-- );

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  dateSold TIMESTAMP,
);

CREATE TABLE orderline (
  id SERIAL PRIMARY KEY,
  orderId INTEGER REFERENCES orders(id),
  productId INTEGER REFERENCES products(id),
  quantSold INT
);


INSERT INTO products (name, description, price, img)
VALUES ('Take A Hike', 'Take A Hike vinyl decal', 4, 'https://img0.etsystatic.com/108/0/9461344/il_570xN.895019534_43ya.jpg', 'https://img0.etsystatic.com/132/0/9461344/il_570xN.895019502_41yc.jpg');

INSERT INTO products (name, description, price, img)
VALUES ('Wanderlust', 'Wanderlust vinyl decal', 4, 'https://img0.etsystatic.com/134/0/9461344/il_570xN.895023586_r5dq.jpg', 'https://img0.etsystatic.com/122/0/9461344/il_570xN.895023562_a9ks.jpg');

INSERT INTO products (name, description, price, img)
VALUES ('I Hike Washington', 'I Hike Washington vinyl decal', 4, 'https://img1.etsystatic.com/138/0/9461344/il_570xN.890339355_7dv9.jpg', 'https://img1.etsystatic.com/119/0/9461344/il_570xN.890339397_e5qn.jpg');

INSERT INTO products (name, description, price, img)
VALUES ('Deathly Hallows', 'Deathly Hallows vinyl decal', 4, 'https://img1.etsystatic.com/033/0/9461344/il_570xN.626310097_fxdm.jpg', 'https://img1.etsystatic.com/035/0/9461344/il_570xN.626310141_t5gw.jpg');

INSERT INTO products (name, description, price, img)
VALUES ('Seattle Skyline Heartbeat', 'Seattle Skyline Heartbeat vinyl decal', 4, 'https://img0.etsystatic.com/049/0/9461344/il_570xN.662988360_42e1.jpg', 'https://img0.etsystatic.com/049/0/9461344/il_570xN.662988360_42e1.jpg');














--rename img to img1 in products table
ALTER TABLE products
RENAME img TO img1;

--add img2 column to products table
ALTER TABLE products
ADD img2 TEXT

--add images to img2 column
UPDATE products
SET img2 = 'https://img0.etsystatic.com/132/0/9461344/il_570xN.895019502_41yc.jpg'
WHERE id = 1;

UPDATE products
SET img2 = 'https://img0.etsystatic.com/122/0/9461344/il_570xN.895023562_a9ks.jpg'
WHERE id = 2;

UPDATE products
SET img2 = 'https://img1.etsystatic.com/119/0/9461344/il_570xN.890339397_e5qn.jpg'
WHERE id = 3;

UPDATE products
SET img2 = 'https://img1.etsystatic.com/035/0/9461344/il_570xN.626310141_t5gw.jpg'
WHERE id = 4;

UPDATE products
SET img2 = 'https://img0.etsystatic.com/049/0/9461344/il_570xN.662988360_42e1.jpg'
WHERE id = 5;

--update first image
UPDATE products
SET img = 'https://img0.etsystatic.com/108/0/9461344/il_570xN.895019534_43ya.jpg'
WHERE id = 1;


-- how to add more products from a backend user login

-- Copy and paste this script in postgres to create test data in database


-- DROP existing TABLES, to clean out the database	=	=	=	=	=
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS orderline CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;

-- CREATE TABLES	=	=	=	=	=	=	=	=	=	=	=	=	=

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName TEXT,
  lastName TEXT,
  email TEXT,
  password TEXT,
  paypalId TEXT,
  -- facebookId TEXT,
  registered TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  img1 TEXT,
  img2 TEXT,
  isActive BOOLEAN,
  -- size INTEGER REFERENCES sizes(id),
  -- price INTEGER REFERENCES prices(id)
);

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  height INT,
  width INT,
  garmentSize TEXT
);

CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  price INT
);

CREATE TABLE product_price_size (
  id SERIAL PRIMARY KEY,
  productId INTEGER REFERENCES products(id),
  priceId INTEGER REFERENCES prices(id),
  sizeId INTEGER REFERENCES sizes(id)
);


INSERT INTO products (name, description, img1, img2, isActive)
VALUES ('Take A Hike', 'Take A Hike vinyl decal', 'https://img0.etsystatic.com/108/0/9461344/il_570xN.895019534_43ya.jpg', 'https://img0.etsystatic.com/132/0/9461344/il_570xN.895019502_41yc.jpg', true);
INSERT INTO products (name, description, img1, img2, isActive)
VALUES ('Wanderlust', 'Wanderlust vinyl decal', 'https://img0.etsystatic.com/134/0/9461344/il_570xN.895023586_r5dq.jpg', 'https://img0.etsystatic.com/122/0/9461344/il_570xN.895023562_a9ks.jpg', true);
INSERT INTO products (name, description, img1, img2, isActive)
VALUES ('I Hike Washington', 'I Hike Washington vinyl decal', 'https://img1.etsystatic.com/138/0/9461344/il_570xN.890339355_7dv9.jpg', 'https://img1.etsystatic.com/119/0/9461344/il_570xN.890339397_e5qn.jpg', true);
INSERT INTO products (name, description, img1, img2, isActive)
VALUES ('Deathly Hallows', 'Deathly Hallows vinyl decal', 'https://img1.etsystatic.com/033/0/9461344/il_570xN.626310097_fxdm.jpg', 'https://img1.etsystatic.com/035/0/9461344/il_570xN.626310141_t5gw.jpg', true);
INSERT INTO products (name, description, img1, img2, isActive)
VALUES ('Seattle Skyline Heartbeat', 'Seattle Skyline Heartbeat vinyl decal', 'https://img0.etsystatic.com/049/0/9461344/il_570xN.662988360_42e1.jpg', 'https://img0.etsystatic.com/049/0/9461344/il_570xN.662988360_42e1.jpg', true);
INSERT INTO products (name, description, img1, img2, isActive)
VALUES ('Snowboard Chair Lift Dual', 'Snowboard Chair Lift Dual vinyl decal', 'https://img0.etsystatic.com/106/0/9461344/il_570xN.909377050_e19d.jpg', 'https://img1.etsystatic.com/135/0/9461344/il_570xN.909131109_py9k.jpg', true);

INSERT INTO prices (price) VALUES (4);
INSERT INTO prices (price) VALUES (6);
INSERT INTO prices (price) VALUES (8);
INSERT INTO prices (price) VALUES (16);
INSERT INTO prices (price) VALUES (20);
INSERT INTO prices (price) VALUES (2);


INSERT INTO sizes (height, width, garmentSize) VALUES (3, 3, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (4, 5, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (7, 2, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (10, 10, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (15, 20, null);


INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 1, 1);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 2, 2);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 3, 3);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 2, 3);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 2, 2);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 1, 3);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 4, 4);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 5, 5);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 6, 1);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (3, 2, 3);






SELECT products.name, prices.price, sizes.height, sizes.width
FROM product_price_size
INNER JOIN products ON product_price_size.productId = products.id
INNER JOIN prices ON product_price_size.priceId = prices.id
INNER JOIN sizes  ON product_price_size.sizeId = sizes.id

SELECT * FROM products
INNER JOIN prices ON prices.id = product_price_size.productId

SELECT * FROM products
INNER JOIN product_price_size ON prices.id = product_price_size.productId
INNER JOIN prices ON

select * from users
join orders on users.id = orders.userid
join orderline on orders.id = orderline.orderid
join products on orderline.productid = products.id


SELECT Activity.ActivityText as Activity, Action.ActionText as ApplicableAction
FROM ActivityAction
    INNER JOIN Activity
        ON ActivityAction.ActivityId = Activity.ActivityId
    INNER JOIN Action
        ON ActivityAction.ActionId = Action.ActionId



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

--update multiple product id's with true
UPDATE products
SET active = true
WHERE id IN (2,3,4,5,90,79,80,81,82,83,84,95,6);

-- how to add more products from a backend user login













------dummy data for sqlfiddle---

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  img1 TEXT,
  img2 TEXT,
  isActive BOOLEAN
);

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  height INT,
  width INT,
  garmentSize TEXT
);

CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  price INT
);

CREATE TABLE product_price_size (
  id SERIAL PRIMARY KEY,
  productId INTEGER REFERENCES products(id),
  priceId INTEGER REFERENCES prices(id),
  sizeId INTEGER REFERENCES sizes(id)
);


INSERT INTO products (name, description, img1, img2)
VALUES ('Take A Hike', 'Take A Hike vinyl decal', 'https://img0.etsystatic.com/108/0/9461344/il_570xN.895019534_43ya.jpg', 'https://img0.etsystatic.com/132/0/9461344/il_570xN.895019502_41yc.jpg');
INSERT INTO products (name, description, img1, img2)
VALUES ('Wanderlust', 'Wanderlust vinyl decal', 'https://img0.etsystatic.com/134/0/9461344/il_570xN.895023586_r5dq.jpg', 'https://img0.etsystatic.com/122/0/9461344/il_570xN.895023562_a9ks.jpg');

INSERT INTO prices (price) VALUES (4);
INSERT INTO prices (price) VALUES (6);
INSERT INTO prices (price) VALUES (8);

INSERT INTO sizes (height, width, garmentSize) VALUES (3, 3, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (4, 5, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (7, 2, null);

INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 1, 1);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 2, 2);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 3, 3);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 2, 3);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 2, 2);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 1, 3);

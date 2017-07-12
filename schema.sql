-- Copy and paste this script in postgres to create test data in database


-- DROP existing TABLES, to clean out the database	=	=	=	=	=

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS product_price_size CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS orderline CASCADE;
DROP TABLE IF EXISTS shipping CASCADE;

-- CREATE TABLES	=	=	=	=	=	=	=	=	=	=	=	=	= = = = = = = = =

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstName TEXT,
  lastName TEXT,
  email TEXT,
  password TEXT,
  password_salt TEXT,
  facebookId TEXT,
  registered TIMESTAMP,
  admin BOOLEAN
);

CREATE TABLE guest_users (
  id SERIAL PRIMARY KEY,
  email TEXT
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  img1 TEXT,
  imgmainvector TEXT,
  imgoutlinevector TEXT,
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

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  guestuserid INTEGER REFERENCES guest_users(id),
  dateSold TIMESTAMP,
  ordertotal INT,
  shippingid INTEGER REFERENCES shipping(id)
  tyexpired BOOLEAN
);

CREATE TABLE orderline (
  id SERIAL PRIMARY KEY,
  orderId INTEGER REFERENCES orders(id),
  productId INTEGER REFERENCES products(id),
  quantSold INT,
  sizeId INTEGER REFERENCES sizes(id),
  pricesId INTEGER REFERENCES prices(id),
  color TEXT
);

CREATE TABLE shipping (
  id SERIAL PRIMARY KEY,
  price NUMERIC --allows decimals
);


-- INSERT DATA	=	=	=	=	=	=	=	=	=	=	=	=	= = = = = = = = = =

INSERT INTO products (name, description, img1, imgmainvector, isActive, imgoutlinevector)
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
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (4, 2, 3);

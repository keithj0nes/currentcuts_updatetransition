-- Copy and paste this script in postgres to create test data in database


-- DROP existing TABLES, to clean out the database	=	=	=	=	=
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS guest_users CASCADE;
DROP TABLE IF EXISTS order_addresses CASCADE;
DROP TABLE IF EXISTS orderline CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_category CASCADE;
DROP TABLE IF EXISTS product_price_size CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS prices CASCADE;
DROP TABLE IF EXISTS shipping CASCADE;
DROP TABLE IF EXISTS sizes CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- CREATE TABLES	=	=	=	=	=	=	=	=	=	=	=	=	= = = = = = = = =

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT,
  parent_id INTEGER REFERENCES categories(id)
);

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id)
);

CREATE TABLE guest_users (
  id SERIAL PRIMARY KEY,
  email TEXT
);

CREATE TABLE order_addresses (
  id SERIAL PRIMARY KEY,
  firstname TEXT,
  lastname TEXT,
  address_one TEXT,
  address_two TEXT,
  city TEXT,
  state TEXT,
  zipcode TEXT
);

CREATE TABLE orderline (
  id SERIAL PRIMARY KEY,
  orderid INTEGER REFERENCES orders(id),
  productid INTEGER REFERENCES products(id),
  quantsold INT,
  sizeid INTEGER REFERENCES sizes(id),
  priceid INTEGER REFERENCES prices(id),
  color TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(id),
  datesold TIMESTAMP,
  ordertotal DECIMAL(8,2),
  shippingid INTEGER REFERENCES shipping(id),
  guestuserid INTEGER REFERENCES guest_users(id),
  tyexpired BOOLEAN,
  completed BOOLEAN,
  tracking TEXT,
  datecompleted TIMESTAMP,
  msg_to_buyer TEXT,
  msg_to_seller TEXT,
  orderaddressesid INTEGER REFERENCES order_addresses(id)
);

CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  price DECIMAL(6,2)
);

CREATE TABLE product_category (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE product_price_size (
  id SERIAL PRIMARY KEY,
  productid INTEGER REFERENCES products(id),
  priceid INTEGER REFERENCES prices(id),
  sizeid INTEGER REFERENCES sizes(id)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  img1 TEXT,
  imgmainvector TEXT,
  imgoutlinevector TEXT,
  active BOOLEAN,
  archived BOOLEAN
);

CREATE TABLE shipping (
  id SERIAL PRIMARY KEY,
  price DECIMAL(6,2)
);

CREATE TABLE sizes (
  id SERIAL PRIMARY KEY,
  height DECIMAL(6,1),
  width DECIMAL(6,1),
  garmentSize TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname TEXT,
  lastname TEXT,
  email TEXT,
  pass_hash TEXT,
  pass_salt TEXT,
  facebookid TEXT,
  registered TIMESTAMP,
  admin BOOLEAN,
  resettoken TEXT
);

-- NEW -> ADD TO ELEPHANTSQL

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE product_tag (
  id SERIAL PRIMARY KEY,
  productid INTEGER REFERENCES products(id),
  tagid INTEGER REFERENCES tags(id)
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

--new inserts since updating integers to decimals on each table

INSERT INTO prices (price) VALUES (4);
INSERT INTO prices (price) VALUES (6);
INSERT INTO prices (price) VALUES (8);
INSERT INTO prices (price) VALUES (16.5);
INSERT INTO prices (price) VALUES (20.99);
INSERT INTO prices (price) VALUES (2);

INSERT INTO sizes (height, width, garmentSize) VALUES (3, 3.5, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (4.2, 5, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (7, 2, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (10.8, 10, null);
INSERT INTO sizes (height, width, garmentSize) VALUES (15, 20.5, null);

INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 11, 11);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 12, 12);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 13, 13);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 12, 13);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 12, 12);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 11, 13);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 14, 14);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (2, 15, 15);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (1, 16, 11);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (3, 12, 13);
INSERT INTO product_price_size (productId, priceId, sizeid) VALUES (4, 12, 14);




INSERT INTO categories (name, parent_id) VALUES ('Schools', null);
INSERT INTO categories (name, parent_id) VALUES ('sports', null);
INSERT INTO categories (name, parent_id) VALUES ('Animals', null);
INSERT INTO categories (name, parent_id) VALUES ('Cars', null);


------- not creating sub categories for now
-- INSERT INTO categories (name, parent_id) VALUES ('NFL', 2);
-- INSERT INTO categories (name, parent_id) VALUES ('Seahawks', 5);
-- INSERT INTO categories (name, parent_id) VALUES ('action_sports', 2);


--seahawks city associated with seahawks category
INSERT INTO product_category (product_id, category_id) VALUES (99, 2);

INSERT INTO product_category (product_id, category_id) VALUES (6, 2);

--
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS guest_users CASCADE;
-- DROP TABLE IF EXISTS order_addresses CASCADE;
-- DROP TABLE IF EXISTS orderline CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS product_category CASCADE;
-- DROP TABLE IF EXISTS product_price_size CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS prices CASCADE;
-- DROP TABLE IF EXISTS shipping CASCADE;
-- DROP TABLE IF EXISTS sizes CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
--
--
-- -- CREATE TABLES	=	=	=	=	=	=	=	=	=	=	=	=	= = = = = = = = =
--
-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   firstname TEXT,
--   lastname TEXT,
--   email TEXT,
--   pass_hash TEXT,
--   pass_salt TEXT,
--   facebookid TEXT,
--   registered TIMESTAMP,
--   admin BOOLEAN,
--   resettoken TEXT
-- );
--
-- CREATE TABLE products (
--   id SERIAL PRIMARY KEY,
--   name TEXT,
--   description TEXT,
--   img1 TEXT,
--   imgmainvector TEXT,
--   imgoutlinevector TEXT,
--   active BOOLEAN,
--   archived BOOLEAN
-- );CREATE TABLE shipping (
--   id SERIAL PRIMARY KEY,
--   price DECIMAL(6,2)
-- );CREATE TABLE guest_users (
--   id SERIAL PRIMARY KEY,
--   email TEXT
-- );
-- CREATE TABLE order_addresses (
--   id SERIAL PRIMARY KEY,
--   firstname TEXT,
--   lastname TEXT,
--   address_one TEXT,
--   address_two TEXT,
--   city TEXT,
--   state TEXT,
--   zipcode TEXT
-- );
-- CREATE TABLE sizes (
--   id SERIAL PRIMARY KEY,
--   height DECIMAL(6,1),
--   width DECIMAL(6,1),
--   garmentSize TEXT
-- );
--
-- CREATE TABLE prices (
--   id SERIAL PRIMARY KEY,
--   price DECIMAL(6,2)
-- );
-- CREATE TABLE orders (
--   id SERIAL PRIMARY KEY,
--   userid INTEGER REFERENCES users(id),
--   datesold TIMESTAMP,
--   ordertotal DECIMAL(8,2),
--   shippingid INTEGER REFERENCES shipping(id),
--   guestuserid INTEGER REFERENCES guest_users(id),
--   tyexpired BOOLEAN,
--   completed BOOLEAN,
--   tracking TEXT,
--   datecompleted TIMESTAMP,
--   msg_to_buyer TEXT,
--   msg_to_seller TEXT,
--   orderaddressesid INTEGER REFERENCES order_addresses(id)
-- );
--
--
-- CREATE TABLE categories (
--   id SERIAL PRIMARY KEY,
--   name TEXT,
--   parent_id INTEGER REFERENCES categories(id)
-- );
--
-- CREATE TABLE favorites (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id),
--   product_id INTEGER REFERENCES products(id)
-- );
--
--
--
--
-- CREATE TABLE orderline (
--   id SERIAL PRIMARY KEY,
--   orderid INTEGER REFERENCES orders(id),
--   productid INTEGER REFERENCES products(id),
--   quantsold INT,
--   sizeid INTEGER REFERENCES sizes(id),
--   priceid INTEGER REFERENCES prices(id),
--   color TEXT
-- );
--
--
--
--
-- CREATE TABLE product_category (
--   id SERIAL PRIMARY KEY,
--   product_id INTEGER REFERENCES products(id),
--   category_id INTEGER REFERENCES categories(id)
-- );
--
-- CREATE TABLE product_price_size (
--   id SERIAL PRIMARY KEY,
--   productid INTEGER REFERENCES products(id),
--   priceid INTEGER REFERENCES prices(id),
--   sizeid INTEGER REFERENCES sizes(id)
-- );
--
--
--

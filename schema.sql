CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  description TEXT,
  price INT,
  img TEXT
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


INSERT INTO products
(name, description, price, img)
VALUES ("Take A Hike", "Take A Hike vinyl decal", [4,6,7], "urlgoesheresomehow")



-- how to add more products from a backend user login

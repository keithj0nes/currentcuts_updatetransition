INSERT INTO users (firstname, lastname, email, facebookid, registered)
VALUES ($1, $2, $3, $4, now());


--
--
-- INSERT INTO users (firstname, lastname, email, password, facebookid, registered)
-- VALUES ('Keith', 'Jones', 'test@test.com', null, '2323535131221', now());

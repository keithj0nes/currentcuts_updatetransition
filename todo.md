# To Do list

### Admin Page

- [ ] Create current orders tab

- [ ] USPS developer - allow shipping labels to be purchased through admin page


### Cart page

- [x] Email alerts (to me and purchaser) once order is placed (nodemailer) 4/4/17

- [x] Allow for message note to be sent during checkout 4/4/17

- [ ] Update quantity via 'update cart' button

- [x] Checkout as guest 6/28/17 <br>
  <strike> [ ] Create 'guest' user to default to if 'checkout as guest' is selected </strike>
  - [x] Guest user email stored to Guest User table to differentiate orders 6/29/17

- [ ] Use Square to process payments
  - [ ] Create inline purchase option (instead of stripe popup)

- [x] Create Thank You page to redirect to after order transaction is successful 7/5/17
  - [x] Page should pull order id with order details 7/6/17


### Users

- [ ] Allow user to edit stored email in Account Settings

- [ ] Create log in with Google

- [ ] Create log in with Twitter

- [ ] Once using Passport LocalAuth, confirm hash and salting of passwords

- [ ] Allow users to delete their accounts


### Tables

- [x] Create table to allow for different product **prices** 4/3/17

- [x] Create table to allow for different product **sizes** 4/3/17

- [x] Create table that joins **prices** and **sizes** with a **product** 4/3/17

- [x] Create Guest User table for guest checkout users 6/28/17

- [ ] Create shipping profiles table for quick shipping
  - [ ] Join to Orders table

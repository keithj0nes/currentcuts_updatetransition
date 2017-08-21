# To Do list

### Universal

- [x] Streamline modals using directive - 8/20/17

### Admin Page

- [ ] USPS developer - allow shipping labels to be purchased through admin page

- [ ] Create current orders tab
  - [ ] Set datecompleted timestamp once completed is checked true
  - [ ] Allow tracking number to be entered once completed
  - [ ] Use nodemailer to send follow up email to email associated with order

- [ ] Create completed orders tab

- [x] Product information 8/9/17
  - [x] Set categories to specific product 8/9/17
  - [x] Add sizes and prices to specific product 7/23/17
  - [x] Delete sizes and prices to specific product 7/24/17
  - [x] Set active / inactive to specific product 7/25/17



### Cart page

- [ ] Use Square to process payments
  - [ ] Create inline purchase option (instead of stripe popup)

- [ ] Create form validity function - alert with inline styles (required tag not supported in all browsers)

- [x] Email alerts (to me and purchaser) once order is placed (nodemailer) 4/4/17

- [x] Allow for message note to be sent during checkout 4/4/17

- [x] Checkout as guest 6/28/17 <br>
  - [x] Guest user email stored to Guest User table to differentiate orders 6/29/17

- [x] Create Thank You page to redirect to after order transaction is successful 7/5/17
  - [x] Page should pull order id with order details 7/6/17

  - [x] Update quantity via 'update cart' button 7/11/17



### Users

- [ ] Create log in with Google

- [ ] Create log in with Twitter

- [ ] Once using Passport LocalAuth, confirm hash and salting of passwords

- [ ] Allow users to delete their accounts

- [ ] Sign up with Twitter/Google/Facebook pulls guest orders specified with email

- [x] Allow users to like/favorite products 7/12/17
  - [x] Show total likes/favorites on product page 7/12/17
  - [x] Create page to show all products user has liked 7/15/17

- [x] Allow user to edit stored email in Account Settings 7/9/17
  - [x] Check db to make sure email is not already taken 7/12/17



### Tables

- [ ] Create shipping profiles table for quick shipping
  - [ ] Join to Orders table

- [ ] Add new order id column to Orders table to display unique order id.

- [ ] Create Categories table and Product_Category joiner table

- [x] Create table to allow for different product **prices** 4/3/17

- [x] Create table to allow for different product **sizes** 4/3/17

- [x] Create table that joins **prices** and **sizes** with a **product** 4/3/17

- [x] Create Guest User table for guest checkout users 6/28/17

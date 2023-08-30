Feature: Signup

Scenario: Signup a new user
  Given I visit the homepage
  When I click the "Sign Up" button
  And I enter a random email
  And I enter a random password
  And I click the "Sign Up" button
  Then I should see the "Sign Out" button

Scenario: Signup with an existing email
  Given I visit the homepage
  When I click the "Sign Up" button
  And I enter the existing email
  And I enter a random password
  And I click the "Sign Up" button
  Then I should see an error message indicating the email already exists

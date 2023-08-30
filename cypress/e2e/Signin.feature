Feature: Sign In

    Scenario: User signs in successfully
        Given I am on the homepage
        When I sign in as a user
        Then I should be signed in

    Scenario: User fails to sign in with wrong password
        Given I am on the homepage
        When I attempt to sign in with wrong password
        Then I should see an error message with code 401 and text "Invalid email or password"

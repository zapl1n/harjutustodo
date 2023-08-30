Feature: Add Items
   As a user I can add items to todo list

    Scenario: Add an item
        Given I am signed in
        When I add an item with the name "Cypress Test Item"
        Then I should see the item "Cypress Test Item" in the item list

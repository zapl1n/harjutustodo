Feature: List Items

  Scenario: Verify items are not visible when not signed in
    Given I am not signed in
    Then I should not see any items in the item list

  Scenario: Add an item to the list when signed in
    Given I am signed in
    When I add an item with the name "Item A"
    Then I should see the item "Item A" in the item list

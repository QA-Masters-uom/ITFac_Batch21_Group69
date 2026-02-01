Feature: User Plant Permissions (UI)

  @Tester_204081G @UI
  Scenario: Verify User can view available plants
    Given I am logged in as "normal"
    When I go to the "Plants" page
    Then I should see the plant list

  @Tester_204081G @UI
  Scenario: Verify User can search plants
    Given I am logged in as "normal"
    And a plant exists named "UserSearch"
    When I go to the "Plants" page
    And I search plants for "UserSearch"
    Then only plants matching "UserSearch" should be shown

  @Tester_204081G @UI
  Scenario: Verify User cannot add a plant
    Given I am logged in as "normal"
    When I go to the "Plants" page
    Then the "Add Plant" option should be hidden or disabled

  @Tester_204081G @UI
  Scenario: Verify User cannot edit a plant
    Given I am logged in as "normal"
    When I go to the "Plants" page
    Then the "Edit" option should be hidden or disabled

  @Tester_204081G @UI
  Scenario: Verify User cannot delete a plant
    Given I am logged in as "normal"
    When I go to the "Plants" page
    Then the "Delete" option should be hidden or disabled

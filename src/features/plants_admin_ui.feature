Feature: Admin Plant Management (UI)

  @Tester_204081G @UI
  Scenario: Verify Admin can add a new plant
    Given I am logged in as "admin"
    When I go to the "Plants" management page
    And I add a new plant with:
      | name        | category | price | description          |
      | Aloe Vera   | Indoor   | 1200  | Easy indoor plant    |
    Then I should see the plant "Aloe Vera" in the plant list

  @Tester_204081G @UI
  Scenario: Verify Admin can edit an existing plant
    Given I am logged in as "admin"
    And a plant exists named "Aloe Vera"
    When I go to the "Plants" management page
    And I edit plant "Aloe Vera" to:
      | name      | category | price | description               |
      | Aloe Pro  | Indoor   | 1500  | Updated description       |
    Then I should see the plant "Aloe Pro" in the plant list

  @Tester_204081G @UI
  Scenario: Verify Admin can delete a plant
    Given I am logged in as "admin"
    And a plant exists named "Aloe Delete"
    When I go to the "Plants" management page
    And I delete plant "Aloe Delete"
    Then I should not see the plant "Aloe Delete" in the plant list

  @Tester_204081G @UI
  Scenario: Verify Admin cannot add a plant with duplicate name
    Given I am logged in as "admin"
    And a plant exists named "Duplicate Plant"
    When I go to the "Plants" management page
    And I add a new plant with:
      | name            | category | price | description     |
      | Duplicate Plant | Indoor   | 1000  | duplicate test  |
    Then I should see a plant validation error

  @Tester_204081G @UI
  Scenario: Verify Admin can search plants
    Given I am logged in as "admin"
    And a plant exists named "SearchMe"
    When I go to the "Plants" management page
    And I search plants for "SearchMe"
    Then only plants matching "SearchMe" should be shown

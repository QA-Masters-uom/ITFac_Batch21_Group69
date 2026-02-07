Feature: Admin Plant Management (UI)

  @Tester_204081G @UI
  Scenario: Verify Admin can add a new plant
    Given I am logged in as "admin"
    When I go to the "Plants" management page
    And I add a new plant with:
      | name        | category | price | quantity          |
      | Aloe Vera   | Sunflower  | 1200  | 10    |
    Then I should see the plant "Aloe Vera" in the plant list

  @Tester_204081G @UI
  Scenario: Verify Admin can edit an existing plant
    Given I am logged in as "admin"
    And a plant exists named "Aloe Vera"
    When I go to the "Plants" management page
    And I edit plant "Aloe Vera" to:
      | name      | category | price | quantity               |
      | Aloe Pro  | Orchid   | 1500  | 15       |
    Then I should see the plant "Aloe Pro" in the plant list

  @Tester_204081G @UI
  Scenario: Verify Admin can delete a plant
    Given I am logged in as "admin"
    And a plant exists named "Aloe Pro"
    When I go to the "Plants" management page
    And I delete plant "Aloe Pro"
    Then I should not see the plant "Aloe Pro" in the plant list

  @Tester_204081G @UI @duplicate
  Scenario: Verify Admin cannot add a plant with duplicate name
  Given I am logged in as "admin"
  And a plant exists named "Rose" in category "Orchid"
  When I go to the "Plants" management page
  And I add a new plant with:
    | name | category | price | quantity |
    | Rose | Orchid   | 900  | 15       |
  Then I should see a plant validation error
  And there should be only 1 plant named "Rose" in category "Orchid"

  @Tester_204081G @UI
  Scenario: Verify Admin can search plants
    Given I am logged in as "admin"
    And a plant exists named "SearchMe"
    When I go to the "Plants" management page
    And I search plants for "SearchMe"
    Then only plants matching "SearchMe" should be shown

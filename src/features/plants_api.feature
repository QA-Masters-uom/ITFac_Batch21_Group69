Feature: Plant Management (API)

  @Tester_204081G @API
  Scenario: Verify Admin can add a plant via API
    Given I have a valid "admin" token
    When I create a plant via API with:
      | name      | category | price | description       |
      | API Aloe  | Indoor   | 2000  | created by api    |
    Then the response status should be 201

  @Tester_204081G @API
  Scenario: Verify Admin can update a plant via API
    Given I have a valid "admin" token
    And a plant exists via API named "API Edit"
    When I update plant "API Edit" via API with:
      | name        | category | price | description    |
      | API Edited  | Outdoor  | 2500  | updated by api |
    Then the response status should be 200

  @Tester_204081G @API
  Scenario: Verify Admin can delete a plant via API
    Given I have a valid "admin" token
    And a plant exists via API named "API Delete"
    When I delete plant "API Delete" via API
    Then the response status should be 200

  @Tester_204081G @API
  Scenario: Verify Admin cannot create a plant with duplicate name via API
    Given I have a valid "admin" token
    And a plant exists via API named "API Duplicate"
    When I create a plant via API with:
      | name          | category | price | description |
      | API Duplicate | Indoor   | 2000  | duplicate   |
    Then the response status should be 400

  @Tester_204081G @API
  Scenario: Verify Admin can retrieve plants via API
    Given I have a valid "admin" token
    When I get all plants via API
    Then the response status should be 200

  @Tester_204081G @API
  Scenario: Verify User can view plants via API
    Given I have a valid "normal" token
    When I get all plants via API
    Then the response status should be 200

  @Tester_204081G @API
  Scenario: Verify User cannot create a plant via API
    Given I have a valid "normal" token
    When I create a plant via API with:
      | name      | category | price | description |
      | User Add  | Indoor   | 1000  | should fail |
    Then the response status should be 403

  @Tester_204081G @API
  Scenario: Verify User cannot update a plant via API
    Given I have a valid "normal" token
    And a plant exists via API named "User Update Target"
    When I update plant "User Update Target" via API with:
      | name      | category | price | description |
      | Hacked    | Indoor   | 1     | should fail |
    Then the response status should be 403

  @Tester_204081G @API
  Scenario: Verify User cannot delete a plant via API
    Given I have a valid "normal" token
    And a plant exists via API named "User Delete Target"
    When I delete plant "User Delete Target" via API
    Then the response status should be 403

  @Tester_204081G @API
  Scenario: Verify User can search plants via API
    Given I have a valid "normal" token
    And a plant exists via API named "FilterMe"
    When I search plants via API for "FilterMe"
    Then the response status should be 200

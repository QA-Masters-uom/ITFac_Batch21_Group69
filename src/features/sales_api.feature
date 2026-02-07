Feature: Sales Management (API)

  @Tester_205008B @API @TC_API_USER_SALES_01
  Scenario: Verify User can retrieve sales data
    Given I have a valid "normal" token
    When I retrieve all sales via API
    Then the response status should be 200

  @Tester_205008B @API @TC_API_USER_SALES_02 @KNOWN_BUG
  Scenario: Verify API prevents creating sale for user
    Given I have a valid "admin" token
    And the plant "S_ROSE" exists via API
    And I have a valid "normal" token
    When I sell plant "S_ROSE" with quantity 5 via API
    Then the response status should be 403

  @Tester_205008B @API @TC_API_USER_SALES_03 @KNOWN_BUG
  Scenario: Verify User cannot cancel sale via API
    Given I have a valid "admin" token
    And a sale exists via API from "S_ROSE"
    And I have a valid "normal" token
    When I delete the sale via API
    Then the response status should be 403

  @Tester_205008B @API @TC_API_ADMIN_SALES_01
  Scenario: Verify Admin can retrieve sales list
    Given I have a valid "admin" token
    When I retrieve all sales via API
    Then the response status should be 200
    And the response should contain sales data

  @Tester_205008B @API @TC_API_ADMIN_SALES_02
  Scenario: Verify Admin can create sale via API
    Given I have a valid "admin" token
    And the plant "S_ROSE" exists via API
    When I sell plant "S_ROSE" with quantity 5 via API
    Then the response status should be 201

  @Tester_205008B @API @TC_API_ADMIN_SALES_03
  Scenario: Verify API pagination parameters
    Given I have a valid "admin" token
    And multiple sales exist via API with count 15
    When I retrieve sales with page 0 and size 10 via API
    Then the response status should be 200
    And the paginated response should contain 10 sales
    And pagination metadata should show total pages greater than 1

  @Tester_205008B @API @TC_API_ADMIN_SALES_05
  Scenario: Verify Admin can cancel sale via API
    Given I have a valid "admin" token
    And a sale exists via API from "S_ROSE"
    When I delete the sale via API
    Then the response status should be 204

  @Tester_205008B @API @TC_API_ADMIN_SALES_04
  Scenario: Verify Admin cannot delete non-existent sale via API
    Given I have a valid "admin" token
    When I delete a non-existent sale with ID 999999 via API
    Then the response status should be 404

  @Tester_205008B @API @TC_API_ADMIN_SALES_06
  Scenario Outline: Verify Admin receives error for invalid sales request
    Given I have a valid "admin" token
    And the plant "S_ROSE" exists via API
    When I sell plant "S_ROSE" with quantity <quantity> via API
    Then the response status should be 400

    Examples:
      | quantity |
      |        0 |
      |       -5 |

  @Tester_205008B @API @TC_API_ADMIN_SALES_07
  Scenario: Verify Admin cannot sell non-sellable plant via API
    Given I have a valid "admin" token
    And Out of stock plant "S_ORCHID" exists via API
    When I sell plant "S_ORCHID" with quantity 5 via API
    Then the response status should be 400

Feature: Dashboard API Access Control
  As a system
  I want to restrict access to sensitive dashboard data
  So that only authorized users can view sales and inventory

  @Tester_204188P @API
  Scenario: Verify Admin API Access
    Given I have a valid "admin" token
    When I request "Sales Summary"
    Then the response status should be 200
    And the response should contain sales data

  @Tester_204188P @API
  Scenario: Verify Normal User API Restrictions
    Given I have a valid "normal" token
    When I request "Sales Summary"
    Then the response status should be 403
    And the response should contain an access denied error

  @Tester_204188P @API
  Scenario Outline: Verify Public Dashboard Data
    Given I have a valid "<role>" token
    When I request "<resource>"
    Then the response status should be 200

    Examples:
      | role   | resource          |
      | admin  | Categories Summary|
      | normal | Categories Summary|
      | admin  | Plants Summary    |
      | normal | Plants Summary    |

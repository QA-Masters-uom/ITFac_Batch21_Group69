Feature: Dashboard API Access Control
  As a system
  I want to restrict access to sensitive dashboard data
  So that only authorized users can view sales and inventory

  @Tester_204188P @API @TC_API_ADMIN_DASH_01
  Scenario: Verify Admin Auth Token Retrieval
    Given I attempt to login with "admin" credentials
    Then the authentication response status should be 200
    And the response should contain a JWT token

  @Tester_204188P @API @TC_API_USER_DASH_01
  Scenario: Verify Normal User Auth Token Retrieval
    Given I attempt to login with "normal" credentials
    Then the authentication response status should be 200
    And the response should contain a JWT token

  @Tester_204188P @API @TC_API_USER_DASH_02
  Scenario Outline: Verify Dashboard Access Without Auth
    When I attempt to get categories data without authentication
    Then the response status should be <status_code>

    Examples:
      | status_code |
      | 401         |

  @Tester_204188P @API @TC_API_USER_DASH_03
  Scenario: Verify Load Category Stats
    Given I have a valid "normal" token
    When I request "Categories Summary"
    Then the response status should be 200
    And the response should contain category count data

  @Tester_204188P @API @TC_API_USER_DASH_04
  Scenario: Verify Load Plant Stats
    Given I have a valid "normal" token
    When I request "Plants Summary"
    Then the response status should be 200
    And the response should contain plant count data

  @Tester_204188P @API @TC_API_USER_DASH_05 @KNOWN_BUG
  Scenario Outline: Verify Normal User API Restrictions
    Given I have a valid "normal" token
    When I request "Sales Summary"
    Then the response status should be <expected_status>

    Examples:
      | expected_status |
      | 403             |

  @Tester_204188P @API @TC_API_ADMIN_DASH_04
  Scenario: Verify Admin API Access
    Given I have a valid "admin" token
    When I request "Sales Summary"
    Then the response status should be 200
    And the response should contain sales data

  @Tester_204188P @API @TC_API_ADMIN_DASH_02
  Scenario: Verify Admin Category Stats API
    Given I have a valid "admin" token
    When I request "Categories Summary"
    Then the response status should be 200
    And the response should contain category count data

  @Tester_204188P @API @TC_API_ADMIN_DASH_03
  Scenario: Verify Admin Plant Stats API
    Given I have a valid "admin" token
    When I request "Plants Summary"
    Then the response status should be 200
    And the response should contain plant count data

  @Tester_204188P @API @TC_API_ADMIN_DASH_05
  Scenario Outline: Verify Admin Plants Data API Access
    Given I have a valid "admin" token
    When I request "Plants Data"
    Then the response status should be <expected_status>

    Examples:
      | expected_status |
      | 200             |

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

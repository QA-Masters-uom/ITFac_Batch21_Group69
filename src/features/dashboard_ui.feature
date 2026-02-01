Feature: Dashboard UI Functionality
  As a user (Admin or Normal)
  I want to access the dashboard
  So that I can view available modules and statistics

  @Tester_204188P @UI @TC_UI_USER_DASH_01 @TC_UI_USER_DASH_02 @TC_UI_ADMIN_DASH_01
  Scenario Outline: Verify Dashboard Modules Visibility
    Given I am logged in as "<role>"
    When I view the dashboard
    Then I should see the following cards:
      | Categories |
      | Plants     |
      | Sales      |
      | Inventory  |
    And I should see the sidebar navigation

    Examples:
      | role     |
      | admin    |
      | normal   |

  @Tester_204188P @UI @TC_UI_ADMIN_DASH_03 @TC_UI_ADMIN_DASH_04 @TC_UI_ADMIN_DASH_05
  Scenario: Verify Admin Navigation
    Given I am logged in as "admin"
    When I click "Manage Categories"
    Then I should be navigated to the "Categories" page
    When I return to dashboard
    And I click "Manage Plants"
    Then I should be navigated to the "Plants" page
    When I return to dashboard
    And I click "View Sales"
    Then I should be navigated to the "Sales" page

  @Tester_204188P @UI @TC_UI_USER_DASH_03 @TC_UI_USER_DASH_04
  Scenario: Verify Normal User Navigation
    Given I am logged in as "normal"
    When I click "Manage Plants"
    Then I should be navigated to the "Plants" page
    When I return to dashboard
    And I click "Manage Categories"
    Then I should be navigated to the "Categories" page

  @Tester_204188P @UI @TC_UI_USER_DASH_05 @KNOWN_BUG
  Scenario: Verify Access Inventory from Dashboard
    Given I am logged in as "normal"
    When I click "Open Inventory"
    Then I should be navigated to the "Inventory" page

  @Tester_204188P @UI @TC_UI_ADMIN_DASH_02
  Scenario: Verify Admin Dashboard Statistics
    Given I am logged in as "admin"
    When I view the dashboard
    Then the dashboard should display accurate category count
    And the dashboard should display accurate plant count
    And the dashboard should display accurate sales count
    And the dashboard should display accurate inventory count

  @Tester_204188P @UI @TC_UI_ADMIN_DASH_03 @TC_UI_ADMIN_DASH_04 @TC_UI_ADMIN_DASH_05
  Scenario: Verify Admin Specific Button Validations
    Given I am logged in as "admin"
    When I view the dashboard
    Then "Manage Categories" button should be visible
    And "Manage Plants" button should be visible
    And "View Sales" button should be visible

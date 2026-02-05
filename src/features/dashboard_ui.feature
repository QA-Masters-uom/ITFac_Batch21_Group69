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
      | role   |
      | admin  |
      | normal |

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

  @Tester_205072M @UI @TC_UI_USER_DASH_06
  Scenario: Verify View Sales Card
    Given I am logged in as "normal"
    When I am on the dashboard
    Then I should see the "Sales" card
    And the "Sales" card should be visible

  @Tester_205072M @UI @TC_UI_USER_DASH_07
  Scenario: Verify Sidebar Navigation
    Given I am logged in as "normal"
    When I am on the dashboard
    And I click on sidebar link "Categories"
    Then I should be navigated to the "Categories" page
    When I click on sidebar link "Dashboard"
    Then I should be navigated to the "Dashboard" page
    When I click on sidebar link "Plants"
    Then I should be navigated to the "Plants" page
    When I click on sidebar link "Dashboard"
    Then I should be navigated to the "Dashboard" page
    When I click on sidebar link "Sales"
    Then I should be navigated to the "Sales" page
    When I click on sidebar link "Dashboard"
    Then I should be navigated to the "Dashboard" page

  @Tester_205072M @UI @TC_UI_USER_DASH_08
  Scenario: Verify Low Stock Warning
    Given I am logged in as "normal"
    And there are low stock plants in the system
    When I am on the dashboard
    Then I should see "Low Stock" indicator in the Plants card
    And the "Low Stock" text should be visible

  @Tester_205072M @UI @TC_UI_USER_DASH_09
  Scenario: Verify Header Functionality
    Given I am logged in as "normal"
    When I am on the dashboard
    And I navigate to the "Plants" page
    When I click on the App Title in the header
    Then I should be redirected to the Dashboard
    And I should see the dashboard cards

  @Tester_205072M @UI @TC_UI_ADMIN_DASH_09
  Scenario: Verify Sidebar Functionality for Admin
    Given I am logged in as "admin"
    When I am on the dashboard
    And I click on sidebar link "Categories"
    Then I should be navigated to the "Categories" page
    When I click on sidebar link "Dashboard"
    Then I should be navigated to the "Dashboard" page
    When I click on sidebar link "Plants"
    Then I should be navigated to the "Plants" page
    When I click on sidebar link "Dashboard"
    Then I should be navigated to the "Dashboard" page
    When I click on sidebar link "Sales"
    Then I should be navigated to the "Sales" page
    When I click on sidebar link "Dashboard"
    Then I should be navigated to the "Dashboard" page
    And all sidebar links should navigate correctly

  @Tester_205072M @UI @TC_UI_USER_DASH_10
  Scenario: Verify Dashboard Logout
    Given I am logged in as "normal"
    When I am on the dashboard
    And I click on "Logout" in the sidebar
    Then I should be redirected to the Login page
    And I should see the login form

  @Tester_205072M @UI @TC_UI_ADMIN_DASH_06 @KNOWN_ISSUE
  Scenario: Verify Revenue Display
    Given I am logged in as "admin"
    When I am on the dashboard
    Then I should see the "Sales" card
    And the Sales card should display "Revenue" field
    And the Revenue should show a currency value
    And the Revenue should be in "Rs" format

  @Tester_205072M @UI @TC_UI_ADMIN_DASH_07 @KNOWN_BUG
  Scenario: Verify Admin Can Access Inventory
    Given I am logged in as "admin"
    When I am on the dashboard
    Then I should see the "Inventory" card
    And the "Open Inventory" button should be enabled for admin
    When I click "Open Inventory" button
    Then I should be navigated to the "Inventory" page

  @Tester_205072M @UI @TC_UI_ADMIN_DASH_08
  Scenario: Verify Sub Category Count
    Given I am logged in as "admin"
    When I am on the dashboard
    Then I should see the "Categories" card
    And the Categories card should display "Sub" count
    And the Sub category count should be visible
    And the Sub category count should be numeric

  @Tester_205072M @UI @TC_UI_ADMIN_DASH_10
  Scenario: Verify Admin Logout
    Given I am logged in as "admin"
    When I am on the dashboard
    And I click on "Logout" in the sidebar
    Then I should be redirected to the Login page
    And I should see the login form

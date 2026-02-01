Feature: Dashboard UI Functionality
  As a user (Admin or Normal)
  I want to access the dashboard
  So that I can view available modules and statistics

  @Tester_204188P @UI
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

  @Tester_204188P @UI
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

  @Tester_204188P @UI
  Scenario: Verify Normal User Navigation
    Given I am logged in as "normal"
    When I click "Manage Plants"
    Then I should be navigated to the "Plants" page
    When I return to dashboard
    And I click "Manage Categories"
    Then I should be navigated to the "Categories" page

Feature: Sales Management (UI)
  # ==================== USER SALES RESTRICTIONS ====================

  @Tester_205008B @UI
  Scenario: TC_UI_USER_SALES_01 - Verify User can go to sales page
    Given I am logged in as "normal"
    When I go to the "Sales" page
    Then the "Sales" page should be visible
    And the sales table should be visible

  @Tester_205008B @UI
  Scenario: TC_UI_USER_SALES_02 - Verify User cannot sell a plant
    Given I am logged in as "normal"
    When I navigate to "/ui/sales/new"
    Then I should be redirected to error page "http://localhost:8081/ui/403"

  @Tester_205008B @UI
  Scenario: TC_UI_USER_SALES_03 - Verify User cannot delete a sale
    Given I am logged in as "admin"
    And a sale exists via API from "S_ROSE"
    And I log out
    And I am logged in as "normal"
    When I go to the "Sales" page
    Then I should not see delete option for sales
  # ==================== ADMIN SALES VIEW & PAGINATION ====================

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_01 - Verify Admin can view Sales list
    Given I am logged in as "admin"
    When I go to the "Sales" page
    Then the "Sales" page should be visible
    And the sales table should be visible

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_02 - Verify Admin can use pagination with more than 10 sales
    Given I am logged in as "admin"
    And multiple sales exist via API with count 15
    When I go to the "Sales" page
    Then pagination controls should be visible

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_03 - Verify pagination not visible with less than 10 sales
    Given I am logged in as "admin"
    And all sales are deleted via API
    And a sale exists via API from "S_ROSE"
    When I go to the "Sales" page
    Then pagination controls should not be visible
  # ==================== ADMIN SALES CREATION ====================

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_04 - Verify Admin can create a sale
    Given I am logged in as "admin"
    And the plant "S_ROSE" exists via API
    When I go to the "Sales" page
    And I click the "Sell Plant" button
    Then the "Sell Plant" page should be visible
    When I select plant "S_ROSE" from dropdown
    And I enter quantity "10"
    And I click Sell
    Then I should be redirected to sales list page
    And the sale should be visible in the list

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_05 - Verify Admin cannot create sale with zero quantity
    Given I am logged in as "admin"
    And the plant "S_ROSE" exists via API
    When I go to the "Sales" page
    And I click the "Sell Plant" button
    And I select plant "S_ROSE" from dropdown
    And I enter quantity "0"
    And I click Sell
    Then validation error should be displayed

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_06 - Verify Admin cannot create sale with excessive quantity
    Given I am logged in as "admin"
    And the plant "S_ROSE" exists via API
    When I go to the "Sales" page
    And I click the "Sell Plant" button
    And I select plant "S_ROSE" from dropdown
    And I enter quantity "99999"
    And I click Sell
    Then validation error alert box should be displayed

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_07 - Verify non-sellable plants not in dropdown
    Given I am logged in as "admin"
    When I go to the "Sales" page
    And I click the "Sell Plant" button
    Then the "S_ORCHID" plant should not be in the dropdown
  # ==================== ADMIN SALES DELETION ====================

  @Tester_205008B @UI
  Scenario: TC_UI_ADMIN_SALES_08 - Verify Admin can cancel a sale
    Given I am logged in as "admin"
    And a sale exists via API from "S_ROSE"
    When I go to the "Sales" page
    And I delete the first sale from the list
    Then the sale count should decrease by one

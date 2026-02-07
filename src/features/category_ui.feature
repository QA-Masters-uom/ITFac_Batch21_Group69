Feature: Category Management (UI)

  @Tester_205097T @UI @TC_UI_ADMIN_CAT_01
  Scenario: Verify Admin can create a new category
    Given I am logged in as "admin"
    And no category exists named "CT_UI_01"
    When I go to the "Categories" management page
    When I click the "Add A Category" button
    Then the "Add" Category page should be visible
    When I enter category name "CT_UI_01"
    And I click the "Save" button
    Then I should be redirected to category list page
    And the category "CT_UI_01" should be visible in the category list

  @Tester_205097T @UI @TC_UI_ADMIN_CAT_02
  Scenario: Verify Admin can edit an existing category
    Given I am logged in as "admin"
    And a category exists via API named "CT_UI_02"
    When I go to the "Categories" management page
    And I click the edit button for category "CT_UI_02"
    Then the "Edit" Category page should be visible
    And I edit category "CT_UI_02" to "CT_UI_02E"

  @Tester_205097T @UI @TC_UI_ADMIN_CAT_03
  Scenario: Verify Admin can delete a category
    Given I am logged in as "admin"
    And a category exists via API named "CT_UI_03"
    When I go to the "Categories" management page
    And I delete category "CT_UI_03"
    Then I should not see the category "CT_UI_03" in the category list

  @Tester_205097T @UI @TC_UI_ADMIN_CAT_04
  Scenario: Verify Admin cannot create duplicate category name
    Given I am logged in as "admin"
    And a category exists via API named "CT_UI_04"
    When I go to the "Categories" management page
    And I add a new category with "CT_UI_04"
    Then I should see a category validation error

  @Tester_205097T @UI @TC_UI_ADMIN_CAT_05
  Scenario: Verify Admin can search categories
    Given I am logged in as "admin"
    And a category exists via API named "CT_UI_SE"
    When I go to the "Categories" management page
    And I search categories for "CT_UI_SE"
    Then only categories matching "CT_UI_SE" should be shown

  @Tester_205097T @UI @TC_UI_USER_CAT_01
  Scenario: Verify User can view available categories
    Given I am logged in as "user"
    When I go to the "Categories" management page
    Then the categories list should be visible

  @Tester_205097T @UI @TC_UI_USER_CAT_02
  Scenario: Verify User can search categories
    Given I am logged in as "user"
    And a category exists via API named "CT_U_SE"
    When I go to the "Categories" management page
    And I search categories for "CT_U_SE"
    Then only categories matching "CT_U_SE" should be shown

  @Tester_205097T @UI @TC_UI_USER_CAT_03
  Scenario: Verify User cannot add category
    Given I am logged in as "user"
    When I go to the "Categories" management page
    Then the "Add A Category" button should not be visible
    When I try to access the "Add Category" page directly
    Then I should be redirected to error page "http://localhost:8081/ui/403"

  @Tester_205097T @UI @TC_UI_USER_CAT_04 @KNOWN_BUG
  Scenario: Verify User cannot edit categories
    Given I am logged in as "user"
    And a category exists via API named "CT_USER"
    When I go to the "Categories" management page
    Then the edit button should not be visible for any category
    When I try to access the "Edit Category" page directly
    Then I should be redirected to error page "http://localhost:8081/ui/403"

  @Tester_205097T @UI @TC_UI_USER_CAT_05
  Scenario: Verify User cannot delete categories
    Given I am logged in as "user"
    And a category exists via API named "CT_USER"
    When I go to the "Categories" management page
    Then the delete button should not be visible for any category

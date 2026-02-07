Feature: Category Management (API)

  @Tester_205097T @API @TC_API_ADMIN_CAT_01
  Scenario: Verify Admin can create category via API
    Given I have a valid "admin" token
    And no category exists via API named "C_CAT"
    When I create a category via API with name "C_CAT"
    Then the response status should be 201

  @Tester_205097T @API @TC_API_ADMIN_CAT_02
  Scenario: Verify Admin can update category via API
    Given I have a valid "admin" token
    And a category exists via API named "C_UPD"
    When I update category "C_UPD" via API with name "C_UPD1"
    Then the response status should be 200

  @Tester_205097T @API @TC_API_ADMIN_CAT_03
  Scenario: Verify Admin can delete category via API
    Given I have a valid "admin" token
    And a category exists via API named "C_DEL"
    When I delete category "C_DEL" via API
    Then the response status should be 204

  @Tester_205097T @API @TC_API_ADMIN_CAT_04
  Scenario: Verify Admin cannot create duplicate category via API
    Given I have a valid "admin" token
    And a category exists via API named "C_DUP"
    When I create a category via API with name "C_DUP"
    Then the response status should be 400
    And the response error should be "DUPLICATE_RESOURCE"

  @Tester_205097T @API @TC_API_ADMIN_CAT_05
  Scenario: Verify Admin can retrieve categories via API
    Given I have a valid "admin" token
    When I get all categories via API
    Then the response status should be 200

  @Tester_205097T @API @TC_API_ADMIN_CAT_06 @KNOWN_BUG
  Scenario: Verify Admin can not update category to duplicate name via API
    Given I have a valid "admin" token
    And a category exists via API named "C_EXIST1"
    And a category exists via API named "C_EXIST2"
    When I update category "C_EXIST2" via API with name "C_EXIST1"
    Then the response status should be 400
    And the response error should be "DUPLICATE_RESOURCE"

  @Tester_205097T @API @TC_API_ADMIN_CAT_07 @KNOWN_BUG
  Scenario Outline: Verify Admin can not update category with invalid data via API
    Given I have a valid "admin" token
    And a category exists via API named "C_EXIST1"
    When I update category "C_EXIST1" via API with name "<value>"
    Then the response status should be 400

    Examples:
      | value                                       |
      | undefined                                   |
      | A                                           |
      | A_VERY_LONG_STRING_EXCEEDING_MAXIMUM_LENGTH |

  @Tester_205097T @API @TC_API_USER_CAT_01
  Scenario: Verify User can retrieve categories via API
    Given I have a valid "normal" token
    When I get all categories via API
    Then the response status should be 200

  @Tester_205097T @API @TC_API_USER_CAT_02
  Scenario: Verify User cannot create category via API
    Given I have a valid "normal" token
    When I create a category via API with name "C_USER"
    Then the response status should be 403

  @Tester_205097T @API @TC_API_USER_CAT_03
  Scenario: Verify User cannot update category via API
    Given a category exists via API named "C_USRUPD"
    And I have a valid "normal" token
    When I update category "C_USRUPD" via API with name "C_UPDATED"
    Then the response status should be 403

  @Tester_205097T @API @TC_API_USER_CAT_04
  Scenario: Verify User cannot delete category via API
    Given a category exists via API named "C_USRDEL"
    And I have a valid "normal" token
    When I delete category "C_USRDEL" via API
    Then the response status should be 403

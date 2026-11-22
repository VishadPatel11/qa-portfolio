Feature: Login
  As a Juice Shop customer
  I want to log in to my account
  So that I can shop and see my orders

  Background:
    Given I am on the login page

  @smoke
  Scenario: Registered admin logs in successfully
    When I log in with email "admin@juice-sh.op" and password "admin123"
    Then I should be logged in

  Scenario: Wrong password is rejected
    When I log in with email "admin@juice-sh.op" and password "wrong-password"
    Then I should see the login error "Invalid email or password."
    And I should not be logged in

  Scenario Outline: Invalid credentials are rejected
    When I log in with email "<email>" and password "<password>"
    Then I should not be logged in

    Examples:
      | email                | password |
      | nobody@test.local    | whatever |
      | admin@juice-sh.op    | ADMIN123 |

  # TODO (week 4 exercise): write a "search.feature" with scenarios for
  # searching a product, and implement the step definitions + a SearchPage object.

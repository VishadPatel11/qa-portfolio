package com.portfolio.steps;

import com.portfolio.pages.LoginPage;
import com.portfolio.support.DriverFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/** Step definitions stay thin: translate Gherkin into page-object calls, then assert. */
public class LoginSteps {
    private final LoginPage loginPage = new LoginPage(DriverFactory.get());

    @Given("I am on the login page")
    public void iAmOnTheLoginPage() {
        loginPage.open();
    }

    @When("I log in with email {string} and password {string}")
    public void iLogInWith(String email, String password) {
        loginPage.login(email, password);
    }

    @Then("I should be logged in")
    public void iShouldBeLoggedIn() {
        assertTrue(loginPage.isLoggedIn(), "Expected the basket button to be visible after login");
    }

    @Then("I should not be logged in")
    public void iShouldNotBeLoggedIn() {
        assertTrue(loginPage.isLoggedOut(), "Expected the user to stay logged out");
    }

    @Then("I should see the login error {string}")
    public void iShouldSeeTheLoginError(String expected) {
        assertEquals(expected, loginPage.errorText());
    }
}

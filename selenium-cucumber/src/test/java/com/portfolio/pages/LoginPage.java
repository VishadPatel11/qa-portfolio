package com.portfolio.pages;

import com.portfolio.support.Config;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class LoginPage extends BasePage {
    private static final By EMAIL = By.id("email");
    private static final By PASSWORD = By.id("password");
    private static final By SUBMIT = By.id("loginButton");
    private static final By ERROR = By.cssSelector(".error");
    private static final By BASKET = By.cssSelector("button[aria-label='Show the shopping cart']");

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void open() {
        driver.get(Config.baseUrl() + "/#/login");
        visible(EMAIL);
    }

    public void login(String email, String password) {
        type(EMAIL, email);
        type(PASSWORD, password);
        click(SUBMIT);
    }

    public String errorText() {
        return visible(ERROR).getText().trim();
    }

    public boolean isLoggedIn() {
        try {
            visible(BASKET);
            return true;
        } catch (org.openqa.selenium.TimeoutException e) {
            return false;
        }
    }

    /** Wait until the login attempt has finished (URL changes or an error appears), then check. */
    public boolean isLoggedOut() {
        wait.until(ExpectedConditions.or(
                ExpectedConditions.visibilityOfElementLocated(ERROR),
                ExpectedConditions.not(ExpectedConditions.urlContains("/login"))));
        return !isPresent(BASKET);
    }
}

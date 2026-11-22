package com.portfolio.steps;

import com.portfolio.support.Config;
import com.portfolio.support.DriverFactory;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

public class Hooks {

    @Before
    public void openBrowser() {
        WebDriver driver = DriverFactory.get();
        // Cookies can only be set for a domain the browser is already on, so load the app first.
        driver.get(Config.baseUrl());
        driver.manage().addCookie(new Cookie("welcomebanner_status", "dismiss"));
        driver.manage().addCookie(new Cookie("cookieconsent_status", "dismiss"));
    }

    @After
    public void closeBrowser(Scenario scenario) {
        if (scenario.isFailed()) {
            byte[] png = ((TakesScreenshot) DriverFactory.get()).getScreenshotAs(OutputType.BYTES);
            scenario.attach(png, "image/png", "failure-screenshot");   // shows up in the HTML report
        }
        DriverFactory.quit();
    }
}

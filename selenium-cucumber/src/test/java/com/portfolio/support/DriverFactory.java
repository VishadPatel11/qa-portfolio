package com.portfolio.support;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

/**
 * One WebDriver per thread, so scenarios can later run in parallel safely.
 * Choose the browser with -Dbrowser=firefox and headless with -Dheadless=true.
 */
public final class DriverFactory {
    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();

    private DriverFactory() {}

    public static WebDriver get() {
        if (DRIVER.get() == null) {
            DRIVER.set(create());
        }
        return DRIVER.get();
    }

    public static void quit() {
        WebDriver driver = DRIVER.get();
        if (driver != null) {
            driver.quit();
            DRIVER.remove();
        }
    }

    private static WebDriver create() {
        boolean headless = Boolean.parseBoolean(System.getProperty("headless", "false"));
        String browser = System.getProperty("browser", "chrome").toLowerCase();

        if (browser.equals("firefox")) {
            FirefoxOptions options = new FirefoxOptions();
            if (headless) options.addArguments("-headless");
            return new FirefoxDriver(options);
        }
        ChromeOptions options = new ChromeOptions();
        if (headless) options.addArguments("--headless=new");
        options.addArguments("--window-size=1280,800");
        return new ChromeDriver(options);
    }
}

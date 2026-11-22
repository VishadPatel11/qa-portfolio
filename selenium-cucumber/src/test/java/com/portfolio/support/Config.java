package com.portfolio.support;

public final class Config {
    private Config() {}

    /** Override with -DbaseUrl=... or the BASE_URL environment variable. */
    public static String baseUrl() {
        String fromProperty = System.getProperty("baseUrl");
        if (fromProperty != null) return fromProperty;
        String fromEnv = System.getenv("BASE_URL");
        return fromEnv != null ? fromEnv : "http://localhost:3000";
    }
}

package com.openclassrooms.mddapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:4200"); // Autorise le frontend Angular
        corsConfiguration.addAllowedHeader("Authorization"); // Autorise le header Authorization
        corsConfiguration.addAllowedHeader("*"); // Optionnel: si tu veux permettre d'autres headers
        corsConfiguration.addAllowedMethod("*"); // Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
        corsConfiguration.setAllowCredentials(true); // Permet l'envoi des cookies et headers d'authentification

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // Applique la configuration à toutes les URLs

        return new CorsFilter(source);
    }
}


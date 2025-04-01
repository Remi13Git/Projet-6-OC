package com.openclassrooms.mddapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.openclassrooms.mddapi.security.JwtFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Désactive CSRF
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/register", "/api/login", "/api/profile/subscriptions", "/api/articles").permitAll() // Routes publiques
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/**").permitAll()
                .anyRequest().authenticated() // Protège les autres routes
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // API REST sans session
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Ajoute le filtre JWT

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:4200"); // Autorise le frontend Angular
        corsConfiguration.addAllowedHeader("*"); // Permet tous les en-têtes
        corsConfiguration.addAllowedMethod("*"); // Permet toutes les méthodes HTTP
        corsConfiguration.setAllowCredentials(true); // Permet les cookies
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // Applique la configuration CORS à toutes les URL
        return source;
    }
}


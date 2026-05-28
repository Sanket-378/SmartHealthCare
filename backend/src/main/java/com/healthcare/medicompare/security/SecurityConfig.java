package com.healthcare.medicompare.security;

import com.healthcare.medicompare.config.CorsConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors ->
                        cors.configurationSource(corsConfigurationSource)
                )

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/ai/**"
                        ).permitAll()

                        .requestMatchers("/api/medicine/**").permitAll()

                        .requestMatchers(
                                "/api/report/**"
                        ).permitAll()

                        .requestMatchers(
                                "/api/nearcare/**"
                        ).permitAll()

                        .requestMatchers(
                                "/uploads/**"
                        ).permitAll()

                        .requestMatchers(
                                "/error"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                .httpBasic(httpBasic -> httpBasic.disable())

                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
# Eureka Identity Service

Private backend used to generate and store canonical Eureka character identities.

## Identity

Each accepted generated character receives an immutable reference code:

EKA-XXXX-XXXX-XXXX

The code resolves to:

- canonical PNG image
- profile
- exact generation prompt
- image SHA-256
- generation model
- creation date

The canonical image is the future visual reference for the Eureka application.

## Security

Never expose `OPENAI_API_KEY` in:

- site JavaScript
- HTML
- public GitHub
- screenshots
- chat
- frontend configuration

The key belongs only in the private server environment.

## Storage

Default private storage:

`/home/eureka/EurekaNexus/private/eureka-identities`

Generated identities must not be committed to the public website repository.

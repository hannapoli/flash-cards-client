# Aplicación "Flash Cards" en React

Aplicación web desarrollada desarrollada con el stack de PERM (PostgreSQL, Express, React, y Node.js) que permite a los usuarios crear, gestionar y practicar con tarjetas de palabras (flashcards) para facilitar el aprendizaje de nuevos idiomas. La aplicación incluye funcionalidades de autenticación de usuarios, gestión de tarjetas y sesiones de práctica interactivas.

## Instalación

1. Clona el repositorio y navega al directorio del proyecto:
    ```bash
    git clone git@github.com:hannapoli/flash-cards-client.git && cd flash-cards-client
    ```
2. Cambia a la rama develop y actualízala:
    ```bash
    git checkout develop && git pull origin develop
    ```
3. Instala las dependencias:
    ```bash
    yarn install
    ```
4. Configura las variables de entorno necesarias en un archivo `.env` (duplica el archivo `.env.template`).
5. Inicia la aplicación:
    ```bash
    yarn dev
    ```


## Características Principales
- Registro e inicio de sesión de usuarios utilizando Firebase Authentication.
- Creación, modificación y eliminación de tarjetas de palabras, categorías e idiomas.
- Práctica interactiva con tarjetas de palabras.
- Gestión de usuarios para administradores.

## Tecnologías Utilizadas
- React
- Firebase (Authentication, Firestore)
- React Router
- React Context API para gestionar el estado global

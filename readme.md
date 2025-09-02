-- PASOS PARA ARRANCAR EL APLICATIVO

    -- REQUERIMIENTOS 

        DOCKER 
        NODE 22

    -- PASO 1 LEVANTAR EL DOCKER COMPOSE

    COMANDO
        - docker compose up -d 


    paso 2 INSTALAR LAS DEPENDENCIAS DEL BACK
        cd Back
        pnpm i

    -- paso 3 EJECUTAR LAS MIGRACIONES DE LAS BASES DE DATOS

        cd Back
        pnpm db:migrate
        pnpm db:seed

    -- paso 4 LEVANTAR EL BACKEND
        pnpm dev

    -- paso 5 REGRESAR A LA RAIZ DEL PROYECTO Y LEVANTAR EL FRONT 

        cd front
        pnpm i 
        pnpm dev

    
    y ya seria todo para arrancar el proyecto
        

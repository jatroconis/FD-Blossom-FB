# ERD — Rick & Morty Backend

```mermaid
erDiagram
  characters {
    INT id PK "auto-increment"
    INT external_id "ID público único"
    VARCHAR name
    VARCHAR status
    VARCHAR species
    VARCHAR gender
    VARCHAR origin
    VARCHAR image
    VARCHAR created_api
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

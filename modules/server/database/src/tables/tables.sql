START TRANSACTION;

CREATE TABLE "users"
(
    "username" VARCHAR(255) PRIMARY KEY,
    "password" VARCHAR(255) NOT NULL
);

CREATE TABLE "categories"
(
    "id"   SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL
);

CREATE TABLE "articles"
(
    "id"               SERIAL PRIMARY KEY,
    "title"            VARCHAR(255)             NOT NULL UNIQUE,
    "content"          TEXT                     NOT NULL,
    "category"         INTEGER                  NOT NULL REFERENCES "categories" ON UPDATE CASCADE ON DELETE CASCADE,
    "publicationTime"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "modificationTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "pageViews"        INTEGER DEFAULT 0        NOT NULL,
    "isVisible"        BOOLEAN DEFAULT TRUE     NOT NULL
);

COMMIT;
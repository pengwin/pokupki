CREATE EXTENSION pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY  NOT NULL,
    user_name       VARCHAR(60)            NOT NULL UNIQUE,
    password_hash   TEXT                   NOT NULL,
    created         TIMESTAMPTZ            NOT NULL DEFAULT clock_timestamp(),
    modified        TIMESTAMPTZ            NULL
);

CREATE INDEX idx_users_user_name ON users(user_name);
CREATE INDEX idx_users_password_hash ON users(password_hash);

CREATE OR REPLACE FUNCTION add_user(username VARCHAR(60), plain_password TEXT) 
    RETURNS TABLE (user_id BIGINT) AS $$
    BEGIN
      RETURN QUERY INSERT INTO users(user_name, password_hash) VALUES (username, crypt(plain_password, gen_salt('md5'))) RETURNING id;
    END;
    $$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user(username VARCHAR(60), plain_password TEXT) 
    RETURNS TABLE (id BIGINT, user_name VARCHAR(60)) AS $$
    BEGIN
      RETURN QUERY SELECT u.id, u.user_name FROM users as u WHERE 
            u.user_name = username AND
            u.password_hash = crypt(plain_password, u.password_hash);
    END;
    $$ LANGUAGE plpgsql;


CREATE TABLE IF NOT EXISTS events (
    id          BIGSERIAL PRIMARY KEY   NOT NULL,
    type        TEXT                    NOT NULL,
    version     TEXT                    NOT NULL DEFAULT '1',
    user_id     BIGINT                  REFERENCES users(id),
    payload     JSONB                   NOT NULL,
    created     TIMESTAMPTZ             NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX idx_events_created ON events(created);
CREATE TABLE IF NOT EXISTS event (
    id          BIGSERIAL PRIMARY KEY   NOT NULL,
    type        VARCHAR(1024)           NOT NULL,
    payload     JSONB                   NOT NULL,
    created     TIMESTAMPTZ             NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX idx_event_created ON event(created);
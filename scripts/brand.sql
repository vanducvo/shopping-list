CREATE TABLE IF NOT EXISTS brand (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    manufacturer TEXT,
    location TEXT,
    website TEXT,
    when_created DATETIME NOT NULL DEFAULT (datetime('now'))
);
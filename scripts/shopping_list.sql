CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY NOT NULL,
    description TEXT NOT NULL,
    when_created DATETIME NOT NULL DEFAULT (datetime('now')),
    when_modify DATETIME
);
CREATE TABLE IF NOT EXISTS shopping_list_item (
    item_id INTEGER NOT NULL,
    shopping_list_id INTEGER NOT NULL,
    pick_up INTEGER NOT NULL DEFAULT O CHECK (pick_up IN (0,1)),
    quantity INTEGER NOT NULL DEFAULT 1
);
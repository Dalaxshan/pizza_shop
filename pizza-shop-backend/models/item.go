package models

import (
	"database/sql"
	"pizza-shop-backend/config"
)

type Item struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Category    string  `json:"category"`
	Price       float64 `json:"price"`
}

func GetAllItems() ([]Item, error) {
	rows, err := config.DB.Query("SELECT id, name, description, category, price FROM items")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []Item
	for rows.Next() {
		var item Item
		err := rows.Scan(&item.ID, &item.Name, &item.Description, &item.Category, &item.Price)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

func CreateItem(item Item) error {
	_, err := config.DB.Exec(
		"INSERT INTO items (name, description, category, price) VALUES (?, ?, ?, ?)",
		item.Name, item.Description, item.Category, item.Price,
	)
	return err
}

func GetItemByID(id int) (Item, error) {
	var item Item
	err := config.DB.QueryRow(
		"SELECT id, name, description, category, price FROM items WHERE id = ?", id,
	).Scan(&item.ID, &item.Name, &item.Description, &item.Category, &item.Price)
	return item, err
}

func UpdateItem(item Item) error {
	_, err := config.DB.Exec(
		"UPDATE items SET name = ?, description = ?, category = ?, price = ? WHERE id = ?",
		item.Name, item.Description, item.Category, item.Price, item.ID,
	)
	return err
}

func DeleteItem(id int) error {
	result, err := config.DB.Exec("DELETE FROM items WHERE id = ?", id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}

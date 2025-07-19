package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"pizza-shop-backend/models"
)

type ItemController struct {
	DB *sql.DB
}

func (ic *ItemController) GetItems(w http.ResponseWriter, r *http.Request) {
	rows, err := ic.DB.Query("SELECT id, name, description, category, price, created_at, updated_at FROM items")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var items []models.Item
	for rows.Next() {
		var item models.Item
		err := rows.Scan(&item.ID, &item.Name, &item.Description, &item.Category, &item.Price, &item.CreatedAt, &item.UpdatedAt)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func (ic *ItemController) CreateItem(w http.ResponseWriter, r *http.Request) {
	var item models.Item
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := ic.DB.Exec(
		"INSERT INTO items (name, description, category, price) VALUES (?, ?, ?, ?)",
		item.Name, item.Description, item.Category, item.Price,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	id, err := result.LastInsertId()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	item.ID = int(id)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

// Add similar methods for Update and Delete

package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"pizza-shop-backend/models"
	"strconv"

	"github.com/gorilla/mux"
)

func GetItems(w http.ResponseWriter, r *http.Request) {
	items, err := models.GetAllItems()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func GetItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid item ID", http.StatusBadRequest)
		return
	}

	item, err := models.GetItemByID(id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func CreateItem(w http.ResponseWriter, r *http.Request) {
	var item models.Item
	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate required fields
	if item.Name == "" || item.Price <= 0 {
		http.Error(w, "Name and price are required with price > 0", http.StatusBadRequest)
		return
	}

	err = models.CreateItem(item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func UpdateItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid item ID", http.StatusBadRequest)
		return
	}

	var item models.Item
	err = json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	item.ID = id

	// Validate required fields
	if item.Name == "" || item.Price <= 0 {
		http.Error(w, "Name and price are required with price > 0", http.StatusBadRequest)
		return
	}

	err = models.UpdateItem(item)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func DeleteItem(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid item ID", http.StatusBadRequest)
		return
	}

	err = models.DeleteItem(id)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Item not found", http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

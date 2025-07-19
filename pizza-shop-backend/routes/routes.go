package routes

import (
	"database/sql"
	"pizza-shop-backend/controllers"

	"github.com/gorilla/mux"
)

func SetupRoutes(db *sql.DB) *mux.Router {
	router := mux.NewRouter()

	itemController := &controllers.ItemController{DB: db}

	router.HandleFunc("/items", itemController.GetItems).Methods("GET")
	router.HandleFunc("/items", itemController.CreateItem).Methods("POST")
	// Add more routes for orders and customers

	return router
}

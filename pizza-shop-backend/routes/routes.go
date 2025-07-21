package routes

import (
	"net/http"
	"pizza-shop-backend/controllers"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	// Item routes
	r.HandleFunc("/api/items", controllers.GetItems).Methods("GET")
	r.HandleFunc("/api/items", controllers.CreateItem).Methods("POST")
	r.HandleFunc("/api/items/{id}", controllers.GetItem).Methods("GET")
	r.HandleFunc("/api/items/{id}", controllers.UpdateItem).Methods("PUT")
	r.HandleFunc("/api/items/{id}", controllers.DeleteItem).Methods("DELETE")

	// Order routes
	r.HandleFunc("/api/orders", controllers.CreateOrder).Methods("POST")
	r.HandleFunc("/api/orders", controllers.GetAllOrders).Methods("GET")
	r.HandleFunc("/api/orders/{id}", controllers.GetOrder).Methods("GET")
	r.HandleFunc("/api/orders/{id}", controllers.UpdateOrder).Methods("PUT")
	r.HandleFunc("/api/orders/{id}", controllers.DeleteOrder).Methods("DELETE")

	// Static files for frontend
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public")))

	return r
}

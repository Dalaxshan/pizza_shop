package main

import (
	"log"
	"net/http"
	"pizza-shop-backend/config"
	"pizza-shop-backend/routes"
)

func main() {
	config.ConnectDB()
	defer config.DB.Close()

	router := routes.SetupRoutes(config.DB)

	log.Println("Server starting on :8080...")
	log.Fatal(http.ListenAndServe(":8080", router))
}

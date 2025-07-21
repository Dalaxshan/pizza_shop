package main

import (
	"log"
	"net/http"
	"pizza-shop-backend/config"
	"pizza-shop-backend/routes"
)

func main() {
	// Load environment variables
	// (Make sure you have .env file or set env variables)

	// Initialize database
	config.ConnectDB()

	// Setup routes
	router := routes.SetupRoutes()

	// Start server
	port := ":8080"
	log.Printf("Server started on port %s", port)
	log.Fatal(http.ListenAndServe(port, router))
}

package models

import "pizza-shop-backend/config"

type OrderItem struct {
	ID           int     `json:"id"`
	OrderID      int     `json:"order_id"`
	ItemID       int     `json:"item_id"`
	ItemName     string  `json:"item_name"`
	Quantity     int     `json:"quantity"`
	PriceAtOrder float64 `json:"price_at_order"`
}

func GetOrderItems(orderID int) ([]OrderItem, error) {
	rows, err := config.DB.Query(`
		SELECT oi.id, oi.order_id, oi.item_id, i.name as item_name, 
		       oi.quantity, oi.price_at_order 
		FROM order_items oi
		JOIN items i ON oi.item_id = i.id
		WHERE oi.order_id = ?`, orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []OrderItem
	for rows.Next() {
		var item OrderItem
		err := rows.Scan(
			&item.ID, &item.OrderID, &item.ItemID,
			&item.ItemName, &item.Quantity, &item.PriceAtOrder,
		)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, nil
}

package models

import (
	"database/sql"
	"pizza-shop-backend/config"
	"time"
)

type Order struct {
	ID            int         `json:"id"`
	CustomerName  string      `json:"customer_name"`
	CustomerPhone string      `json:"customer_phone"`
	Status        string      `json:"status"`
	Subtotal      float64     `json:"subtotal"`
	Tax           float64     `json:"tax"`
	Total         float64     `json:"total"`
	CreatedAt     time.Time   `json:"created_at"`
	Items         []OrderItem `json:"items"`
}

func CreateOrder(order Order) (int, error) {
	tx, err := config.DB.Begin()
	if err != nil {
		return 0, err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Calculate tax and total
	tax := order.Subtotal * 0.10
	total := order.Subtotal + tax

	// Insert order
	res, err := tx.Exec(
		"INSERT INTO orders (customer_name, customer_phone, status, subtotal, tax, total) VALUES (?, ?, ?, ?, ?, ?)",
		order.CustomerName, order.CustomerPhone, "pending", order.Subtotal, tax, total,
	)
	if err != nil {
		return 0, err
	}

	orderID, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}

	// Insert order items
	for _, item := range order.Items {
		_, err = tx.Exec(
			"INSERT INTO order_items (order_id, item_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
			orderID, item.ItemID, item.Quantity, item.PriceAtOrder,
		)
		if err != nil {
			return 0, err
		}
	}

	if err = tx.Commit(); err != nil {
		return 0, err
	}

	return int(orderID), nil
}

func GetOrder(id int) (Order, error) {
	var order Order
	err := config.DB.QueryRow(
		"SELECT id, customer_name, customer_phone, status, subtotal, tax, total, created_at FROM orders WHERE id = ?",
		id,
	).Scan(
		&order.ID,
		&order.CustomerName,
		&order.CustomerPhone,
		&order.Status,
		&order.Subtotal,
		&order.Tax,
		&order.Total,
		&order.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return order, sql.ErrNoRows
		}
		return order, err
	}

	items, err := GetOrderItems(order.ID)
	if err != nil {
		return order, err
	}

	order.Items = items
	return order, nil
}

func GetAllOrders() ([]Order, error) {
	rows, err := config.DB.Query(
		"SELECT id, customer_name, customer_phone, status, subtotal, tax, total, created_at FROM orders ORDER BY created_at DESC",
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var order Order
		err := rows.Scan(
			&order.ID,
			&order.CustomerName,
			&order.CustomerPhone,
			&order.Status,
			&order.Subtotal,
			&order.Tax,
			&order.Total,
			&order.CreatedAt,
		)
		if err != nil {
			return nil, err
		}

		items, err := GetOrderItems(order.ID)
		if err != nil {
			return nil, err
		}
		order.Items = items

		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return orders, nil
}

func UpdateOrder(order Order) error {
	tx, err := config.DB.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// Update order
	_, err = tx.Exec(
		"UPDATE orders SET customer_name = ?, customer_phone = ?, status = ?, subtotal = ?, tax = ?, total = ? WHERE id = ?",
		order.CustomerName,
		order.CustomerPhone,
		order.Status,
		order.Subtotal,
		order.Tax,
		order.Total,
		order.ID,
	)
	if err != nil {
		return err
	}

	// Delete existing items
	_, err = tx.Exec("DELETE FROM order_items WHERE order_id = ?", order.ID)
	if err != nil {
		return err
	}

	// Insert updated items
	for _, item := range order.Items {
		_, err = tx.Exec(
			"INSERT INTO order_items (order_id, item_id, quantity, price_at_order) VALUES (?, ?, ?, ?)",
			order.ID,
			item.ItemID,
			item.Quantity,
			item.PriceAtOrder,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

func DeleteOrder(id int) error {
	tx, err := config.DB.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	// First delete order items
	_, err = tx.Exec("DELETE FROM order_items WHERE order_id = ?", id)
	if err != nil {
		return err
	}

	// Then delete the order
	_, err = tx.Exec("DELETE FROM orders WHERE id = ?", id)
	if err != nil {
		return err
	}

	return tx.Commit()
}

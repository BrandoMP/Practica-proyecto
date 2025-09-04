CREATE DATABASE productos_db;
USE productos_db;
SHOW TABLES;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    precio DECIMAL(10,2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO productos (nombre, sku, precio, stock, categoria)
VALUES 
('Producto A', 'SKU001', 100.50, 10, 'Categoria 1'),
('Producto B', 'SKU002', 50.00, 5, 'Categoria 2');

SELECT * FROM productos;

SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS atividade_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE atividade_db;

CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano INT,
    genero VARCHAR(100)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO livros (titulo, autor, ano, genero) VALUES
('Dom Casmurro', 'Machado de Assis', 1899, 'Romance'),
('O Senhor dos Anéis', 'J.R.R. Tolkien', 1954, 'Fantasia'),
('1984', 'George Orwell', 1949, 'Distopia');

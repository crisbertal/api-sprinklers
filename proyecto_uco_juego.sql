-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-04-2022 a las 12:32:17
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto_uco_juego`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aldeas`
--

CREATE TABLE `aldeas` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `factor_k` float DEFAULT 0,
  `nivel_acuifero` float DEFAULT 0,
  `balance_medio` float DEFAULT 0,
  `fk_comarca_id` bigint(20) NOT NULL,
  `fk_profesor_id` bigint(20) NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `aldeas`
--

INSERT INTO `aldeas` (`id`, `nombre`, `factor_k`, `nivel_acuifero`, `balance_medio`, `fk_comarca_id`, `fk_profesor_id`, `fecha_creacion`) VALUES
(3, 'aldea_1_1', 0, 0, 0, 5, 1, '2022-02-20 11:20:56');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comarcas`
--

CREATE TABLE `comarcas` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `rondas_totales` int(11) NOT NULL,
  `estado_partida` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`estado_partida`)),
  `fk_profesor_id` bigint(20) NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `comarcas`
--

INSERT INTO `comarcas` (`id`, `nombre`, `rondas_totales`, `estado_partida`, `fk_profesor_id`, `fecha_creacion`) VALUES
(5, 'comarca_1', 10, '{}', 1, '2022-02-20 11:20:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `campos_secano` int(11) NOT NULL DEFAULT 0,
  `campos_regadio` int(11) NOT NULL DEFAULT 0,
  `campos_regadio_acuifero` int(11) NOT NULL DEFAULT 0,
  `balance_total` float NOT NULL DEFAULT 0,
  `balance_ano_anterior` float NOT NULL DEFAULT 0,
  `token` varchar(50) NOT NULL,
  `fk_aldea_id` bigint(20) NOT NULL,
  `fk_profesor_id` bigint(20) NOT NULL,
  `fecha_creacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id`, `nombre`, `campos_secano`, `campos_regadio`, `campos_regadio_acuifero`, `balance_total`, `balance_ano_anterior`, `token`, `fk_aldea_id`, `fk_profesor_id`, `fecha_creacion`) VALUES
(1, 'kaiserber', 0, 0, 0, 0, 0, '1ffdad93ea7e3876392de83d0db68cc62e19f0cc', 3, 1, '2022-02-20 11:21:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` bigint(20) NOT NULL,
  `nombre` varchar(200) NOT NULL,
  `contrasena` varchar(200) NOT NULL,
  `token` varchar(50) NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `nombre`, `contrasena`, `token`, `fecha_creacion`) VALUES
(1, 'lucas', '7110eda4d09e062aa5e4a390b0a572ac0d2c0220', '1ffdad9e3876392de83d0db68cc62e19f0cc3ea7', '2022-02-20 11:04:17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `aldeas`
--
ALTER TABLE `aldeas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_aldea_unica` (`nombre`),
  ADD KEY `aldea_pertenece_comarca` (`fk_comarca_id`),
  ADD KEY `aldea_creada_por_profesor` (`fk_profesor_id`);

--
-- Indices de la tabla `comarcas`
--
ALTER TABLE `comarcas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_comarca_unica` (`nombre`),
  ADD KEY `comarca_creada_por_profesor` (`fk_profesor_id`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumno_creado_por_profesor` (`fk_profesor_id`),
  ADD KEY `alumno_pertenece_aldea` (`fk_aldea_id`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_profesor_unico` (`nombre`),
  ADD UNIQUE KEY `token_unico` (`token`),
  ADD KEY `nombre` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `aldeas`
--
ALTER TABLE `aldeas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `comarcas`
--
ALTER TABLE `comarcas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `aldeas`
--
ALTER TABLE `aldeas`
  ADD CONSTRAINT `aldea_creada_por_profesor` FOREIGN KEY (`fk_profesor_id`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `aldea_pertenece_comarca` FOREIGN KEY (`fk_comarca_id`) REFERENCES `comarcas` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comarcas`
--
ALTER TABLE `comarcas`
  ADD CONSTRAINT `comarca_creada_por_profesor` FOREIGN KEY (`fk_profesor_id`) REFERENCES `profesores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD CONSTRAINT `alumno_creado_por_profesor` FOREIGN KEY (`fk_profesor_id`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `alumno_pertenece_aldea` FOREIGN KEY (`fk_aldea_id`) REFERENCES `aldeas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

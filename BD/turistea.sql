-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-05-2026 a las 20:11:30
-- Versión del servidor: 10.11.14-MariaDB-0ubuntu0.24.04.1
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `turistea`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `titulo_viaje` varchar(150) NOT NULL,
  `comentario` text NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `valoracion_viaje` tinyint(1) NOT NULL,
  `valoracion_compania` tinyint(1) NOT NULL,
  `estado` enum('PENDIENTE','APROBADA') NOT NULL DEFAULT 'PENDIENTE',
  `creado_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `excursion`
--

CREATE TABLE `excursion` (
  `id` int(11) NOT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorito`
--

CREATE TABLE `favorito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `agregado_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favorito`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticia`
--

CREATE TABLE `noticia` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `contenido` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `publicada_at` timestamp NULL DEFAULT NULL,
  `publicada` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `reserva_id` int(11) DEFAULT NULL,
  `tipo` enum('RESERVA','PAGO','SISTEMA') DEFAULT NULL,
  `mensaje` text DEFAULT NULL,
  `enviada` tinyint(1) DEFAULT NULL,
  `leida` tinyint(1) DEFAULT NULL,
  `enviada_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id` int(11) NOT NULL,
  `reserva_id` int(11) DEFAULT NULL,
  `importe` decimal(10,2) DEFAULT NULL,
  `metodo` enum('TARJETA','PAYPAL','TRANSFERENCIA') DEFAULT NULL,
  `estado` enum('PENDIENTE','PAGADO','FALLIDO') DEFAULT NULL,
  `referencia_externa` varchar(255) DEFAULT NULL,
  `fecha_pago` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquete`
--

CREATE TABLE `paquete` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `destino` varchar(100) DEFAULT NULL,
  `hotel_nombre` varchar(150) DEFAULT NULL,
  `hotel_estrellas` int(11) DEFAULT NULL,
  `hotel_regimen` varchar(100) DEFAULT NULL,
  `hotel_imagen` varchar(255) DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `fecha_regreso` date DEFAULT NULL,
  `plazas_totales` int(11) DEFAULT NULL,
  `plazas_disponibles` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `descuento` decimal(5,2) DEFAULT 0.00,
  `activo` tinyint(1) DEFAULT 1,
  `imagen` varchar(255) DEFAULT NULL,
  `categoria` enum('vuelo','vacaciones','fin_de_semana','verano') DEFAULT NULL,
  `vuelo_incluido` tinyint(1) DEFAULT 0,
  `salida_desde` varchar(100) DEFAULT NULL,
  `cerca_playa` tinyint(1) DEFAULT 0,
  `hotel_detalles` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `paquete`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reserva`
--

CREATE TABLE `reserva` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `paquete_id` int(11) DEFAULT NULL,
  `num_viajeros` int(11) DEFAULT NULL,
  `precio_total` decimal(10,2) DEFAULT NULL,
  `estado` enum('PENDIENTE','CONFIRMADA','CANCELADA') DEFAULT NULL,
  `fecha_reserva` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reserva`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tarjeta_credito`
--

CREATE TABLE `tarjeta_credito` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titular` varchar(150) NOT NULL,
  `ultimos_4` char(4) NOT NULL,
  `vencimiento` varchar(5) NOT NULL,
  `tarjeta_hash` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tarjeta_credito`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `rol` enum('usuario','admin') DEFAULT 'usuario',
  `activo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `viajero`
--

CREATE TABLE `viajero` (
  `id` int(11) NOT NULL,
  `reserva_id` int(11) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(150) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `viajero`
--

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_comentario_usuario_paquete` (`usuario_id`,`paquete_id`),
  ADD KEY `fk_comentario_usuario` (`usuario_id`),
  ADD KEY `fk_comentario_paquete` (`paquete_id`);

--
-- Indices de la tabla `excursion`
--
ALTER TABLE `excursion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `paquete_id` (`paquete_id`);

--
-- Indices de la tabla `favorito`
--
ALTER TABLE `favorito`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`,`paquete_id`),
  ADD KEY `paquete_id` (`paquete_id`);

--
-- Indices de la tabla `noticia`
--
ALTER TABLE `noticia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `reserva_id` (`reserva_id`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reserva_id` (`reserva_id`);

--
-- Indices de la tabla `paquete`
--
ALTER TABLE `paquete`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `paquete_id` (`paquete_id`);

--
-- Indices de la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_tarjeta_usuario` (`usuario_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `viajero`
--
ALTER TABLE `viajero`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reserva_id` (`reserva_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `excursion`
--
ALTER TABLE `excursion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `favorito`
--
ALTER TABLE `favorito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `noticia`
--
ALTER TABLE `noticia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `paquete`
--
ALTER TABLE `paquete`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `reserva`
--
ALTER TABLE `reserva`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `viajero`
--
ALTER TABLE `viajero`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `fk_comentario_paquete` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_comentario_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `excursion`
--
ALTER TABLE `excursion`
  ADD CONSTRAINT `excursion_ibfk_1` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `favorito`
--
ALTER TABLE `favorito`
  ADD CONSTRAINT `favorito_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `favorito_ibfk_2` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`);

--
-- Filtros para la tabla `reserva`
--
ALTER TABLE `reserva`
  ADD CONSTRAINT `reserva_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `reserva_ibfk_2` FOREIGN KEY (`paquete_id`) REFERENCES `paquete` (`id`);

--
-- Filtros para la tabla `tarjeta_credito`
--
ALTER TABLE `tarjeta_credito`
  ADD CONSTRAINT `fk_tarjeta_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `viajero`
--
ALTER TABLE `viajero`
  ADD CONSTRAINT `viajero_ibfk_1` FOREIGN KEY (`reserva_id`) REFERENCES `reserva` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

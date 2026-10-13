-- Migracion: estado de moderacion para comentarios/reseñas
ALTER TABLE `comentario`
  ADD COLUMN `estado` enum('PENDIENTE','APROBADA') NOT NULL DEFAULT 'PENDIENTE'
  AFTER `valoracion_compania`;

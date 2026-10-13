# JR_M26_AgenciaViajes

npm install

## Configuración local (no se publica en GitHub)

Copia `api/config/bd.local.example.php` a `api/config/bd.local.php` y rellena tus credenciales. Haz lo mismo con `smtp.local.example.php` y `smtp.local.php` para el correo. Los archivos locales están excluidos mediante `.gitignore`.

`BD/turistea.sql` contiene solo la estructura, sin usuarios, contraseñas cifradas, reservas ni datos de tarjetas. La copia con datos se conserva localmente como `BD/turistea.local.sql`, ignorada por Git. Importa la estructura para una instalación nueva y crea tus propios datos.

Para arrancar en desarrollo: `php -S localhost:9000`. `setup.sh` permite ejecutar un instalador privado `setup.local.sh`, si existe.

Antes de publicar, revisa `git diff --cached` y `git status`. Ignorar un archivo no elimina sus versiones anteriores: el historial existente contiene credenciales y datos. No publiques ese historial sin limpiarlo; para un repositorio nuevo puedes exportar únicamente una versión saneada. Cambia las credenciales antiguas de MySQL y SMTP si ya se compartieron.

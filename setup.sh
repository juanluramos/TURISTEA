#!/bin/bash
# La configuración específica de cada equipo no se versiona.
cd -- "$(dirname -- "$0")" || exit 1
if [ ! -f setup.local.sh ]; then
    echo "Configura la BD siguiendo README.md. Para arrancar: php -S localhost:9000"
    exit 1
fi
exec bash setup.local.sh

#!/bin/bash
# Actualiza este proyecto en AWS App Runner: construye la imagen, la sube y reinicia el servicio.
# Uso (desde la carpeta del proyecto):  bash scripts/desplegar-aws.sh
# Requiere: Docker abierto y la sesión de AWS iniciada (aws login).
set -euo pipefail
export AWS_REGION=us-east-2 AWS_DEFAULT_REGION=us-east-2
CUENTA=203312548777
SERVICIO=nuo-web
IMAGEN="$CUENTA.dkr.ecr.us-east-2.amazonaws.com/$SERVICIO:latest"

echo "1/3 Iniciando sesión en el registro de imágenes..."
aws ecr get-login-password | docker login --username AWS --password-stdin "$CUENTA.dkr.ecr.us-east-2.amazonaws.com" >/dev/null

echo "2/3 Construyendo y subiendo la imagen (puede tardar unos minutos)..."
docker buildx build --platform linux/amd64 -t "$IMAGEN" --push .

echo "3/3 Reiniciando el servicio con la imagen nueva..."
ARN=$(aws apprunner list-services --query "ServiceSummaryList[?ServiceName=='$SERVICIO'].ServiceArn" --output text)
aws apprunner start-deployment --service-arn "$ARN" --query OperationId --output text
echo "Listo: AWS está desplegando. En App Runner > $SERVICIO ves el avance (unos 3 a 5 minutos)."

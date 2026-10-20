#!/usr/bin/env bash
# Emisor OIDC local para probar la validación JWT sin Auth0 (solo desarrollo/pruebas).
# Genera una llave RSA, publica /.well-known/openid-configuration + JWKS en http://localhost:9999/
# Uso:  ./local-issuer.sh            (deja el servidor corriendo)
#       export Auth0__Authority=http://localhost:9999/ Auth0__RequireHttpsMetadata=false
#       dotnet run --project ../../src/Services/Orders/NexLog.Orders.Api
#       TOKEN=$(python3 mint.py)       # token RS256 válido (aud https://api.nexlog-tms, 1 h)
#       curl -H "Authorization: Bearer $TOKEN" http://localhost:5101/api/orders
set -euo pipefail
DIR="${TMPDIR:-/tmp}/nexlog-oidc"; mkdir -p "$DIR/.well-known"; cd "$DIR"
[ -f key.pem ] || openssl genrsa -out key.pem 2048 2>/dev/null
python3 - <<'PY'
import subprocess, base64, json
mod = subprocess.check_output(['openssl','rsa','-in','key.pem','-noout','-modulus']).decode().strip().split('=')[1]
b = lambda x: base64.urlsafe_b64encode(x).rstrip(b'=').decode()
iss = 'http://localhost:9999/'
json.dump({"issuer": iss, "jwks_uri": iss + ".well-known/jwks.json", "id_token_signing_alg_values_supported": ["RS256"]}, open('.well-known/openid-configuration','w'))
json.dump({"keys": [{"kty":"RSA","use":"sig","alg":"RS256","kid":"test-key","n": b(bytes.fromhex(mod)),"e": b((65537).to_bytes(3,'big'))}]}, open('.well-known/jwks.json','w'))
PY
echo "Issuer listo en http://localhost:9999/ (llave: $DIR/key.pem)"
exec python3 -m http.server 9999

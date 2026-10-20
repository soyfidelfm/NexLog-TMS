#!/usr/bin/env python3
"""Firma un access token RS256 con la llave del emisor local (local-issuer.sh).
Uso: python3 mint.py [audience] [segundos_de_vida] [scope]
     python3 mint.py https://api.nexlog-tms -120      -> token expirado (debe dar 401)
     python3 mint.py https://otra-api                 -> audience incorrecto (401)
     python3 mint.py https://api.nexlog-tms 3600 "read:tms"  -> solo lectura (con EnforcePermissions)"""
import base64, json, os, subprocess, sys, time
key = os.path.join(os.environ.get('TMPDIR', '/tmp'), 'nexlog-oidc', 'key.pem')
b = lambda x: base64.urlsafe_b64encode(x).rstrip(b'=').decode()
aud = sys.argv[1] if len(sys.argv) > 1 else 'https://api.nexlog-tms'
life = int(sys.argv[2]) if len(sys.argv) > 2 else 3600
scope = sys.argv[3] if len(sys.argv) > 3 else 'openid profile email'
now = int(time.time())
h = b(json.dumps({"alg": "RS256", "typ": "JWT", "kid": "test-key"}).encode())
p = b(json.dumps({"iss": "http://localhost:9999/", "sub": "auth0|test-user", "aud": [aud], "iat": now - 10, "exp": now + life, "scope": scope}).encode())
sig = subprocess.run(['openssl', 'dgst', '-sha256', '-sign', key], input=f'{h}.{p}'.encode(), capture_output=True, check=True).stdout
print(f'{h}.{p}.{b(sig)}')

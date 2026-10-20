#!/usr/bin/env bash
# Kiem tra nhanh API (local hoac Render) truoc khi demo.
# Dung: ./scripts/smoke-test.sh https://thuyet-minh-api.onrender.com
#       ./scripts/smoke-test.sh http://localhost:3000
set -uo pipefail

BASE="${1:?Cach dung: $0 <base-url>}"
BASE="${BASE%/}"
FAIL=0

check() { # ten, duong dan, chuoi can co trong response, [http code mong doi]
  local name="$1" path="$2" expect="$3" code="${4:-200}"
  local out status
  out=$(curl -s --max-time 90 -w $'\n%{http_code}' "$BASE$path") || out=$'\n000'
  status="${out##*$'\n'}"
  if [ "$status" = "$code" ] && grep -q -- "$expect" <<<"$out"; then
    printf "  [ OK ] %-34s %s\n" "$name" "$path"
  else
    printf "  [FAIL] %-34s %s (http %s)\n" "$name" "$path" "$status"
    FAIL=1
  fi
}

echo "Smoke test: $BASE"
echo "(lan dau goi Render free co the mat 30-60 giay de 'danh thuc' server)"
START=$(date +%s)
check "Health"                  "/health"                         '"status":"ok"'
echo "  ... server phan hoi sau $(( $(date +%s) - START ))s"
check "Danh sach ngon ngu"      "/api/v1/languages"               '"ttsLocale":"vi-VN"'
check "Danh sach diem (vi)"     "/api/v1/spots"                   'Dinh Độc Lập'
check "Danh sach diem (en)"     "/api/v1/spots?lang=en"           'Independence Palace'
check "Danh sach diem (ja)"     "/api/v1/spots?lang=ja"           '独立宮殿'
check "Danh sach diem (ko)"     "/api/v1/spots?lang=ko"           '독립궁'
check "Chi tiet diem theo id"   "/api/v1/spots/1?lang=en"        '"narration"'
check "Chi tiet diem theo slug" "/api/v1/spots/cho-ben-thanh"     'Chợ Bến Thành'
check "QR TM-001"               "/api/v1/spots/qr/TM-001?lang=en" 'Independence Palace'
check "QR TM-006"               "/api/v1/spots/qr/TM-006?lang=ko" '구찌 터널'
check "QR khong ton tai -> 404" "/api/v1/spots/qr/XXX"            'SPOT_NOT_FOUND' 404
check "Ngon ngu sai -> 400"     "/api/v1/spots?lang=xx"           'INVALID_LANG' 400
check "Swagger UI"              "/docs/"                          'swagger-ui'

echo
if [ "$FAIL" = 0 ]; then echo "TAT CA DAT"; else echo "CO LOI - xem cac dong [FAIL]"; fi
exit "$FAIL"

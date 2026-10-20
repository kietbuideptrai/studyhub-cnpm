#!/usr/bin/env bash
# Thiet lap repo GitHub cho nhom (A chay 1 lan sau khi tao repo + moi B, C).
# Yeu cau: gh CLI da dang nhap (gh auth login), quyen admin tren repo.
# Dung:   GH_A=taikhoanA GH_B=taikhoanB GH_C=taikhoanC ./scripts/setup-github.sh owner/repo
set -euo pipefail

REPO="${1:?Cach dung: $0 owner/repo}"
A="${GH_A:-}"; B="${GH_B:-}"; C="${GH_C:-}"

echo "==> 1/4 Branch protection cho main"
# Can repo public, hoac tai khoan co GitHub Pro/Education neu repo private.
gh api -X PUT "repos/$REPO/branches/main/protection" \
  -H "Accept: application/vnd.github+json" \
  --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["quality"] },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON

echo "==> 2/4 Cau hinh merge: chi cho squash, tu xoa nhanh sau khi merge"
gh api -X PATCH "repos/$REPO" \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true >/dev/null

echo "==> 3/4 Labels"
mk() { gh label create "$1" --color "$2" --description "$3" --repo "$REPO" 2>/dev/null || true; }
mk must   d73a4a "Bat buoc truoc giua ky"
mk should fbca04 "Lam khi Must da on"
mk could  0e8a16 "Neu con thoi gian"
mk be     5319e7 "Backend / DB"
mk devops 1d76db "CI/CD / ha tang"
mk mobile c5def5 "React Native"
mk web    bfd4f2 "React.js"
mk docs   0075ca "Tai lieu"

echo "==> 4/4 Issues khoi dau (moi issue chi giao cho 1 nguoi)"
issue() { # title, assignee, labels, body
  local args=(--repo "$REPO" --title "$1" --label "$3" --body "$4")
  [ -n "$2" ] && args+=(--assignee "$2")
  gh issue create "${args[@]}" >/dev/null && echo "  + $1"
}

issue "[A] Khoi tao monorepo pnpm + ESLint/Prettier + husky" "$A" "devops,must" \
$'- [ ] pnpm workspace apps/*, packages/*\n- [ ] `pnpm lint`, `pnpm format:check` chay duoc\n- [ ] README huong dan chay local'
issue "[A] Thiet ke ERD 3 bang + schema Prisma + seed" "$A" "be,must" \
$'- [ ] docs/erd.md\n- [ ] migration + seed 6 diem x 4 ngon ngu\n- [ ] seed chay lai nhieu lan khong trung du lieu'
issue "[A] CI: lint, typecheck, test, build" "$A" "devops,must" \
$'- [ ] .github/workflows/ci.yml\n- [ ] Job ten `quality` la required check cua main'
issue "[A] 4 endpoint doc du lieu + Swagger" "$A" "be,must" \
$'- [ ] /languages, /spots, /spots/:id, /spots/qr/:code\n- [ ] /docs hien Swagger UI\n- [ ] docs/api-contract.md'
issue "[A] Deploy backend len Render" "$A" "devops,must" \
$'- [ ] render.yaml, /health xanh\n- [ ] URL dien vao docs/deploy.md va eas.json'
issue "[A] CD web: Vercel + preview moi PR, CORS, bien moi truong" "$A" "devops,must" \
$'- [ ] deploy-web.yml comment link preview vao PR\n- [ ] CORS cho phep domain Vercel'
issue "[A] EAS Build tu GitHub Actions xuat APK" "$A" "devops,must" \
$'- [ ] eas-build.yml chay tay duoc\n- [ ] APK cai duoc tren may that'
issue "[A] Test API co ban + CI xanh" "$A" "be,must" \
$'- [ ] >= 15 test (supertest), docs/testing.md'
issue "[A] Chuan bi demo giua ky: link web, APK, README, kich ban" "$A" "devops,must" \
$'- [ ] docs/demo-checklist.md tick du\n- [ ] Co video/anh du phong'

issue "[B] Khoi tao Expo + TypeScript + navigation" "$B" "mobile,must" \
$'- [ ] `pnpm --filter @tm/mobile start` chay duoc tren Expo Go'
issue "[B] Man hinh chon ngon ngu" "$B" "mobile,must" \
$'- [ ] Chon ngon ngu xong thi toan bo chu trong app doi theo'
issue "[B] Man danh sach diem (React Query + API that)" "$B" "mobile,must" ""
issue "[B] Man chi tiet diem + trinh phat audio (TTS)" "$B" "mobile,must" ""
issue "[B] Quet QR (expo-camera) mo dung diem" "$B" "mobile,must" ""

issue "[C] Wireframe Figma 4 man hinh" "$C" "web,docs,must" ""
issue "[C] packages/i18n (vi/en/ja/ko)" "$C" "web,must" ""
issue "[C] Web: trang danh sach + chi tiet noi API" "$C" "web,must" ""
issue "[C] Web: nghe thuyet minh (Web Speech API), responsive" "$C" "web,must" ""
issue "[C] SRS 2-3 trang (ca nhom review)" "$C" "docs,must" ""

echo "==> Xong. Tao board Kanban: gh project create --owner @me --title 'Do an CNPM'"
echo "    (can: gh auth refresh -s project) roi keo cac issue vao cot Todo / In progress / Review / Done"

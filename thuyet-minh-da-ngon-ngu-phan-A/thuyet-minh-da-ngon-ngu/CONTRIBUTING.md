# Quy tắc làm việc nhóm

## Nhánh và commit

- **Không push thẳng vào `main`.** Mọi thay đổi đi qua Pull Request (PR).
- Tên nhánh: `loai/mo-ta-ngan`, ví dụ `feat/api-qr-lookup`, `fix/cors-preview`, `docs/erd`, `ci/eas-build`.
- Commit theo [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `chore:`, `refactor:`.
  Ví dụ: `feat(api): them endpoint tim diem theo ma QR`.
- Commit nhỏ, đều đặn. Lịch sử GitHub là bằng chứng đóng góp của từng người.

## Pull Request

1. Mỗi PR gắn với 1 issue (`Closes #n`), mỗi issue chỉ giao cho **1 người**.
2. Điền đủ template PR (ảnh/GIF minh họa, tick Definition of Done).
3. **Cần ≥ 1 người khác duyệt và CI xanh (check `quality`) mới được merge.** Merge kiểu _squash_.
4. Mỗi người phải review PR của người khác. Review trong vòng 24 giờ, góp ý cụ thể, không "LGTM" suông.

## Definition of Done

- Chạy được trên máy người viết
- Qua `pnpm lint`, `pnpm typecheck`, `pnpm test` (CI xanh)
- Có ảnh/GIF (giao diện) hoặc kết quả `curl`/Swagger (backend) trong PR
- README/docs được cập nhật nếu cần

## API contract

Nguồn sự thật là `apps/api/openapi.yaml` + `docs/api-contract.md`. **Ai muốn đổi API phải báo cả nhóm
trước** (comment vào issue, ghi vào biên bản họp). Thay đổi gây vỡ FE (đổi tên trường, bỏ trường)
phải được B và C đồng ý.

## Họp

15 phút, 2 lần/tuần (thứ 3 và thứ 6): hôm nay làm gì, vướng gì, ai cần review.
Ghi biên bản ngắn vào `docs/meetings/` theo mẫu `_template.md`.

## Cài đặt máy cá nhân

```bash
corepack enable
pnpm install
```

Hook `pre-commit` (husky + lint-staged) tự chạy ESLint/Prettier trên file bạn sửa.

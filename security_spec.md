# Security Specification & Threat Model

## 1. System Invariants
1. **Unauthenticated Read Access**: Viewers (including public or signed-in users) can read and search published articles and archived documents.
2. **Editor Integrity**: Only users with verified `editor` or `admin` status (or bootstrapped admin `lyvuong@viethoc.com`) may upload, modify, or delete documents and articles.
3. **Identity Verification**: When creating documents or articles, `authorId` must strictly equal `request.auth.uid`.
4. **Immutability of Author & CreatedAt**: On updates, `authorId` and `createdAt` cannot be modified.
5. **Role Escalation Protection**: Users cannot modify their own `role` field in `/users/{userId}` to prevent privilege escalation. Only an admin (`lyvuong@viethoc.com` or member of `/admins`) can assign or change roles.
6. **Volumetric Guards**: All string fields are constrained with `.size() <= MAX` bounds to prevent Denial of Wallet and storage buffer exhaustion.
7. **Safe Id Format**: Document keys must match `^[a-zA-Z0-9_\-]+$` and be ≤ 128 characters.

---

## 2. The "Dirty Dozen" Payloads & Negative Test Vectors
1. **Unauthenticated Write**: An unauthenticated user attempts to create a document in `/documents/{docId}` -> Expected: `PERMISSION_DENIED`.
2. **Viewer Upload Attack**: A user with `role: "viewer"` attempts to write a document to `/documents/{docId}` -> Expected: `PERMISSION_DENIED`.
3. **Privilege Escalation**: A standard user updates their `/users/{userId}` profile to set `role: "admin"` -> Expected: `PERMISSION_DENIED`.
4. **Author Spoofing**: An editor submits a document with `authorId` pointing to another user's UID -> Expected: `PERMISSION_DENIED`.
5. **Author Mutation**: An editor updates an existing document and attempts to mutate `authorId` -> Expected: `PERMISSION_DENIED`.
6. **Creation Timestamp Forgery**: A document creation payload includes an arbitrary timestamp instead of `request.time` -> Expected: `PERMISSION_DENIED`.
7. **Oversized Payload**: Document title exceeds 255 characters -> Expected: `PERMISSION_DENIED`.
8. **Malicious ID Injection**: A path variable contains directory traversal or special characters like `../secret` -> Expected: `PERMISSION_DENIED`.
9. **Orphaned User Creation**: Writing to `/users/{userId}` where `userId != request.auth.uid` -> Expected: `PERMISSION_DENIED`.
10. **Ghost Field Injection**: Adding undeclared shadow properties during document update -> Expected: `PERMISSION_DENIED`.
11. **Admin Record Tampering**: Non-admin user attempts to insert or delete in `/admins/{adminId}` -> Expected: `PERMISSION_DENIED`.
12. **Unverified Email Spoof**: A user claiming admin email without verified token (`email_verified == false`) -> Expected: `PERMISSION_DENIED`.

---

## 3. RBAC Matrix
| Collection | Unauthenticated | Viewer | Editor | Admin / Bootstrap |
|---|---|---|---|---|
| `/documents/{id}` | Read (get/list) | Read (get/list) | Read, Create, Update, Delete (own) | Full Read/Write |
| `/articles/{id}` | Read (get/list) | Read (get/list) | Read, Create, Update, Delete (own) | Full Read/Write |
| `/users/{id}` | None | Read own, Update own (except role) | Read own, Update own (except role) | Read all, Update roles |
| `/admins/{id}` | None | None | None | Read, Write |

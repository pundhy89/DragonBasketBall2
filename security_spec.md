# Security Specification

## Data Invariants
1. Students: Only authenticated coaches/admins can create or update students.
2. Practice Sessions: Only authenticated coaches/admins can create, update, or delete sessions.
3. Parent Notifications: Only authenticated coaches/admins can create notifications.
4. Tutorial Videos: Read-only for authenticated users, modifiable only by admins/coaches.
5. In this app, we'll assume any authenticated user is an admin/coach for simplicity since there's no complex RBAC mentioned in types, but we'll secure everything behind `isSignedIn()` and `email_verified`.

## The "Dirty Dozen" Payloads
1. Unauthenticated read of students.
2. Unauthenticated write to students.
3. Authenticated write without verified email.
4. Payload missing required field (e.g. `age` missing in student).
5. Payload with extra ghost field (e.g. `isAdmin: true` in student).
6. String size limit exceeded on `name`.
7. Number size limit exceeded (e.g. negative age or > 150).
8. Invalid enum value for `position`.
9. Modifying `createdAt` field after creation.
10. `createdAt` not matching `request.time` during creation.
11. Array size limit exceeded for tutorial steps.
12. Attempt to list students without authentication.

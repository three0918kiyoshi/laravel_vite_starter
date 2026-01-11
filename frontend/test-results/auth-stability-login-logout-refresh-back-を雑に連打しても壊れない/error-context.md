# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Login" [level=1] [ref=e4]
  - generic [ref=e5]:
    - generic [ref=e6]:
      - text: Email
      - textbox "Email" [ref=e7]: test1@example.com
    - generic [ref=e8]:
      - text: Password
      - textbox "Password" [ref=e9]: Password123!
    - button "Login" [ref=e10] [cursor=pointer]
  - paragraph [ref=e11]:
    - text: New here?
    - link "Create an account" [ref=e12] [cursor=pointer]:
      - /url: /signup
```
# User Management Example
This demonstrates
- adding permitted emails
- revoking permission
- adding admins
- removing admins
- removing users

:::warning
This guide may be confusing as it requires working with a second email and browser.
:::

1. Start by logging in to an *admin* account, then navigate to the **Emails** tab on the **Admin** page

image

2. Add two emails: `torevoke@gmail.com` and a real email (*Email B*) with an associated Google account

3. Revoke `torevoke@gmail` <br/>
It should disappear from the permitted emails

4. Using another browser (*Browser B*), sign in with the newly permitted email, *Email B* <br/>
To avoid confusion, the original browser will be called *Browser A* and the new one will be called *Browser B*

5. **Browser A** Refresh the page <br/>
*Email B* should disappear from the permitted emails

6. **Browser A** Navigate to the **Users** tab on the **Admin** page <br/>
*Email B* should now have an account (*Account B*)

7. **Browser A** Make *Account B* an admin

8. **Browser B** Refresh the page <br/>
The admin button should now be available on the sidebar

9. **Browser A** Remove *Account B* as an admin

10. **Browser B** Refresh the page <br/>
The admin button should no longer be available on the sidebar

11. **Browser A** Remove *Account B* as a user

12. **Browser B** Refresh the page <br/>
The page should be brought back to the sign in page

13. **Browser B** Try to sign in with *Email B* <br/>
The sign in should not be allowed
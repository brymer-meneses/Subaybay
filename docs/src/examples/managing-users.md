# Example: Managing users
This section demonstrates the process of managing users

Functionalities demonstrated:
- adding permitted emails
- revoking permission
- adding admins
- removing admins
- removing users

::: info
<p style="color: lightseagreen">
The teal colored text describes a situation to imagine, which prompts the next actions
</p>
:::


1. Start by logging in to an _admin_ account, then navigate to the **Emails** tab on the **Admin** page.

2. Add two emails: 
   - _torevoke@gmail.com_
   - A real email (_Email B_) with an associated Google account.

<br/>
<p style="color: lightseagreen">
<i>torevoke@gmail.com</i> was added by mistake, perhaps as a misspelling of the real email that should be added.
</p>

3. Revoke _torevoke@gmail.com_ 
- It should disappear from the permitted emails.

4. Using another browser (_Browser B_), sign in with the newly permitted email, _Email B_.
   - The original account on the original browser will be called _Account A_ 
   - The new one will be called _Account B_

5. **<span style="color: peru">Using Account A</span>**: Refresh the page.
   - _Email B_ should disappear from the permitted emails.

6. **<span style="color: peru">Using Account A</span>**: Navigate to the **Users** tab on the **Admin** page.
   - _Email B_ should now have an account (_Account B_).

<br/>
<p style="color: lightseagreen;">
<b>Account B</b> needs admin priviledges, perhaps to view the statistics or view the users
</p>

7. **<span style="color: peru">Using Account A</span>**: Make _Account B_ an admin.

8. **<span style="color: peru">Using Account B</span>**: Refresh the page.
   - The admin button should now be available on the sidebar.

<br/>
<p style="color: lightseagreen;">
<b>Account B</b> no longer needs admin priviledges
</p>

9. **<span style="color: peru">Using Account A</span>**: Remove _Account B_ as an admin.

10. **<span style="color: peru">Using Account B</span>**: Refresh the page.
    - The admin button should no longer be available on the sidebar.

<br/>
<p style="color: lightseagreen;">
Account B leaves the organization, no longer needing an account
</p>

11. **<span style="color: peru">Using Account A</span>**: Remove _Account B_ as a user.

12. **<span style="color: peru">Using Browser B</span>**: Refresh the page.
    - The page should be brought back to the sign-in page.

13. **<span style="color: peru">Using Browser B</span>**: Try to sign in with _Email B_.
    - The sign-in should not be allowed.


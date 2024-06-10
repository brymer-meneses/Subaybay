# Example: Managing Request Types 
This section demonstrates how to manage request types

Functionalities demonstrated:
- creating a new request type
- editing a request type
- deleting a request type

::: info
<p style="color: lightseagreen">
The teal colored text describes a situation to imagine, which prompts the next actions
</p>
:::

<br/>
<p style="color: lightseagreen">
The OUR is now in charge of a new certificate: <i>Sample Certificate</i><br/>
This certificate has the following steps: <br/>
<ul>
    <li>Newly Created Request</li>
    <li>Prepare Certificate</li>
    <li>Staff Signature</li>
    <li>University Registrar Signature</li>
    <li>Notify Requester</li>
</ul>
</p>

1. Navigate to **Configuration** and create the new certificate
- Set the title to "Sample Certificate"
- Press the `+` button at the bottom thrice so that there are four stages
- Fill in the stage names

<br/>
<p style="color: lightseagreen">
Gumball Watterson is requesting a <i>Sample Certificate</i> <br/>
1 copy is needed
</p>

2. Navigate to **Inbox** and **Create a New Request**

3. Input the following details:
    - Student Name: Gumball Watterson
    - Student Number: 2011-00001
    - Student Email: gwatterson@up.edu.ph

4. In the Request Types field, set the number next to <i>Sample Certificate</i> to 1
    - The new request (_Request A_) should appear in the **Active Inbox**

<br/>
<p style="color: lightseagreen">
There's been a change, <i>Sample Certificate</i> no longer requires the <i>Staff Signature</i> stage
</p>

5. Navigate to the **Edit Request Type Page** of _Sample Certificate_

6. In the editing form remove the stage _Staff Signature_ by clicking on the `x` button next to it, then confirm the changes

7. Navigate to the **Progress View** of _Request A_
- Observe that the old stages are kept

<br/>
<p style="color: lightseagreen">
Darwin Watterson is requesting a <i>Sample Certificate</i> <br/>
1 copy is needed
</p>

8. Navigate to **Inbox** and **Create a New Request**

9. Input the following details:
    - Student Name: Darwin Watterson
    - Student Number: 2011-00002
    - Student Email: dwatterson@up.edu.ph

10. In the Request Types field, set the number next to <i>Sample Certificate</i> to 1
    - The new request (_Request B_) should appear in the **Active Inbox**

11. Navigate to the **Progress View** of _Request B_
- Observe that the new stages are used

<br/>
<p style="color: lightseagreen">
The OUR will no longer process the request type <i>Sample Certificate</i><br/>
</p>

12. Navigate to the **Edit Request Type Page** of _Sample Certificate_; click **Delete** and confirm

13. Navigate to the **Request Details Page** of _Request B_
- Observe that the request was unharmed

14. Navigate to the **Inbox** and press **Create a New Request**

15. Search for the request type
- Observe that it is no longer an option

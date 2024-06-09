# Example: Correcting mistakes
This section demonstrates the process of creating multiple requests and correcting errors that were made during the process

Functionalities demonstrated:
- creating multiple requests
- marking requests as stale
- rolling back requests
- editing request details
- sending chat messages
- reassigning requests

::: info
<p style="color: lightseagreen">
The teal colored text describes a situation to imagine, which prompts the next actions
</p>
:::

::: info
This guide can be followed with one account or two. 

If only using one account, then just take **Account A** and **Account B** to be yourself.

Otherwise, sign in to another account using another browser, that account will be called **Account B**, while the one you are using now will be called **Account A**
:::

_**<span style="color: peru">Using Account A</span>** unless specified otherwise_

<br/>
<p style="color: lightseagreen">
Milo Fishtooth makes a request for a <i>Certificate of Enrolment</i> and a <i>Certificate of Grade Equivalence</i> <br/>
Two copies of each are needed
</p>

1. Navigate to the **Inbox** and click on **Create New Request**

2. Input the following details:
    - Student Name: Milo Fishtooth
    - Student Number: 2010-02014
    - Student Email: mfishtooth@up.edu.ph

3. In the Request Types field, set the number next to <i>Certificate of Enrolment</i> and <i>Certificate of Grade Equivalence</i> to 2

4. Press **Add**
    - Two new requests should appear in the **Active Inbox**
        - _Certificate of Enrolment_ with Milo's details (_Request A_)
        - _Certificate of Grade Equivalence_ with Milo's details (_Request B_)

<br/>
<p style="color: lightseagreen">
Milo Fishtooth says he no longer needs the <i>Certificate of Grade Equivalence</i> (<i>Request B</i>) <br/>
</p>

5. Select _Request B_, then click **View Progress**
    - You should be redirected to the **Request Details Page**

6. Click on the 3 stacked dots in the upper right corner of the details and click **Mark as Stale**

7. Navigate back to your **Active Inbox**.
    - _Request B_ should now be gone

<br/>
<p style="color: lightseagreen">
You are also the staff to handle <i>Request A</i>
</p>

8. Select _Request A_, then pass it to yourself, by clicking **Pass to Next** and selecting yourself

<br/>
<p style="color: lightseagreen">
Preparation of the Certification asked for in <i>Request A</i> is finished. It is now <b>Account B</b>'s turn to process the request.
</p>

9. Select _Request A_, then pass it to **Account B**, by clicking **Pass to Next** and selecting the name of **Account B**

<br/>
<p style="color: lightseagreen">
It turns out, the request needs 3 copies rather than 2
</p>

10. <span style="color: peru">Using Account B</span>: Select _Request A_ from your **Active Inbox**, and send the chat message "Wrong number of copies, please rollback"
<br/><br/>

_**<span style="color: peru">Using Account A</span>** again_ <br/>
11. Navigate to your **Pending Inbox** and select _Request A_, then click **Rollback**

12. Select **Stage 1** as the stage to rollback to, then rollback the stage
    - _Request A_ shouldn't leave your pending inbox because you also handled **Stage 0**

13. Navigate to your **Active Inbox** and select _Request A_, then click **View Progress**
    - You should be redirected to the **Request Details Page**

14. Click on the 3 stacked dots in the upper right corner of the details and click **Edit Request**
    - A form containing the request's details should pop up

15. Change the number of copies to 3

<br/>
<p style="color: lightseagreen">
Preparation of the additional copy is finished. It is now <b>Account B</b>'s turn to process the request again.
</p>

16. Navigate to your **Active Inbox** and pass _Request A_ to **Account B** as before
    - The request should leave the **Active Inbox** and appear in the **Active Inbox** of **Account B**

<br/>
<p style="color: lightseagreen">
Milo Fishtooth says he actually does need the <i>Certificate of Grade Equivalence</i> (<i>Request B</i>) <br/>
</p>

17. Navigate to the **Discontinued** tab on the **Requests** page. Find _Request B_ and go to its **Request Details** page

18. Click on the 3 stacked dots and select **Reassign**
    - A form should pop up prompting you for the new handler

19. Select yourself as the new handler
    - _Request B_ should appear in your **Active Inbox** again
    - This is the method for marking a request as "un-stale"

::: warning
Steps 20 - 22 cannot be done without a second account as reassignment for non-stale requests can only be done between different accounts
:::

<p style="color: lightseagreen">
The owner of <b>Account B</b> is unavailable, but you have also the authority to process that particular stage in <i>Request A</i>
</p>

20. Navigate to the **Pending** tab on the **Requests** page. Find _Request A_ and go to its **Request Details** page

21. Click on the 3 stacked dots and select **Reassign**
    - A form should pop up prompting you for the new handler

22. Select yourself as the new handler

<br/>

23. Navigate to your **Active Inbox**
    - _Request A_ should be in your **Active Inbox** at the stage **Account B** should have processed

24. Click **View Progress**
    - You should be redirected to the **Request Details Page**

25. Observe the Progress and History
    - The progress should show you as the handler of the Stage, rather than **Account B**
    - The history should include the rollbacks and reassignments
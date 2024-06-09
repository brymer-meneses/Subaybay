# Example: Passing a request to completion
This section demonstrates the main flow of a request, from start to completion with no issues

Functionalities demonstrated:
- creating a new request
- passing a new request forward
- finishing and archiving a request
- notifying the requester automatically

::: info
<p style="color: lightseagreen">
The teal colored text describes a situation to imagine, which prompts the next actions
</p>
:::

<br/>
<p style="color: lightseagreen">
Johnny Bravo makes a request for a <i>Certificate of Enrolment</i> <br/>
Three copies are needed
</p>

1. Navigate to the **Inbox** and click on **Create New Request**

2. Input the following details:
    - Student Name: Johnny Bravo
    - Student Number: 1997-02004
    - Student Email: jbravo@up.edu.ph

3. In the Request Types field, set the number next to <i>Certificate of Enrolment</i> to 3 
    - The new request (_Request A_) should appear in the **Active Inbox**

<br/>
<p style="color: gray">
For this demonstration, we will assume that you are the only staff necessary to complete this request
</p>

4. Select _Request A_ and click on **Pass to Next**, select yourself as the handler
    - _Request A_ should still be in the **Active Inbox**, but with the stage changed

5. Repeat the previous step until the **Pass to Next** button is replaced by **Finish and Archive**

<br/>
<p style="color: lightseagreen">
The request is fully finished and ready for pickup
</p>

6. Click **Finish and Archive**
    - A popup should appear giving you the option to also notify the requester

<br/>
<p style="color: lightseagreen">
This request needs a custom email informing the requester that it is finished <br/>
It will be done by hand instead of automatically
</p>

7. Keep the toggle for "Send email to the student" off

8. Confirm finishing the request
    - _Request A_ should disappear from your *Active Inbox*

9. Navigate to the **Finished** tab of the **Requests Page**
    - _Request A_ should be in the list

10. Navigate to _Request A_'s **Request Details Page** for its Progress and History
    - The progress should show that all stages have a check mark
    - The history should show a log of every time the request was passed
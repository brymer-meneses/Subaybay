# Request Management
This section covers
- creating requests
- passing requests between members (pass to next, rollback, reassign)
- "removing" and reassigning discontinued requests
- finishing requests and notifying requesters
- editing existing requests

## Create a New Request
Creating requests is done from the **Inbox** Page.

**To create a new request**
1. Click on the **Create Request** button.

image

2. Enter in the *student number*, *student name*, and *student email*. <br/>
*In case the input format is wrong, the form will inform you.*

image of error messages

3. Click on the **select request type/s** field.

image

4. Select atleast one request type by clicking on the **plus**. <br/>
*The number being changed is the number of copies to be shown in the request details, NOT the number of requests to be made*

image

5. Click Add

image

After a while, the request/s should appear in the **Active Inbox**

## Pass to Next
When there are no issues, a request only moves forward to completion. 
<br/><br/>

Passing requests forward is done from the **Inbox** Page.

**To pass a request to another person**:
1. Select the request of interest from the **Active Inbox**

image

2. Click the **Pass to Next** button

image

3. Select the next handler

image

4. Confirm

image

Unless you choose yourself as the next handler, the request should disappear from your *Active* inbox and appear in your *Pending* inbox.

## Rollback
In case mistakes are made along the process and a request needs to be brought back to a previous stage, there is the option
to **Rollback** a request.
<br/><br/>

Rolling back requests is done from the **Inbox** Page.

**To rollback a request**:
1. Select the request of interest from the **Pending Inbox**

image

2. Click the **Rollback** button

image

3. Select the stage to rollback the request to <br/>
*Note that you can only rollback a request to a stage that you handled*

image

4. Confirm

image

Unless you handled the request at multiple stages, it should disappear from your **Pending Inbox**. It should now appear in your **Active Inbox**.

Note that when a request is rolled back, it is removed from the **Pending Inbox** of all those who handled it in the in-between stages. <br/>
For example, take this request that was moved forward several times through different staff members. <br/>
```
Staff 1 > Staff 2 > Staff 3 > Staff 4
```
In this case, the request is currently in the Active Inbox of Staff 4 and the Pending Inbox of Staff 1, 2, and 3. 
```
Active Inbox: Staff 4
Pending Inbox: Staff 1, Staff 2, Staff 3
```
If Staff 2 rolls back the request:
```
Staff 1 > Staff 2 > Staff 3 > Staff 4 > Staff 2
```
Then it will be removed from the Active Inbox of Staff 4 and the Pending Inboxes of Staff 2 and 3. Finally, it will be added to the Active Inbox of Staff 2, and the rollback will not affect Inbox of Staff 1.
```
Active Inbox: Staff 2
Pending Inbox: Staff 1
```

## Mark as Stale / Discontinue
In rare cases, a request can be cancelled while being processed. <br/>
To keep a complete record of all processes in the office, there is no way to delete a request without accessing the database directly.
<br/><br/>

Instead, requests can be **Marked as Stale**. This is done from the **Request Detail Page**.

*Note that only Pending requests can be marked as stale*

**To mark a request as stale**
1. Click on the stacked dots and select **Mark as Stale**

image

2. Confirm

image

The request should now disappear from all inboxes and appear in the **Discontinued** requests list.

To mark a request as not stale, it can be [reassigned](#reassign) to a handler

## Reassign
Sometimes, the person meant to handle a request isn't available. Thus, there is also the option
to **Reassign** a request to another person. Additionally, **Reassigning** requests is a way to "revive" a request that was **marked as stale**.
<br/><br/>

*Note: Finished requests cannot be reassigned, only Pending and Discontinued*

Reassigning requests can be done from two locations: the **Inbox** and the **Request Details Page**.

**To reassign a request from the inbox** <br/>
*This option is only available if the request is in your* ***Active Inbox*** <br/>
1. Select the request of interest from your **Active Inbox**

image

2. Click **Reassign**

image

3. Select the new handler <br/>
*Note that selecting yourself will not work*

image

4. Confirm

**To reassign request from the request details page**
1. Click the stacked dots and select **Reassign**

image

2. Select the new handler <br/>
*Note that selecting the current handler will not work*

image

3. Confirm

The reassignment should be reflected in the **Progress View** and **History View** of the request.

## Finish, Archive, and Notify
If a request was not discontinued, then it will eventually reach its Final Stage. At which point, it can be marked as finished and be removed from its handlers inboxes. Additionally, users are given the option to notify the requester via email that their request is done.
<br/><br/>

**Finishing and Archiving** requests is done from the **Inbox**. It can only be done to requests on their final stage. <br/>
When a request is on its final stage, the **Pass to Next** button in the **Inbox** should be replaced by a **Finish and Archive** button.

image

**To finish and archive a request**
1. Select the request of interest from the **Active** Inbox

image

2. Click the **Finish and Archive** button

image

3. (Optional) Toggle the "Send email to student" on

image

4. Confirm

image

The request should now disappear from all inboxes and appear in the **Finished** requests list. If "Send email to student" was toggled on, then an email should also be sent automatically.

## Edit Request Details
Sometimes, mistakes are made in entering request details or *remarks* need to be added along the way. For this purpose, it is possible to **edit** request details.
<br/><br/>

Editing request details is done from the **Request Details Page**

**To edit request details**
1. Click the stacked dots and select **Edit Request**

image

2. Input the new details

image

3. Confirm

The request details should immediately be reflected on the page once processing is finished.

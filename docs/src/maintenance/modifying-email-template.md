# Modifying Email Template

::: warning
The following section can be a little technical since it uses several programming and markup languages, but these will be explained as simply as possible.
:::

The following steps show how the hardcoded email template can be modified within the codebase. Note that afterwards, for the changes to be reflected within the app, the system must undergo [redeployment](/maintenance/redeployment).

The hardcoded email template is built as a Svelte component, named `ConfirmationEmail.svelte`. The file is located at

```text
/app/src/lib/components/email/ConfirmationEmail.svelte
```

## How to Modify the Template?

1. Open the codebase (the whole project folder) in any IDE or text editor, e.g. VS Code or Notepad++.
2. Find the file named `ConfirmationEmail.svelte`. As of writing, this should be located at `/app/src/lib/components/email/ConfirmationEmail.svelte`.
3. Open the file, you should then see the code divided into two sections:

   - the **script section** (within `<script lang="ts">...</script>`)
     - this contains the code to import data, which can then be inserted into the email
     - almost everything you need should already be imported, so you likely don't have to touch this part, except, for example, to add images
   - the **Html section** (within `<Html lang="en"><Text>...</Text></Html>`)
     - this contains the actual structure and format of the email template

   ![sections](sections.png)
   ::: tip
   The Html Section mostly uses basic HTML elements and the script section uses Typescript.
   :::

4. Modify each part of the template by following the guides in the [Script section](#script-section-guide) and [Html section](#html-section-guide).

## Script Section Guide

The script section uses basic Typescript syntax. Programming concepts are not needed, as this section is really only for importing _props_ (at least for the default email template). Think of these props as *prop*erties passed on to this component. Props are the data that we will be using. In the future, if the template needs further data processing, additional lines of code can be added to handle this (with Typescript).

::: info
Note that this guide will also cover the **fields** contained in each props. This way, if the template needs to include more information about the request in the future, you can refer back to this guide.
:::

In `ConfirmationEmail.svelte`, we can see two props declared. The word after `export let` is the variable name, and the word after the variable is its type.
![Script props](script_props.png)

1. `request` <br>
   The `request` prop is of type `Request` (please take note of the capitalization).
   The following fields in the table below are available for any data of type `Request`. You may refer to the codebase for the complete list of fields, but here are some that are likely to be useful.
   | Field | Type | Info | Usage |
   | ------------- | :-----------: | ---- | ---- |
   |`studentNumber`| string | This field contains the student number of the requester. (example: 2021-12345) | `request.studentNumber`|
   |`studentName`| string| This field contains the name of the requester. (example: Mikasa Dela Cruz)| `request.studentName`|
   |`studentEmail`| string | This field contains the email of the requester. (example: lackerman@aot.edu.ph) | `request.studentEmail`|
   |`purpose`| string | This field contains the purpose of the request. | `request.purpose`|
   |`remarks`| string | This field contains any remarks that came along with the request. | `request.remarks`|
   |`copies`| number | This field contains the number of copies the requester had requested. (example: 3) | `request.copies`|

   ::: info
   The syntax for obtaining a field value from a variable is `<variable_name>.<field>`, e.g. `request.purpose` where `request` is the variable name and `purpose` is the field.
   :::

2. `requestType` <br>
   The `requestType` prop is of type `RequestType` (please take note of the capitalization).
   The following fields in the table below are available for any data of type `RequestType`. You may refer to the codebase for the complete list of fields, but here are some that are likely to be useful.
   | Field | Type | Info | Usage |
   | ------------- | :-----------: | ---- | ---- |
   |`title`| string | This field contains the title of the request. (example: Official Transcript of Records (OTR) - First Request) | `requestType.title`|
   |`version`| number |This field contains the version number of the current request type. (example: 1) | `requestType.version`|

   ::: info
   The syntax for obtaining a field value from a variable is `<variable_name>.<field>`, e.g. `requestType.title` where `requestType` is the variable name and `title` is the field.
   :::

## Html Section Guide

The Html section mostly uses basic HTML elements, with exception of `<Html></Html>` and `<Text></Text>`, which are both imported from the `svelte-email` library. Note that other components from the `svelte-email` library can still be used (please visit [their documentation](https://svelte-email.vercel.app/docs/overview/svelte-email) for these additional components). This section works like normal HTML, but for simplicity, `div` elements will not be included in the guide (everything will be written inline from top to bottom).
![Html Section](html_section.png)
In `ConfirmationEmail.svelte`, we can see the default email template hardcoded along with some HTML elements. This section provides some of the basic elements that can be used.

| Element                          | Info                                                                                                                                 | Possible Usage                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `<br>`                           | In HTML, despite hitting `Enter` on your keyboard, the text will still be on the same line. Thus, this is used to *br*eak the lines. | `First Line <br> Second Line`                                                               |
| `<strong></strong>` or `<b></b>` | Any text written in between these tags will be displayed as **bold**.                                                                | `normal text <strong>bold text</strong>`                                                    |
| `<u></u>`                        | Any text written in between these tags will be displayed with an <ins>underline</ins>.                                               | `normal text <u>underlined text</u>`                                                        |
| `<span></span>`                  | This is just a span of space if you want to group a certain portion of text. This can be used to style them with inline CSS.         | `Your request for <span style="color:red">TCG</span> is ready for pickup.`                  |
| `<a href="..." ></a>`            | This element is used for adding links to texts. The link is added as the `href` property.                                            | `Watch the funny cat video <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">here</a>.` |
| `<img src={...}/>`               | This element is used for adding images. The source `src` takes the path to the image displayed.                                         | Please see the code block below.                                                            |

```svelte
<script lang="ts">
    import CAT from "$lib/cats/photos/oiiai.png"
</script>

<Html lang="en">
    <Text>
        Here is a picture of a cat. <br>
        <img src={CAT}/>
    </Text>
</Html>
```

::: tip
Note that in order to use dynamic data in our HTML, svelte lets us use the variable names enclosed in curly braces `{}` to render their values on to the elements. For example, if we want to display the value of a variable `x`, we do the following:

```svelte
<script lang="ts">
    let x = 12;
</script>

<Html lang="en">
    <Text>
        The value of x is {x}.
    </Text>
</Html>

```

This will be displayed as:

```
The value of x is 12.
```

This means that if someone named `Andre` has requested a `TCG` and his request data is stored in the variable `request`, then we can access different data specific to his request by doing the following:

```svelte
<script lang="ts">
    import { Html, Text } from "svelte-email";
    import type { Request, RequestType } from "$lib/server/database";

    export let request: Request;
    export let requestType: RequestType;
</script>

<Html lang="en">
    <Text>
        Good day, {request.studentName}! <br>
        Your request for {requestType.title} is ready for pickup.
    </Text>
</Html>
```

This will be displayed as:

```
Good day, Andre!
Your request for TCG is ready for pickup.
```

:::

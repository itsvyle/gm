# gm
* **GM is a javascript browser library created by me (@itsvyle) to facilitate the use of javascript in browser.**
* **It permits the creation of short code blocks to make simple animations or interactivity.**
* **It should be compatible with most versions of javascript, even the older ones**
* **IMPORTANT: Most of the functions need the `gm.css` file to be imported as well**
## Importation
**Import from GitHub**
```html
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>GM !</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://raw.githubusercontent.com/itsvyle/gm/main/gm.js" type="application/javascript"></script>
    <link href="https://raw.githubusercontent.com/itsvyle/gm/main/gm.css" rel="stylesheet">
  </head>
  <body>
    <!--put whatever code here-->
  </body>
</html>
```

**From Cloned**
```html
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>GM !</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="/gm/gm.js" type="application/javascript"></script>
    <link href="/gm/gm.css" rel="stylesheet">
  </head>
  <body>
    <!--put whatever code here-->
  </body>
</html>
```

**From REPL Proxy**
```html
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>GM !</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="//gm.lfny.repl.co/gm/gm.js" type="application/javascript"></script>
    <link href="//gm.lfny.repl.co/gm/gm.css" rel="stylesheet">
  </head>
  <body>
    <!--put whatever code here-->
  </body>
</html>
```

# Functions
*Add `gm.` in front of every one of those*

* **`onload(clb : function)`**: Clb will be called on the html document load.
* **`newItem(nodeName : string,[options : object,[parent : node]]) : node`**: Creates a new HTML node. All the `options` will be assigned to the object, and the object will be appended to `parent` (if provided). Returns the created node.
* **`request(url : string,[options : object = {}],callback : function) : void`**: Makes a webrequest (XMLHttp) to the `url`. See the explications by scrolling down.
* **`formatNumber(n : number) : string`**: formats the number `n` into a more readable string. (Example: 1234 = "1'234").
* **`validateOptions(obj : object,defaults : object,[required : array]) : boolean|string`**: Checks the validity of an object (`obj`). It will merge it with the defaults and check the required fields in the object.
* **`copyText(text : string) : void`**: Copies text to the clipboard.
* **`changeURL(url : string,[title : string]) : void`**: Changes the url that is shown in the url bar of the client. Title is purely optionnal, made to go in the browser history.
* **`UTCTime([date : Date = new Date()]) : number`**: Gets the UTC timestamp for a `date`.
* **`multilineTextArea(textarea : HTML Textarea,[minheight_ : number = textarea.clientHeight,[submit : function]],`**: Lets a textarea become multiline. If the user presses shift and enter at the same time, it will create a new line. `submit`, if provided, will be called when the user presses enter and submits his entry.

## gm.request(url : string,[options : object = {}],callback : function)
GET Request:
```javascript
//A normal GET request
request("https://www.example.com",null,function (r) {
  if (r.status !== 1) { /*There was an error in making the web request*/
    console.error(r.error);
    return;
  }
  console.log(r.res);
});
//A GET request with a json format return
request("https://www.example.com/example.json",{json: true},function (r) {
  if (r.status !== 1) { /*There was an error in making the web request OR the request return was unreadable JSON*/
    console.error(r.error);
    return;
  }
  console.log(r.res);
});
```

POST Request:
```javascript
//A simple POST request with a json return. We will be sending login credentials
request("/login",{
  json: true,
  method: "POST",
  body: "username=user&password=pwd"
},function (r) {
  if (r.status !== 1) { /*There was an error in making the web request OR the request return was unreadable JSON*/
    console.error(r.error);
    return;
  }
  console.log(r);
});
```

# Classes
This library also provides classes, most notably for visualization / interactivity on the client view.

## Modal
Creates a modal that can be shown in front of other data to the user
**Reference:**
* **constructor([className : string = "__modal-full-screen"]) : void**: The constructor of the class. `className` is the "type" of the modal. For now, the only two options are `__modal-full-screen` and `__modal-margins`.
* **createIframe() : self**: Creates and iframe in the modal to show data. Returns self
* **append() : self**: Appends the iframe to the document body. Returns self.
* **open([showCloseButton : boolean = true]) : void**: Opens the modal.
* **close([clb : function]) : void**: Closes/Hides the modal.
If iframe was created:
* **navigate(url : string) : self**: Navigates to a certain url and opens the modal. Returns self.
* **navigateHTML(html : string,[addBaseHTML : boolean = false]) : self**: Navigates to and `html` document. `addBaseHTML` is whether or not the base html tags such as `<body>` or `<head>` should be added automatically. Returns self.

You can also access the modal and the iframe by respectivly using `<modal>.modal` and `<modal>.iframe`.

```javascript
var modal = new gm.Modal(); //Creates a full-screen modal
modal.createIframe(); //Creates the iframe in the modal
modal.append(); //Appends the modal to the document body
modal.navigateHTML('<h1>This is in a modal !</h1>',true); //Opens this html document in the iframe. 
//As the base html tags aren't in the html, set second parameter to 'true' and the base tags will be added
```

```javascript
//But it can also be done this way:
var modal = new gm.Modal();
modal.createIframe().append().navigateHTML('<h1>This is in a modal !</h1>',true); //We can merge both the commands on the same line as each function returns the modal object
```

## NotificationMessages
Creates a support for messages to display in the bottom left of the screen

**Reference**:
* **contructor([style : string = ""])**: Creates the class and appends the notifications container to body. `style` is the extra style for the container, for example if you wish to change it's position on screen
* **addMessage(message : string,[style : string = "",[timeout : number = false,[closeOnClick : boolean = false]]]) : HTML Div**: Creates a new notification. Arguments are:
  * `message`: (required) The text content of the notification
  * `style`: (optionnal) The extra style for the notification, for example color or background. Must be valid CSS (view example). By default, `background-color` is green and `color` is white.
  * `timeout`: (optionnal) The time that it will take for the notification to hide (in milliseconds). If not provided, the notification will stay visible until it is manually removed.
  * `closeOnClick`: (optionnal) Whethever or not the user is able to close the notification by clicking on it.
* (property) `showTimeBar : boolean = true`: This defines whether or not a timebar should be shown on messages with timeout to show the time that is left before it dissapears

```javascript
var not = new gm.NotificationMessages(); //Create the object
```
First, I will send a notification warning the user that the page is loaded. It will dissapear after 2 seconds and user will not be able to remove it by clicking
```javascript
not.addMessage("The page is loaded !",null,2000,true);
```
Then, imagine I make a web request. If the response is successfull, I will tell the user "Success getting data". If not, the I will ask the user to reload his page to try again
```javascript
if (request.isSuccessfull) {
  not.addMessage("Success getting the data",null,2500,true); //Notification will dissapear after 2.5 seconds, but he can close it faster by clicking on it
} else {
  not.addMessage("Error getting data. Please reload page","background-color: red;",false,false); //Notification has a red background, and cannot be closed in any way
}
```

## ContextMenu
A context menu is a very usefull tool to add options to a website

**Reference**:
* **constructor([menuType : number = 1]) : void**: Creates the context menu, but it is still invisible. `menuType` is the style type of the menu. For now, there are only two types of menus (`1` and `2`)
* **contextMenu(event : HTML Event,items : Array\<object\>)**: Opens the context menu with the items to show in the context menu (see structure later). THIS FUNCTION MUST BE TRIGGERED BY AN HTML EVENT.
* **close()**: Closes the context menu
* **fullContext(element : HTML Node,items : Array\<object\>,events : Array\<string\>|string)**: This function is made to easily add the context menu on any item.`element` is the item that will be the trigger for opening context menu. `items` is an array of items to show in the context menu (see structure later). `events` is the event(s) to listen for on the `element` to show the context menu. For example, I might want the context menu to show not only on a right-click but also on a left-click.

**Items structure**:
The items are the fields that will be shown inside the context menu.
It must be an array, with items of one of the following formats:
**Button**:
```javascript
var items = [
  {
    label: "A context menu item", //What will be shown in the menu item
    onclick: function (event) {
      alert("Item clicked !");
    }, //Function that will be triggered when the user clicks the options
    title: "This is the item's title" //(optionnal) what will show when the user hovers over the item
  }
];
```
**Separator**:
```javascript
var items = [
  {type: "separator"}
];
```

```javascript

```

## CSS Defaults
```css
html, body, div, h1, h2, h3, h4, h5,  h6, ul,  ol,  li,  p,  blockquote, pre,  form,  fieldset,  table,  th,  td {
    margin: 0;
    padding: 0;
}
```

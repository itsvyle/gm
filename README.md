# gm
* **GM is a javascript browser library created by me (`@itsvyle`) to facilitate the use of javascript in browser.**
* **It permits the creation of short code blocks to make simple animations or interactivity.**
* **It should be compatible with most versions of javascript, even the older ones**

## Importation
**Import from GitHub**
```html
<html>
  <head>
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

```javascript
var modal = new gm.Modal(); //Creates a full-screen modal
modal.createIframe(); //Creates the iframe in the modal
modal.append(); //Appends the modal to the document body
```

```javascript
//But it can also be done this way:
var modal = new gm.Modal();
modal.createIframe().append(); //We can merge both the commands on the same line as each function returns the modal object
```

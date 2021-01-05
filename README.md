# gm
* **GM is a javascript browser library created by me (`@itsvyle`) to facilitate the use of javascript in browser.**
* **It permits the creation of short code blocks to make simple animations or interactivity.**
* **It should be compatible with most versions of javascript, even the older ones**

## Importation
**Import from GitHub**
---
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

* **`onload(clb : function)`**: Clb will be called on the html document load
* **`newItem(nodeName : string,[options : object,[parent : node]]) : node`**: Creates a new HTML node. All the `options` will be assigned to the object, and the object will be appended to `parent` (if provided). Returns the created node
* **`request(url : string,[options : object = {}],callback : function) : void`**: Makes a webrequest (XMLHttp) to the `url`. See the explications by scrolling down.
* **`formatNumber(n : number) : string`**: formats the number `n` into a more readable string. (Example: 1234 = "1'234")
* **`validateOptions(obj : object,defaults : object,[required : array]) : boolean|string`**: Checks the validity of an object (`obj`). It will merge it with the defaults and check the required fields in the object.


## gm.request
GET Request:
```javascript
//A normal get request
request("https://www.example.com",null,function (r) {
  if (r.status !== 1) { /*There was an error in making the web request*/
    
    return;
  }
});
```

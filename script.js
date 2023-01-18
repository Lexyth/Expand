//You're on github. 
//You just opened this file and found no flaws in it.
//Now go away, there's nothing to see here.
//This is private property! Stop reading! 
//Help! I'm being robbed! Someone's stealing my intec... intelect... my brain's property!

//Seriously though, I wanted to clean this up, but then didn't, so... deal wiv it!

//TODO: gotta clean this up... (told ya so!)

//TODO: refactor everything and make sure nothing other than textAreas can be operated on (ie.: no more checking if you're deleting a vert or hori cause you don't, you only delete tA's and if they leave something empty that's gotta be gone automatically!)

function getType(elem) {
  
  if (elem)
    
    if (elem.constructor.name === "HTMLDivElement") {
      
      if (elem?.classList?.contains("hori"))
        return "hori";

      else if (elem?.classList?.contains("vert"))
        return "vert";

    } else if (elem.constructor.name === "HTMLTextAreaElement")
      return "tA";
  
  return typeof elem;
}

function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

let container = document.querySelector("#container");

      container.addEventListener("click", (evt) => {
        if (evt.target === container) {
          evt.stopPropagation();
          container.children[container.children.length-1].focus();
        }
      }, false);

let unique = () => {
  let x = 0;
  return () => {
    return x++
  };
}

let selection;
let select = (elem) => {
  selection?.classList.remove("selected");
  selection = elem;
  selection.classList.add("selected");
  selection.focus();
}

addEventListener("focusin", e => select(e.target));

/***********************DEPRECATED

function containerOf (elem) {
  let cont = elem.parentElement;
  while (!cont.classList.contains("vert"))
    cont = cont.parentElement;
  return cont;
};

//DEPRECATED*********************/

//TODO: add support for create("hori", tA/"text", ...elements)
//create:
//vert: create("vert", elements),
//hori: create("hori", tA/"text", vert),
//tA: create("tA", "text")
function create (type, ...rest) {
  
  function createTA (text) {
    
    let tA = document.createElement("textarea");
    setTimeout(function(){
      OnInput.call(tA);
    }, 10);
    
    tA.addEventListener("input", OnInput, false);
    
    if (text)
      tA.value = text;
    return tA;
  }
  
  function createVert (elements) {
    
    let vert = document.createElement("div");
    
    vert.classList.add("vert");
    
    vert.addEventListener("click", (evt) => {
      if (evt.target === vert) {
        evt.stopPropagation();
        vert.children[vert.children.length-1].focus();
      }
    }, false);
    
    for (let elem of elements)
      if (getType(elem) == "tA" || getType(elem) == "hori")
        vert.append(elem);
      else
        throw `Unsupported type: ${getType(elem)}`;
    
    return vert;
  }
  
  function createHori (text, vert) {
    
    let hori = document.createElement("div");
    
    hori.classList.add("hori");

    hori.addEventListener("click", (evt) => {
      if (evt.target === hori) {
        evt.stopPropagation();
        hori.children[0].focus();
      }
    }, false);

    switch (getType(text)) {
      case "string":
        hori.append(createTA(text));
        break;
      case "tA":
        hori.append(text);
        break;
      case "unde" + "fined": //why tf does it always delete quotes?!
        break;
      default: 
        throw `Unsupported type: ${getType(text)}`;
    }

    if (getType(vert) == "vert")
      hori.append(vert);
    else if (vert !== undefined)
      throw `Unsupported type: ${getType(vert)}`;

    return hori;
  }

  switch (type) {
      
    case "tA":
      return createTA(rest[0]);
      break;
      
    case "hori":
      return createHori(rest[0], rest[1]);
      break;
      
    case "vert":
      return createVert(rest);
      break;
      
    default:
      throw `Unsupported type: ${type}`;
  }
}

function getTA (tAHori) {
  if (getType(tAHori) == "hori")
    return tAHori.children[0];
  return tAHori;
}

function getBlock (tAHori) {
  if (getType(tAHori.parentElement) == "hori")
    return tAHori.parentElement;
  return tAHori;
}

/***********************DEPRECATED
//TODO: add params to automatically fill in data, like: 
//children for vert,
//tA and vert (use create("vert") to add individual children) for hori,
//or text for tA.
//Likely gotta be using the arguments variable for that.
function create (type) {
  
  if (type === "tA") {
    let tA = document.createElement("textarea");
    setTimeout(function(){
      OnInput.call(tA);
    }, 10);
    tA.addEventListener("input", OnInput, false);
    return tA;
  }
  
  let div = document.createElement("div");
  
  switch (type) {
    case "vert": 
      div.classList.add("vert");
      div.addEventListener("click", (evt) => {
        if (evt.target === div) {
          evt.stopPropagation();
          div.children[div.children.length-1].focus();
        }
      }, false);
      break;
    case "hori":
      div.classList.add("hori");
      div.addEventListener("click", (evt) => {
        if (evt.target === div) {
          evt.stopPropagation();
          div.children[0].focus();
        }
      }, false);
      break;
  }
  
  return div;
}

//DEPRECATED*********************/

let add = (elem, dir) => {
  if (getType(elem) != "tA")
    throw `Unsupported type: ${getType(elem)}`;
  
  let tA = create("tA");
  if (getType(elem.parentElement) == "hori")
    elem = elem.parentElement;
  if (dir === "up")
    elem.before(tA);
  else if (dir === "down")
    elem.after(tA);
  return tA;
};

let extend = (elem) => {
  
  if (getType(elem.parentElement) != "hori") {
    
    let div = create("hori");
    
    elem.replaceWith(div);
    
    let tA = create("t" + "A");
    div.append(elem, create("vert", tA)); //div.append(elem);
    
    //let cont = create("vert");
    
    //let tA = create("tA");
    //cont.append(tA);
    
    //div.append(cont);
    
    return tA;
  }
};

function findTextArea (elem, dir) {
  if (getType(elem) != "tA")
    throw `Unsupported type: ${getType(elem)} for findTextArea (tA, dir)`;
  
  if (getType(elem.parentElement) == "hori")
    elem = elem.parentElement;
  //elem = getBlock(elem);
  
  let result;
  switch (dir) {
    case "up":
      result = elem.previousElementSibling;
      break;
    case "down":
      result = elem.nextElementSibling;
      break;
    case "left":
      result = elem.parentElement.previousElementSibling;
      break;
    case "right":
      result = elem.children[1]?.children[0];
      break;
  }
  if (!result)
    result = elem;
  
  if (getType(result) == "hori") 
    result = result.children[0];
  //result = getTA(result);
  
  if (getType(result) !== "tA")
    result = elem;
  
  return result;
}

//can only ever move textareas! If they have a hori attached, that gets pulled along!
//missing moving to the left and right... 
//left should be appended on the left vert below the current parent (which should be a hori)
//right should append to the bottom of the vert of the current upper element (make it into a hori if not yet)
function move (textarea, dir) {
  if (getType(textarea) != "tA")
    throw `Error: Textarea expected, got ${getType(textarea)}`;
  
  let self = textarea;
  let target = findTextArea(self, dir);
  
  if (getType(self.parentElement) == "hori") self = self.parentElement;
  if (target.parentElement.classList.contains("hori")) target = target.parentElement;
  
  switch (dir) {
    case "up":
    case "down":
      if (target !== self) {
        let placeholder = document.createElement("span");
        self.replaceWith(placeholder);
        target.replaceWith(self);
        placeholder.replaceWith(target);
      }
      break;
    case "left":
      if (target !== self) {
        target.after(self);
        if (target.children[1].children.length === 0) {
          target.replaceWith(target.children[0]);
        }
      }
      break;
    case "right":
      target = findTextArea(getTA(self), "up");
      if (target !== getTA(self)) {
        switch (getType(target.parentElement)) {
          case "vert":
            let vert = create("vert");
            vert.append(self);
            let hori = create("hori");
            target.replaceWith(hori);
            hori.append(target);
            hori.append(vert);
            break;
          case "hori":
            target.nextElementSibling.append(self);
            break;
        }
      } else {
        let hori = create("hori");
        hori.append(create("tA"));
        hori.append(create("vert"));
        self.replaceWith(hori);
        hori.children[1].append(self);
      }
      break;
  }
}

function remove (elem) {
  //TODO: find a close tA and select that instead of just the container's first tA...
  select(getType(container.children[0]) == "tA" ? container.children[0] : container.children[0].children[0]);
  switch (getType(elem.parentElement)) {
    case "vert":
      if (elem.parentElement.children.length === 1 && elem.parentElement.id !== "container")
        remove(elem.parentElement);
      else 
        elem.remove();
      break;
    case "hori":
      switch (getType(elem)) {
        case "vert":
          elem.parentElement.replaceWith(elem.parentElement.children[0]);
          break;
        case "hori":
          throw "Error: Found Hori directly within Hori! This must not be!";
          break;
        case "tA":
          remove(elem.parentElement);
          console.log("Should have selected new one...")
          break;
      }
      break;
    case "tA":
      throw "Error: Found TextArea acting as a parent! This must not be!";
      break;
  }
  if (container.children.length === 0) {
    let tA = create("tA");
    container.append(tA);
    select(tA);
  }
}

addEventListener("keydown", kE => {
  if (kE.key === "ArrowUp" || kE.key === "ArrowDown" || kE.key === "ArrowLeft" || kE.key === "ArrowRight") {
    if (kE.ctrlKey) {
      let target = findTextArea(selection, kE.key.slice(5).toLowerCase());
      if (target === selection || kE.metaKey) {
        if (kE.key === "ArrowUp") target = add(selection, "up");
        else if (kE.key === "ArrowDown") target = add(selection, "down");
        else if (kE.key === "ArrowRight") target = extend(selection);
      }
      if (target)
        target.focus();
    } else if (!kE.ctrlKey && kE.metaKey) {
      move(selection, kE.key.slice(5).toLowerCase());
      selection.focus();
    }
  } else if (kE.key === "Backspace" && kE.metaKey && kE.ctrlKey)
    if (confirm("Are you sure you want to delete this?! This can't be undone, not to mention that the code could be failty in the first place!!"))
      remove(selection);
});

import "https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/5.2.1/Dropbox-sdk.js";

let auth = (() => {
  (function (window) {
    window.utils = {
      parseQueryString(str) {
        const ret = Object.create(null);
        if (typeof str !== 'string') {
          return ret;
        }
        str = str.trim().replace(/^(\?|#|&)/, '');
        if (!str) {
          return ret;
        }
        str.split('&').forEach((param) => {
          const parts = param.replace(/\+/g, ' ').split('=');
          // Firefox (pre 40) decodes `%3D` to `=`
          // https://github.com/sindresorhus/query-string/pull/37
          let key = parts.shift();
          let val = parts.length > 0 ? parts.join('=') : undefined;
          key = decodeURIComponent(key);
          // missing `=` should be `null`:
          // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
          val = val === undefined ? null : decodeURIComponent(val);
          if (ret[key] === undefined) {
            ret[key] = val;
          } else if (Array.isArray(ret[key])) {
            ret[key].push(val);
          } else {
            ret[key] = [ret[key], val];
          }
        });
        return ret;
      },
    };
  }(window));

  var CLIENT_ID = '4rd4mg7uuzs6jpu';

  function getAccessTokenFromUrl() {
    console.log(`Url: ${window.location.hash}`);
    return utils.parseQueryString(window.location.hash).access_token;
  }

  function isAuthenticated() {
    return !!getAccessTokenFromUrl();
  }

  return (retry) => {
  if (isAuthenticated() && !retry) {
    console.log("Authenticated");
    let token = getAccessTokenFromUrl();
    console.log(`Token: ${token}`);
    return new Dropbox.Dropbox({ fetch: fetch, accessToken: getAccessTokenFromUrl() });
  } else {
    console.log("Not Authenticated");
    let dbx = new Dropbox.Dropbox({ fetch: fetch, clientId: CLIENT_ID });
    var authUrl = dbx.getAuthenticationUrl(window.location.href);
    let a = document.createElement("a");
    a.href = authUrl;
    try {
      a.click();
    } catch (err) {
      alert("Authentication failed!");
    }
  }
  }
})();

let dbx = auth();

function traverse (parent, accumulator) {
  
  //linear version #HardButUseful... might break tho
  let elem = parent;
  
  do {
    if (elem.constructor.name === "HTMLDivElement") {
      if (elem.classList.contains("vert")) {
        accumulator?.onVert?.(elem); //reconsider passing elem
        elem = elem.children[0];
      } else if (elem.classList.contains("hori")) {
        accumulator?.onHori?.(elem); //reconsider passing elem
        elem = elem.children[0];
      } else 
        throw `Unknown HTMLDivElement: '${elem.classList}'. Only HTMLDivElements with classes ".vert" or ".hori" are supported.`
    } else if (elem.constructor.name === "HTMLTextAreaElement") {
      accumulator?.onText?.(elem); //reconsider passing the entire elem
      while (elem !== parent && !elem.nextElementSibling) {
        accumulator?.onBack?.(elem); //reconsider passing elem
        elem = elem.parentElement;
      }
      if (!elem || elem === parent)
        break;
      elem = elem.nextElementSibling;
    } else throw `Unknown Element: '${elem.constructor.name}'. Only HTMLDivElement and HTMLTextAreaElement are supported.`;
  } while (elem != parent);
  
  //recursive version #EasyButNon-reusable
  /*
  function rec (elem) {
      switch (elem.constructor.name) {
        case "HTMLDivElement":
          if (elem.classList.contains("hori")) {
            let text = rec(elem.children[0]).text;
            let content = rec(elem.children[1]);
            return {text: text, content: content};
          } else if (elem.classList.contains("vert")) {
            let content = [];
            for (let child of elem.children)
              content.push(rec(child));
            return content;
          }
          break;
        case "HTMLTextAreaElement":
          return {text: elem.value};
          break;
      }
    return res;
  }

  return JSON.stringify(rec(parent));*/

}

function compileDraft (origin, condition = (elem) => true) {
  let book = document.querySelector("#book");
  book.replaceChildren();
  
  let pre = (text) => {
    let pre = document.createElement("pre");
    pre.innerText = text;
    return pre;
  };
  
  if (condition(origin))
    book.append(pre(origin.value));
  
  if (origin.nextElementSibling)
    traverse(origin.nextElementSibling, {
    onVert: (elem) => {},
    onHori: (elem) => {},
    onText: (elem) => {
      if (condition(elem))
        book.append(pre(elem.value));
    },
    onBack: (elem) => {}
  });
}

//could refactor into linear, too, but no real point  Compile is useful for other stuff, but this? Idk...
function construct (target, json) {
  json = JSON.parse(json);
  
  function rec (obj) {
    if (Array.isArray(obj)) {
      let vert = create("vert");
      for (let item of obj)
        vert.append(rec(item));
      return vert;
      
    } else if (typeof obj === "string" || (obj.hasOwnProperty("text") && !obj.content)) {
      let tA = create("tA");
      let prop = "text"; //why tf do I have to make this a variable?
      tA.value = obj.hasOwnProperty(prop) ? obj.text : obj; //why tf are the quotes always stipped for the literal in hasOwnProperty?!
      
      if (obj.state)
        tA.dataset.state = obj.state;
      
      return tA;
      
    } else {
      let hori = create("hori");
      hori.append(rec(obj.state?{text:obj.text, state:obj.state}:obj.text), rec(obj.content)); //ugh, having to make a new object with all properties may become troublesome later on...
      return hori;
    }
  }
  
  let result = rec(json.length === 1 ? json[0] : json);
  
  {
    let that = result;
    while (that && that.constructor.name !== "HTMLTextAreaElement")
      that = that.children[0];
    select(that);
  }
  
 
  switch (getType(target)) {
    case "vert":
      switch (getType(result)) {
        case "vert":
          if (target.children.length === 0) {
            while (result.children.length > 0) {
              target.append(result.children[0]);
            }
          } else {
            let hori = create("hori");
            hori.append(create("tA"));
            hori.append(result);          
            target.append(hori);
          }
          break;
        case "hori":
        case "tA":
          target.append(result);
      }
      break;
    case "hori":
      switch (getType(result)) {
        case "vert":
          if (target.children?.[1]?.length === 0) {
            target.children[1].replaceWith(result);
          } else {
            let hori = create("hori");
            hori.append(create("tA"));
            hori.append(result);
            target.children[1].append(hori);
          }
          break;
        case "hori":
          if (!target.children?.[0]?.value && target.children?.[1]?.length === 0) {
            target.replaceWith(result);
            break;
          }
        case "tA":
          target.children[1].append(result);
      }
      break;
    case "tA":
      let hori;
      switch (getType(result)) {
        case "vert":
          hori = extend(target).parentElement;
          hori.append(target);
          hori.append(result);
          break;
        case "hori":
        case "tA":
          if (!target.value) {
            target.replaceWith(result);
          } else {
            hori = extend(target).parentElement;
            hori.append(target);
            hori.append(create("vert"));
            hori.children[1].append(result);
          }
          break;
      }
  }

}

function saveData (data, fileName) {
  
    const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
  
  dbx.filesListFolder({path: ''})
    .then(function(response) {
    for (let entry of response.entries)
      if (entry.name === fileName + ".txt")
        if (!confirm(`A file with the name ${fileName}.txt already exists! Do you want to overwrite it?`))
          return "aborted";
    
    
    const file = new Blob([data], {
  type: "text/plain",
});
file.name = `${fileName}.txt`;

if (file.size < UPLOAD_FILE_SIZE_LIMIT) { // File is smaller than 150 Mb - use filesUpload API
        dbx.filesUpload({path: '/' + file.name, contents: file, mode:'overwrite'})
  //.then(function(response) {})
          .catch(function(error) {
            console.error(error);
          });
      }
    
    
          }).catch(error => {
    console.error(error);
  });
}

function save (fileName) {
  
  
let jsonString = "";
traverse(container, {
  
  onVert: (elem) => {
    jsonString += '['
  },
  
  onHori: (elem) => {
    jsonString += elem.previousElementSibling?',':"";
  },
  
  onText: (elem) => {
    jsonString += `${elem.previousElementSibling?",":""}{"text":${JSON.stringify(elem.value)}${elem.dataset.state?`,"state":${JSON.stringify(elem.dataset.state)}`:""}`; jsonString += elem.parentElement.classList.contains("hori")?',"content":':'}';
  },
  
  onBack: (elem) => {
    jsonString+= elem.parentElement && elem.parentElement.classList.contains("vert") ? "]" : "}";
  }
});

  //let jsonString = traverse(container); //for recursive compile only
  saveData(jsonString, fileName);
}

function load (fileName) {
  
  dbx.filesListFolder({path: ''})
    .then(function(response) {
    let found = false;
    for (let entry of response.entries)
      if (entry.name === fileName + ".txt")
        found = true;
    if (!found) {
      alert(`Couldn't find file with the name: ${fileName}\nin : ${response.entries.map(entry=>entry.name)}`)
return "not found";
    }
  
  dbx.filesDownload({path: `/${fileName}.txt`})
    .then(function (response) {
        response.fileBlob.text().then(result => {
          container.replaceChildren();
          construct(container, result);
});
    })
    .catch(function (error) {
        console.log(error);
    })
    }).catch(error => {
    console.error(error);
  });
}

let menu = document.querySelector("#menu");

let saveBtn = document.createElement("button");
saveBtn.innerText = "Save";
saveBtn.onclick = () => {
  let fileName = prompt("Enter file name (without .txt):", "default");
  if (fileName)
    save(fileName);
};
saveBtn.classList.add("btn");

let loadBtn = document.createElement("button");
loadBtn.innerText = "Load";
loadBtn.onclick = () => {
  let fileName = prompt("Enter file name:", "default");
  if (fileName)
    load(fileName);
};
loadBtn.classList.add("btn");

let authBtn = document.createElement("button");
authBtn.innerText = "Auth";
authBtn.onclick = () => {
  dbx = auth(true);
};
authBtn.classList.add("btn");

let addBtn = document.createElement("button");
addBtn.innerText = "+";
addBtn.onclick = () => {
  add(selection, "down");
};
addBtn.classList.add("btn");

let extendBtn = document.createElement("button");
extendBtn.innerText = "{";
extendBtn.onclick = () => {
  extend(selection);
};
extendBtn.classList.add("btn");

let moveUpBtn = document.createElement("button");
moveUpBtn.innerText = "^";
moveUpBtn.onclick = () => {
  move(selection, "up");
};
moveUpBtn.classList.add("btn");

let moveDownBtn = document.createElement("button");
moveDownBtn.innerText = "v";
moveDownBtn.onclick = () => {
  move(selection, "down");
};
moveDownBtn.classList.add("btn");

let moveLeftBtn = document.createElement("button");
moveLeftBtn.innerText = "<";
moveLeftBtn.onclick = () => {
  move(selection, "left");
};
moveLeftBtn.classList.add("btn");

let moveRightBtn = document.createElement("button");
moveRightBtn.innerText = ">";
moveRightBtn.onclick = () => {
  move(selection, "right");
};
moveRightBtn.classList.add("btn");

let stateDiv = document.createElement("div");
{
  let stateBtn = (state) => {
    let btn = document.createElement("button");
    btn.dataset.state = state;
    btn.onclick = () => {
      selection.dataset.state = state;
    };
    btn.classList.add("state-btn");
    return btn;
  };
  
  let clearStateBtn = document.createElement("button");
  clearStateBtn.dataset.state = "";
  clearStateBtn.onclick = () => {
    delete selection.dataset.state;
  };
  clearStateBtn.classList.add("state-btn");
  
  stateDiv.append(stateBtn("first"), stateBtn("edit"), stateBtn("final"), stateBtn("important"), clearStateBtn);
}

let removeBtn = document.createElement("button");
removeBtn.innerText = "X";
removeBtn.onclick = () => {
  remove(selection);
};
removeBtn.classList.add("btn");

let compileAllBtn = document.createElement("button");
compileAllBtn.innerText = "CompileAll";
compileAllBtn.onclick = () => {
  compileDraft(selection);
};
compileAllBtn.classList.add("btn");

let compileBtn = document.createElement("button");
compileBtn.innerText = "Compile";
compileBtn.onclick = () => {
  let statesCheckboxes = document.querySelectorAll("input.compile-state-checkbox[type=checkbox]:checked");
  let states = Array.from(statesCheckboxes).map(box => box.dataset.state);
  console.log(JSON.stringify(states));
  compileDraft(selection, (elem) => states.includes(elem.dataset.state));
};
compileBtn.classList.add("btn");

let compileStateDiv = document.createElement("div");
{
  let stateCheckbox = (state) => {
    let box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.dataset.state = state;
    box.classList.add("compile-state-checkbox");
    return box;
  }
  compileStateDiv.append(stateCheckbox("first"), stateCheckbox("edit"), stateCheckbox("final"), stateCheckbox("important"));
}

(() => {
  let operations = document.createElement("div");
  let persistence = document.createElement("div");
  let completion = document.createElement("div");
  
  operations.append(addBtn, extendBtn, moveUpBtn, moveDownBtn, moveLeftBtn, moveRightBtn, removeBtn, stateDiv);
  persistence.append(saveBtn, loadBtn, authBtn);
  completion.append(compileAllBtn, compileBtn, compileStateDiv);
  
  menu.append(operations, persistence, completion);
})();

let firstBlock = create("tA");

container.append(firstBlock);

setTimeout(function(){
  firstBlock.focus();
}, 10);

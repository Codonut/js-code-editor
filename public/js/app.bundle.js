/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class TextBlock {
  constructor(text) {
    this._text = text;
  }

  getText() {
    return this._text;
  }

  getLength() {
    return this._text.length;
  }

  replace(text, atPosition, replaceExisting) {
    this._text = this._text.substr(0, atPosition) + text + this._text.substr(atPosition + (replaceExisting ? 1 : 0));
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TextBlock;


class SpecialBlock {
  constructor(optColor) {
    this._color = optColor || '#FAA';
  }

  getLength() {
    return 1;
  }

  getColor() {
    return this._color;
  }
}
/* unused harmony export SpecialBlock */



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__editorcontent__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__blocks__ = __webpack_require__(0);



class Editor {
  constructor(document) {
    this._caretPosition = 0;
    this._domCaret = document.getElementById('caret');
    this._domEditor = document.getElementById('editor');
    this._editorContent = new __WEBPACK_IMPORTED_MODULE_0__editorcontent__["a" /* default */]();
    this._domHiddenInput = document.getElementById('sneakyinput');
    this._mouseIsDown = false;

    this._domEditor.addEventListener('mousedown', (e) => {
      this._mouseIsDown = true;
      this._onClick(e);
    });

    this._domEditor.addEventListener('mouseup', (e) => {
      this._mouseIsDown = false;
    });

    this._domEditor.addEventListener('mousemove', (e) => {
      this._onClick(e);
    });

    // We intercept key down events for keyboard commands other than typing in
    // characters because the browser automatically calls onkeydown repeatedly on
    // long presses (e.g. keeping backspace held for several seconds to erase
    // several words).
    this._domHiddenInput.addEventListener('keydown', (e) => {
      console.log('Key down event:', e.keyCode);
      switch (e.keyCode) {
        case 8:
          // Backspace
          if (this._caretPosition > 0) {
            this._caretPosition--;
            this._editorContent.replace('', this._caretPosition, true);
          }
          break;
        case 46:
          // Delete
          if (this._caretPosition < this._editorContent.getTotalLength()) {
            this._editorContent.replace('', this._caretPosition, true);
          }
          break;
        case 13:
          // Enter
          this._insertText('\n');
          break;
        case 37:
          // Left
          if (this._caretPosition > 0) {
            this._caretPosition--;
            this._updateEditorText();
          }
          break;
        case 39:
          // Right
          if (this._caretPosition < this._editorContent.getTotalLength()) {
            this._caretPosition++;
            this._updateEditorText();
          }
          break;
        case 38:
          // Up
          break;
        case 40:
          // Down
          break;
      }
      this._updateEditorText();
    });

    // Whenever the value of the hidden input changes, it means that some characters
    // have been typed and we should append them to the editor.
    this._domHiddenInput.addEventListener('input', (e) => {
      console.log('Hidden input changed:', this._domHiddenInput.value);
      this._insertText(this._domHiddenInput.value);
      this._domHiddenInput.value = '';
    });

    this._domHiddenInput.focus();
    document.addEventListener('mouseup', (e) => {
      this._domHiddenInput.focus();
    });
    this._updateEditorText();
  }

  _insertText(text) {
    this._editorContent.replace(text, this._caretPosition, false);
    this._caretPosition += text.length;
    this._updateEditorText();
  }

  _updateEditorText() {
    this._domCaret.parentNode.removeChild(this._domCaret);
    this._domEditor.innerText = '';

    let currentPosition = 0;
    let insertedCaret = false;
    for (let block of this._editorContent.getBlocks()) {
      let beforeBlockPosition = currentPosition;
      let afterBlockPosition = beforeBlockPosition + block.getLength();
      currentPosition =  afterBlockPosition;
      if (block instanceof __WEBPACK_IMPORTED_MODULE_1__blocks__["a" /* TextBlock */]) {
        if (!insertedCaret && afterBlockPosition > this._caretPosition) {
          let nodeBeforeCaret = document.createElement('span');
          nodeBeforeCaret.textContent = block.getText().substr(0, this._caretPosition - beforeBlockPosition);
          nodeBeforeCaret.associatedBlock = block;
          let nodeAfterCaret = document.createElement('span');
          nodeAfterCaret.textContent = block.getText().substr(this._caretPosition - beforeBlockPosition);
          nodeAfterCaret.associatedBlock = block;
          this._domEditor.appendChild(nodeBeforeCaret);
          this._domEditor.appendChild(this._domCaret);
          this._domEditor.appendChild(nodeAfterCaret);
          insertedCaret = true;
        } else {
          let node = document.createElement('span');
          node.textContent = block.getText();
          node.associatedBlock = block;
          this._domEditor.appendChild(node);
        }
      } else {
        if (!insertedCaret && afterBlockPosition > this._caretPosition) {
          this._domEditor.appendChild(this._domCaret);
          insertedCaret = true;
        }
        let specialBlockNode = document.createElement('div');
        specialBlockNode.associatedBlock = block;
        specialBlockNode.className = 'special-block';
        specialBlockNode.style = 'background-color: ' + block.getColor();
        this._domEditor.appendChild(specialBlockNode);
      }
    }
    if (!insertedCaret) {
      this._domEditor.appendChild(this._domCaret);
    }
  }

  _onClick(e) {
    if (!this._mouseIsDown) {
      return;
    }
    let shiftPositionBy = 0;
    for (let node = this._domEditor.firstChild; node; node = node.nextSibling) {
      if (node == this._domCaret) {
        continue;
      }
      let block = node.associatedBlock;
      if (node == e.target) {
        if (node.nodeName == 'SPAN') {
          let position = this._findTextPosition(e.target, e);
          if (position != -1) {
            this._caretPosition = position + shiftPositionBy;
          }
        } else {
          let boundingRect = node.getBoundingClientRect();
          // Add either 0 or 1 depending on where we clicked.
          this._caretPosition = shiftPositionBy + Math.round((e.pageX - boundingRect.left) / boundingRect.width);
        }
        this._updateEditorText();
        break;
      } else {
        if (block instanceof __WEBPACK_IMPORTED_MODULE_1__blocks__["a" /* TextBlock */]) {
          // Note: when we encounter several spans from the same block (e.g.
          // because there is a caret in between) this will count length properly.
          shiftPositionBy += node.textContent.length;
        } else {
          // Other blocks are never cut in half.
          shiftPositionBy += block.getLength();
        }
      }
    }
  }

  _findTextPosition(span, e) {
    let textNode = span.firstChild;
    if (textNode.nodeType != 3 /* text node */) {
      return -1;
    }
    if (textNode.nextSibling != null) {
      throw 'Found a sibling when there shouldn\'t be one';
    }
    if (textNode.textContent.length <= 1) {
      let boundingRect = span.getBoundingClientRect();
      if (boundingRect.left <= e.pageX &&
          boundingRect.top <= e.pageY &&
          boundingRect.right >= e.pageX &&
          boundingRect.bottom >= e.pageY) {
        // Return either 0 or 1 depending on where we clicked.
        return Math.round((e.pageX - boundingRect.left) / boundingRect.width);
      } else {
        return -1;
      }
    }
    let splitPosition = Math.floor(textNode.textContent.length / 2);
    let secondTextNode = textNode.splitText(splitPosition);
    let firstTextNode = textNode;
    let firstSpan = document.createElement('span');
    firstSpan.textContent = firstTextNode.textContent;
    let secondSpan = document.createElement('span');
    secondSpan.textContent = secondTextNode.textContent;
    span.replaceChild(firstSpan, firstTextNode);
    span.replaceChild(secondSpan, secondTextNode);
    // Now we have the following DOM structure:
    // span
    //   firstSpan
    //   secondSpan
    // TODO: Optimise this, if the span is single line and the event doesn't touch
    // then there is no need to dig inside.
    let firstPosition = this._findTextPosition(firstSpan, e);
    if (firstPosition != -1) {
      return firstPosition;
    }
    let secondPosition = this._findTextPosition(secondSpan, e);
    if (secondPosition != -1) {
      return secondPosition + splitPosition;
    }
    return -1;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Editor;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__editor__ = __webpack_require__(1);


let editor = new __WEBPACK_IMPORTED_MODULE_0__editor__["a" /* default */](window.document);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__blocks__ = __webpack_require__(0);


class EditorContent {
  constructor() {
    this._blocks = [];
  }

  addBlock(block) {
    this._blocks.push(block);
  }

  getBlocks() {
    return this._blocks;
  }

  getTotalLength() {
    let length = 0;
    for (let block of this._blocks) {
      length += block.getLength();
    }
    return length;
  }

  replace(text, atPosition, replaceExisting) {
    let currentPosition = 0;
    let inserted = false;
    for (let i = 0; i < this._blocks.length; i++) {
      let block = this._blocks[i];
      let beforeBlockPosition = currentPosition;
      let afterBlockPosition = beforeBlockPosition + block.getLength();
      currentPosition =  afterBlockPosition;
      if (block instanceof __WEBPACK_IMPORTED_MODULE_0__blocks__["a" /* TextBlock */]) {
        if (afterBlockPosition > atPosition || i == this._blocks.length - 1) {
          block.replace(text, atPosition - beforeBlockPosition, replaceExisting);
          inserted = true;
          break;
        }
      } else {
        if (afterBlockPosition > atPosition) {
          this._blocks.splice(i, replaceExisting ? 1 : 0, new __WEBPACK_IMPORTED_MODULE_0__blocks__["a" /* TextBlock */](text));
          inserted = true;
          break;
        }
      }
    }
    if (!inserted) {
      // Text was appended at the end.
      this._blocks.push(new __WEBPACK_IMPORTED_MODULE_0__blocks__["a" /* TextBlock */](text));
    }
    this._optimizeBlocks();
  }

  _optimizeBlocks() {
    for (let i = 0; i < this._blocks.length;) {
      if (this._blocks[i].getLength() == 0) {
        this._blocks.splice(i, 1);
      } else {
        i++;
      }
    }
    if (this._blocks.length == 0) {
      this._blocks.push(new __WEBPACK_IMPORTED_MODULE_0__blocks__["a" /* TextBlock */](''));
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EditorContent;



/***/ })
/******/ ]);
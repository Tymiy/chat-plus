

/* # To-Do

  1. Add option to turn off username colors

  2. Add popup to show list of usernames in chat
    - autocomplete usernames when typing '@' in chat input

  3. Add option to keep all usernames in history

  4. Add option to change list font size

  Maybe add option to highlight author's username differently 

*/


// Store chat history
var currentChatHistory = [];

// Text colors
var usernameColors = {
  rumbler: '#88a0b8',
  divaPink: '#FF63B4', 
  magenta: '#BD03E5',
  electricPurple: '#850DF4',
  streamerRed: '#EA0101',
  sundayRed: '#FFBBB1',
  brightYellow: '#FFFF4A',//FFFF6B',
  orange: 'orange',
  springGreen: '#B9E50B',
  streamerGreen: '#15FF8D',
  grassGreen: '#05C305',
  marinerTeal: '#4FB5B0',
  coolBlue: '#07F7F7',
  dreamyBlue: '#2DA3FB',
}

var messageColors = { 
  chatPlus: '#E0E9F2',
  rumble: '#d6e0ea',
  white: '#FFFFFF',
}

let userColors = {}

const getRandomColor = () => {
  const colors = Object.values(usernameColors);
  return colors[Math.floor(Math.random() * colors.length)];
}

var currentUser = '';

// Set current user
const rantEle = document.querySelectorAll('.chat-history--rant-head');
const usernameEle = document.querySelectorAll('.chat-history--rant-username');

// Get current user
if (rantEle && usernameEle) {
  if (usernameEle.length > 0) {
    currentUser = usernameEle[usernameEle.length - 1].textContent;
  } 
}

// Get currentstreamer name
var authorEle = document.querySelector('.media-by--a')
var authorHref = authorEle.getAttribute('href');
var currentStreamer = authorHref.replace('/c/', '');

// 'class-history' element
const chatHistoryEle = document.querySelectorAll('.chat-history');

// Get chat element id 'class-history-list'
const chatHistoryList = document.getElementById('chat-history-list');
const chatHistoryRows = document.querySelectorAll('.chat-history--row');
const chatHistoryNames = document.querySelectorAll('.chat-history--username');
const chatHistoryMessages = document.querySelectorAll('.chat-history--message');

// Asign random color to each unique username in current chat history
const assignRandomColor = (array) => {
  const colors = Object.values(usernameColors);
  let colorIndex = 0;

  for (let i = 0; i < array.length; i++) {
    const user = array[i];
    if (!userColors[user.username]) {
      userColors[user.username] = colors[colorIndex % colors.length];
      colorIndex++;
    }
    console.log('assignRandomColor', user, colors, userColors )
  }
}

const getUserColor = (username) => {
  if (!userColors[username]) {
    userColors[username] = getRandomColor();
  }
  return userColors[username];
}

function highlightString(text, searchTerm, color, backgroundColor) {
  // Get inde of search term
  var index = text.toLowerCase().indexOf(searchTerm.toLowerCase());

  // Get original matched text
  var matchedText = text.substring(index, index + searchTerm.length);

  //Return string with styling
  if (index >= 0) {
    return (
      text.substring(0, index) +
      "<span style='color: " +
      color +
      "; background-color: " + 
      backgroundColor +
      ";'>" +
      matchedText +
      "</span>" +
      // Recursively highlight the rest of the string
      highlightString(text.substring(index + searchTerm.length), searchTerm, color, backgroundColor)
    );
  }
  return text;
}

function insertUsername(username, message, caretPos) {
  return message.slice(0, caretPos) + username + message.slice(caretPos);
}

const getChatHistory = () => {
  currentChatHistory = [];
  chatHistoryRows.forEach((element, index) => {
    // Check element classlist for 'chat-history--rant' and skip row
    if (element.classList.contains('chat-history--rant')) {
      return;
    }

    //Assign random color to each unique username in current chat history
    let userColor = getUserColor(element.childNodes[0].textContent);

    // Assign text color to username and message
      // If default colors option is selected, igonre
    element.childNodes[0].style.color = userColor;
    //element.childNodes[1].style.color = messageColors.chatPlus;

    // Highlight current user's username when tagged with '@'
    if ( currentUser && currentUser.length > 2 ){
      if (
        element.childNodes[1].textContent.toLowerCase().includes(('@' + currentUser).toLowerCase())
      ) {
        element.childNodes[1].innerHTML = highlightString(element.childNodes[1].textContent, '@' + currentUser, 'white', 'rgb(234, 100, 4, .85)');
      } else if (
        element.childNodes[1].textContent.toLowerCase().includes((currentUser).toLowerCase())
      ) {
        element.childNodes[1].innerHTML = highlightString(element.childNodes[1].textContent, currentUser, 'white', 'rgb(234, 100, 4, .85)');
      }
    }

    // Add the message to the chat history
    currentChatHistory.push({
      username: element.childNodes[0].textContent,
      message: element.childNodes[1].textContent,
      color: userColor,
      date: Date.now(),
    });
  });
};




// Get page coordinates of the message input caret position
function getPageCoordinates(element) {
  var rect = element.getBoundingClientRect();
  return {
    x: rect.left + window.pageXOffset,
    y: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
  };
}

// Get caret position in message input
function storeCaretPosition(input) {
  const caretPosition = input.selectionStart;
  return caretPosition;
}

// Open popup with username list
const openChatUsernamesPopup = (caretCoordinates) => {
  // Create popup element
  const popup = document.createElement('div');
  popup.classList.add('chat-plus-popup');
  popup.style.position = 'relative';
  popup.style.width = '125px';
  popup.style.maxWidth = '125px';
  popup.style.height = '135px';
  popup.style.overflowY = 'scroll';
  popup.style.overflowX = 'auto';
  popup.style['-ms-overflow-style'] = 'none';
  popup.style.backgroundColor = '#061726';
  popup.style.borderRadius = '5px';
  popup.style.zIndex = '9999';
  popup.style.padding = '0 5px';
  //popup.style.boxShadow = '5px 5px 5px 0 rgba(0, 0, 0, 0.5)';
  popup.style.outline = '2px solid rgba(136,136,136,0.43)';
  popup.style.outlineOffset = '0px';

  var popupAdjustedHeight = document.getElementById("chat-message-text-input").clientHeight;

  console.log('popupAdjustedHeight', popupAdjustedHeight)
  popup.style.position = 'absolute';
  popup.style.top = caretCoordinates.top + popupAdjustedHeight + 5 + 'px';
  popup.style.left = caretCoordinates.left + 'px';

  // Create popup close button
  const popupClose = document.createElement('button');
  popupClose.classList.add('chat-plus-popup-close');
  popupClose.style.position = 'fixed';
  popupClose.style.marginTop = '0';
  popupClose.style.padding = '6px';
  popupClose.style.backgroundColor = 'transparent';
  popupClose.style.color = 'black';
  popupClose.style.border = 'none';
  popupClose.style.zIndex = '9999';
  popupClose.innerHTML = 'X';
  popupClose.addEventListener('click', () => {
    popup.remove();
  });
  //popup.appendChild(popupClose);

  // Create popup content element
  const popupContent = document.createElement('ul');
  popupContent.classList.add('chat-plus-popup-content');
  popupContent.style.position = 'relative';
  popupContent.style.width = '100%';
  popupContent.style.height = '100%';
  popupContent.style.zIndex = '9999';
  popupContent.style.overflow = 'auto';
  popup.appendChild(popupContent);

  // Sort userColors object by username
  function sortObjectByPropName(obj) {
    const sorted = {};
    Object.keys(obj)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .forEach(key => {
        sorted[key] = obj[key];
      });
    return sorted;
  }
  const sortedUserColors = sortObjectByPropName(userColors);

  // Loop through sortedUserColors object and add usernames to popup content
  for (let user in sortedUserColors) {
    const usernameTextElement = document.createElement('li');
    usernameTextElement.style.color = sortedUserColors[user];
    usernameTextElement.style.fontSize = '1.1rem';
    usernameTextElement.style.listStyle = 'none';
    usernameTextElement.style.cursor = 'pointer';
    usernameTextElement.style.fontWeight = 'bold';
    usernameTextElement.innerHTML = user;
    popupContent.appendChild(usernameTextElement);
    usernameTextElement.addEventListener('click', () => {
      // Add username to chat message input
      let messageEle = document.getElementById('chat-message-text-input')
      let messageVal = messageEle.value;
      const input = document.querySelector("input[type='text']");
      const caretPosition = storeCaretPosition(messageEle);

      document.getElementById('chat-message-text-input').value = insertUsername(user, messageVal, caretPosition);
            
      // Remove popup
      popup.remove();

      // Focus on chat message input
      document.getElementById('chat-message-text-input').focus();
    });
  }

  // Append popup to page
  document.body.appendChild(popup);

  // Focus popup
  document.querySelector('.chat-plus-popup').focus();
}
  

// Get chat history on page load
getChatHistory();

// Create a MutationObserver instance to watch for new chat messages
var chatObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "childList") {
      // Loop through the added nodes to find new messages
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var addedNode = mutation.addedNodes[i];
        if (addedNode.classList.contains("chat-history--row")) {
          // Check element classlist for 'chat-history--rant' 
          if (addedNode.classList.contains('chat-history--rant')) {
            // Skip node
            return;
          }

          // Add the message to the chat history
          let userColor = getUserColor(addedNode.childNodes[0].textContent);

          // Assign color to username
          addedNode.childNodes[0].style.color = userColor;

          // Highlight current user's username when tagged with '@'
          if (currentUser && currentUser.length > 2){
            if (
              addedNode.childNodes[1].textContent.toLowerCase().includes(('@' + currentUser).toLowerCase())
            ) {
              addedNode.childNodes[1].innerHTML = highlightString(addedNode.childNodes[1].textContent, '@' + currentUser, 'white', 'rgb(234, 100, 4, .85)');
            } else 

            if (
              addedNode.childNodes[1].textContent.toLowerCase().includes((currentUser).toLowerCase())
            ) {
              addedNode.childNodes[1].innerHTML = highlightString(addedNode.childNodes[1].textContent, currentUser, 'white', 'rgb(234, 100, 4, .85)');
            } 
          }

          // Add the message to the chat history
          currentChatHistory.push({
            username: addedNode.childNodes[0].textContent,
            message: addedNode.childNodes[1].textContent,
            color: userColor,
            date: Date.now(),
          });
        }
      }
    }
  });
});

// Observe chat for changes to its child elements to detect new messages
if (chatHistoryList){
  chatObserver.observe(document.querySelector('#chat-history-list'), { childList: true });
}

// Listen for "@" keypress to open popup
document.addEventListener("keydown", function(event) {
  // If "2" key is pressed and shift key is held down
  /*if (event.keyCode === 50 && event.shiftKey && !document.querySelector('.chat-plus-popup')) {
    // Open username list popup
    openChatUsernamesPopup();
  }*/

  var usernameListPopup = document.querySelector('.chat-plus-popup');
  
  // If space bar is pressed remove username list popup
  if (usernameListPopup && event.keyCode === 32) {
    // Close popup
    if (usernameListPopup) {
      usernameListPopup.remove()
    }
  }

  // If backspace is pressed remove username list popup
  if (usernameListPopup && event.keyCode === 8) {
    // Close popup
    if (usernameListPopup) {
      usernameListPopup.remove()
    }
  }
});

// Listen for input in chat message input
let inputElement = document.getElementById("chat-message-text-input");

if (inputElement) {
  inputElement.addEventListener("input", function() {
    let inputValue = inputElement.value;
    
    // Get all indexes of @
    let atSignIndexes = [];
    for (var i = 0; i < inputValue.length; i++) {
      if (inputValue[i] === "@") {
        atSignIndexes.push(i);
      }
    }

    // Get caret position
    let caretPosition = storeCaretPosition(inputElement);

    // Get coordinates of input element
    let messageCoordinates = getPageCoordinates(inputElement)

    // If "@"" is found in the input and caret is next to it
    if ( 
      !document.querySelector('.chat-plus-popup') 
      && atSignIndexes.includes(caretPosition - 1)
    ) {
      // Open username list popup
      openChatUsernamesPopup(messageCoordinates);
    } 
  });
}

// Close popup when user clicks outside of element
document.addEventListener("click", function(event) {
  var usernameListPopup = document.querySelector('.chat-plus-popup');
  var usernameListPopup2 = document.querySelector('.chat-plus-popup2');

  if (
    (usernameListPopup && !usernameListPopup.contains(event.target))
    || (usernameListPopup2 && !usernameListPopup2.contains(event.target))
  ) {
    usernameListPopup.remove()
    usernameListPopup2.remove()
  }
});


// Refresh chat history every 120 seconds
const chatRefreshInterval = setInterval(function(){
  //console.log('refreshing chat history');
  getChatHistory()
}, 120000);

 // Clear interval if there is no chat history
if (!chatHistoryList){
  //console.log('clearing chat refresh interval')
  clearInterval(chatRefreshInterval);
}












////    FOR TESTING     ////


function openChatUsernamesPopup2(caretPosition) {
  // Sort userColors object by username
  function sortObjectByPropName(obj) {
    const sorted = {};
    Object.keys(obj)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .forEach(key => {
        sorted[key] = obj[key];
      });
    return sorted;
  }
  const sortedUserColors = sortObjectByPropName(userColors);
  
  // Create username list
  let usernameList = document.createElement('ul');
  usernameList.style.listStyle = 'none';
  usernameList.classList.add('chat-plus-popup-content');
  usernameList.style.position = 'relative';
  usernameList.style.width = '100%';
  usernameList.style.height = '100%';
  usernameList.style.zIndex = '9999';
  usernameList.style.overflow = 'auto';

  for (let user in sortedUserColors) {
    let listItem = document.createElement('li');
    listItem.textContent = user;
    listItem.style.color = sortedUserColors[user];
    usernameList.appendChild(listItem);
  }

  // Create username list container
  let usernameListContainer = document.createElement('div');
  usernameListContainer.classList.add('chat-plus-popup2');

  usernameListContainer.style.position = 'relative';
  usernameListContainer.style.width = '125px';
  usernameListContainer.style.maxWidth = '125px';
  usernameListContainer.style.height = '135px';
  usernameListContainer.style.overflowY = 'scroll';
  usernameListContainer.style.overflowX = 'auto';
  usernameListContainer.style['-ms-overflow-style'] = 'none';
  usernameListContainer.style.backgroundColor = '#061726';
  usernameListContainer.style.borderRadius = '5px';
  usernameListContainer.style.zIndex = '9999';
  usernameListContainer.style.padding = '0 5px';
  usernameListContainer.style.marginLeft = '10px';


  usernameListContainer.style.position = 'absolute';
  usernameListContainer.style.top = caretPosition.top - usernameList.offsetHeight + 'px';
  usernameListContainer.style.left = caretPosition.left + 'px';
  usernameListContainer.appendChild(usernameList);
  
  document.body.appendChild(usernameListContainer);
}



// Append test button to chat window
const testBtn = document.createElement('div');
testBtn.innerHTML = 'Test';
testBtn.style.maxWidth = '150px';
testBtn.style.wordWrap = 'break-word';
testBtn.style. height = '100%';
testBtn.addEventListener('click', ()=>{
  //getChatHistory();
  //console.log('currentChatHistory', currentChatHistory);
  console.log('currentUser: ' + currentUser, 'currentStreamer ' + currentStreamer );
});
//chatHistoryEle[0].appendChild(testBtn);

/*
*/
const buttons = document.querySelectorAll('.card-selector--button')

console.log(buttons)



function winLoad(callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener("load", callback);
    }
  }
  
  winLoad(function() {
    console.log('Window is loaded');
  });

// site.js - This file contains utility JS functions that are used throughout the site

// This is a self-invoking function.  It is executed when the script is loaded.
// It adds a handler (an anonymous function) to the window load event.
// The functions called in the hadnler are only in scope of this self-invoking
// function

(function InitializePage(){
  
  function checkHost(){
    let productionHost = "cncmath.com";  
    if (window.location.hostname!=productionHost){
      console.log("ProductionHost=False")
      let banner = document.createElement("div");
      banner.innerHTML=("This is the beta site.");
      banner.classList.add("text-center", "alert", "alert-warning", "mb-0");
      banner.style.textAlign = "center";
      banner.style.marginLeft = "-15px";
      banner.style.marginRight = "-15px";
      banner.style.fontWeight = "bold";
      let ele = document.getElementsByTagName("body")[0];
      ele.insertBefore(banner, ele.firstChild);
    }else{
      console.log("ProductionHost=True");
    }
  }

  function setServiceWorker(){
    
    if("serviceWorker" in window.navigator){
      console.log("ServiceWorker: service workers supported!"); 
      if(window.navigator.serviceWorker.controller === null){
        window.navigator.serviceWorker.register("../serviceWorker.js")
        .then(function(reg){
          console.log("ServiceWorker: registered");
        })
        .catch(function(err){
          console.log(`ServiceWorker: error ${err}`);
        })
      }
      else{
        console.log("ServiceWorker: already active");
      }
    }
    else{
      console.log("ServiceWorker: service workers are not supported!");
    }
      
  }

  window.addEventListener("load", function(){
    setServiceWorker();
    checkHost();
  });
  
})();

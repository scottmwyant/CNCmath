
// site.js - This file contains utility JS functions that are used throughout the site

function CheckHost(){
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
      console.log("ProductionHost=True")
    }
  }
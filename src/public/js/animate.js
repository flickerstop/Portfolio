var animate = function(){



    function fadeOut(id,amount = 0,pointEvents = true){
        let overlay = document.getElementById(id);
        
        overlay.style.opacity = amount;

        if(pointEvents){
            overlay.style.pointerEvents = "none";
        }
    }

    function fadeIn(id,amount = 1.0,pointEvents = true){
        let overlay = document.getElementById(id);
        
        overlay.style.opacity = amount;

        if(pointEvents){
            overlay.style.pointerEvents = "all";
        }
    }

    return {
        fadeIn,
        fadeOut
    }
}();
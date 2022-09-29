
var projects = function(){

    let projectData = null;
    let imageNum = 0;

    /**
     * Opens the project overlay with the passed data
     * @param {Object} json Json for this project to show
     */
    function openOverlay(projectId){
        projectData = resumeData.projects.find(x=>x.id == projectId);

        // Set the text
        dom.text("poc-title",projectData.name);
        dom.text("poc-description",projectData.descriptions.long);
        

        // Check if github
        if(projectData.github != null){
            dom.enableButton("poc-github");
        }else{
            dom.disableButton("poc-github");
        }


        // Select the div for all the tech
        let techDiv = dom.builder("poc-tech").html(null);
        // Draw the tech stack
        for(let tech of projectData.tech){
            // Find the tech data
            let techData = resumeData.tech.find(x=>x.name.toLowerCase() == tech.toLowerCase());

            // If we have this tech added
            if(techData != undefined){

                let techLogo = techDiv.append("div").class("poc-tech-container");

                techLogo.append("div")
                    .class("poc-tech-logo image")
                    .style("background-image",`url('${techData.imageURL}')`);
                
                techLogo.append("div")
                    .class("poc-tech-name")
                    .text(tech)
            }
        }

        // Set the image to the first one
        imageNum = 0;
        updateImage();


        


        animate.fadeIn("projectOverlay");
    }

    /**
     * Closes the project overlay
     */
    function closeOverlay(){
        animate.fadeOut("projectOverlay");
    }


    function updateImage(){
        let imageData = projectData.images[imageNum];

        // Set the background image
        dom.backgroundImage("poc-images-container",imageData.url);

        // Set the text if there is any
        let textDiv = dom.builder("poc-images-text");
        if(imageData.description != null){
            textDiv.show().text(imageData.description);
        }else{
            textDiv.hide();
        }

        // Set the arrows
        // Check if there's any more images
        if(imageNum < projectData.images.length-1){
            // Yes right arrow
            dom.enableButton("poc-images-right");
        }else{
            // No right arrow
            dom.disableButton("poc-images-right");
        }

        if(imageNum > 0){
            // Yes left arrow
            dom.enableButton("poc-images-left");
        }else{
            // No left arrow
            dom.disableButton("poc-images-left");
        }
    }

    function nextImage(){
        if(imageNum < projectData.images.length){
            imageNum++;
            updateImage();
        }
    }

    function previousImage(){
        if(imageNum > 0){
            imageNum--;
            updateImage();
        }
    }

    return{
        openOverlay,
        closeOverlay,
        nextImage,
        previousImage
    }
}();
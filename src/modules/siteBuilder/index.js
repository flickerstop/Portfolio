

const fs = require("fs-extra");
const path = require("path");
const console = require("JrModules/jrConsole");

let options = null;
let shellPath = null;
let shell = null;


module.exports = class{

    static load(){
        loadOptions();
        loadShell();
        return this;
    }
    
    // Builder for a new page
    static get page(){
        return class{

            // Set the path to this page and load it
            constructor(pageData){
                // Save the page data
                this.pageData = pageData;

                // Load this page
                this.page = fs.readFileSync(path.join(__dirname,"..","..",this.pageData.path)).toString();
            }

            reload(){
                // Load the shell content
                loadOptions();
                loadShell();

                // Load this page
                this.page = fs.readFileSync(path.join(__dirname,"..","..",this.pageData.path)).toString();
                return this;
            }

            build(){
                return parsePage(this);
            }
        }
    }


    static get options(){
        return options;
    }
}


/**
 * Loads the options for this portfolio
 */
function loadOptions(){
    // Check if we have custom options then use them
    if(fs.existsSync(path.join(__dirname,"./options.json"))){
        console.log("Loaded personal options");
        options = fs.readJSONSync(path.join(__dirname,"./options.json"));
    }else{
        console.log("Loaded default options");
        options = fs.readJSONSync(path.join(__dirname,"./options_default.json"));
    }
}

/**
 * Loads the shell for all pages
 * @param {STRING} pathToShell Path to the shell HTML file
 */
function loadShell(){
    shell = fs.readFileSync(path.join(__dirname,"shell.html")).toString();
}


function parsePage(pageObject){

    /***********************************************************
    ** Header
    ************************************************************/
    // Load the shell of the page
    let page = shell;

    // Find the window title
    page = page.replace(/%windowName%/gm,options.windowName);

    // Add the title bar pages
    let titleBarPages = "";
    for(let page of options.pages){
        titleBarPages += `<a href="/${page.link}"><div ${page.title == pageObject.pageData.title?`class="selected"`:``}>${page.title}</div></a>\n`;
    }
    page = page.replace(/%titleBarPages%/gm,titleBarPages);


    /***********************************************************
    ** Main Content
    ************************************************************/
    // Load the main content for the page
    let mainContent = pageObject.page;
    
    /////////////////////////
    // Home

    // check if small about exists
    if(mainContent.includes("%info.smallAbout%")){
        mainContent = mainContent.replace(/%info\.smallAbout%/gm,options.info.smallAbout);
    }

    // check if long about exists
    if(mainContent.includes("%info.longAbout%")){
        mainContent = mainContent.replace(/%info\.longAbout%/gm,options.info.longAbout);
    }

    
    // check if profile picture exists
    if(mainContent.includes("%profilePicture%")){
        mainContent = mainContent.replace(/%profilePicture%/gm,options.info.picture);
    }

    /////////////////////////
    // Projects

    // Loop through the projects and give them all ids
    let i = 0;
    for(let project of options.projects){
        project.id = i++;
    }

    if(mainContent.includes("%projects.cards%")){
        let projectCards = ``;
        // Loop through the projects
        for(let project of options.projects){
            let card = `<div class="projectCard">\n`;

            card += `<div class="projectCard-readMoreOverlay" onclick='projects.openOverlay(${project.id})'>Read More</div>\n`;

            // Add the image(s)
            card += `<div class="projectCard-image image" style="background-image:url('${project.images[0].url}')"></div>\n`;

            // Add the title
            card += `<div class="projectCard-title">${project.name}</div>\n`;

            // Add the description
            card += `<div class="projectCard-description">${project.descriptions.short}</div>\n`;


            // Add the tech stack container
            card += `<div class="projectCard-tech">\n`;

            // For each tech stack
            for(let tech of project.tech){
                // Find the tech data
                let techData = options.tech.find(x=>x.name.toLowerCase() == tech.toLowerCase());

                // If we have this tech added
                if(techData != undefined){
                    card += `<div class="projectCard-tech-logo image" style="background-image:url('${techData.imageURL}')"></div>`;
                }
            }

            card += `</div>\n</div>\n\n`;

            projectCards += card;
        }

        mainContent = mainContent.replace(/%projects\.cards%/gm,projectCards);
    }


    /***********************************************************
    ** Combined
    ************************************************************/
    // Combine the shell and main content
    page = page.replace(/%mainContent%/gm,mainContent);

    // check if fullName
    if(page.includes("%fullName%")){
        page = page.replace(/%fullName%/gm,options.info.fullName);
    }


    // check if socialLinks
    if(page.includes("%socialLinks%")){
        let socialLinks = "";

        // Add the github
        if(options.links.github != undefined){
            socialLinks += `<a href="${options.links.github}"><div class="social-link github"></div></a>`;
        }

        // Add the linkedin
        if(options.links.linkedin != undefined){
            socialLinks += `<a href="${options.links.linkedin}"><div class="social-link linkedin"></div></a>`;
        }

        page = page.replace(/%socialLinks%/gm,socialLinks);
    }

    // Check for tech.all
    if(page.includes("%tech.all%")){
        let techString = "";
        for(let tech of options.tech){
            if(!tech.show)continue;

            techString += `<div class="techContainer"><div class="techLogo" style="background-image:url('${tech.imageURL}')"></div><div class="techText">${tech.name}</div></div>`;
        }

        page = page.replace(/%tech.all%/gm,techString);
    }


    /***********************************************************
    ** Add the json data
    ************************************************************/
    page += `\n\n<script>\nvar resumeData = ${JSON.stringify(options)}\n</script>`;

    ///////////////////
    return page;
}
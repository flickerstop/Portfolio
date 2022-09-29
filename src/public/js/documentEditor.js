

var dom = function(){

    function builder(id = null,element = null){
        return new class{

            constructor(id,element){
                if(id != null){
                    this.element = document.getElementById(id);
                }
                if(element != null){
                    this.element = element;
                }
            }
        
            text(newText){
                this.element.innerHTML = newText;
                return this;
            }

            html(newText){
                return this.text(newText);
            }

            append(type){
                // Create the new element
                let newElement = document.createElement(type);

                // Append the new element to the old
                this.element.appendChild(newElement);

                return new builder(null,newElement);
            }

            class(className){
                this.element.className = className;
                return this;
            }

            style(type,value){
                this.element.style[type] = value;
                return this;
            }

            hide(){
                this.element.style.display = "none";
                return this;
            }
            show(){
                this.element.style.display = null;
                return this;
            }
        
        }(id,element);
    }

    function changeLink(id,newLink){
        document.getElementById(id).setAttribute('href', newLink);
    }

    function changeText(id,newText){
        document.getElementById(id).innerHTML = newText;
    }

    function disableButton(id){
        let button = document.getElementById(id).style;
        button.opacity = 0.2;
        button.cursor = "not-allowed";
        button.pointerEvents = "none";
    }

    function enableButton(id){
        let button = document.getElementById(id).style;
        button.opacity = 1;
        button.cursor = "pointer";
        button.pointerEvents = "all";
    }

    function backgroundImage(id,url){
        document.getElementById(id).style.backgroundImage = `url('${url}')`;
    }

    function hide(id){
        document.getElementById(id).style.display = "none";
    }
    function show(id){
        document.getElementById(id).style.display = null;
    }

    return{
        builder,
        text:changeText,
        disableButton,
        enableButton,
        backgroundImage,
        changeLink,
        hide,
        show
    }
}();



function set_canvas(){
    let canvas = document.querySelector('.canvas');
    canvas.style.height = window.innerHeight - canvas.offsetTop+'px'
    console.log("Hello World!")
}

function put_capybara(){
    let canvas = document.querySelector('.animalContainer');
    for(let i =0; i < 12;i++){
        var newCapy = document.createElement('div');
        newCapy.className = "innerImage";
        var image = document.createElement('img');
        image.src = "images/capybara.gif"; 
        newCapy.appendChild(image);
        canvas.appendChild(newCapy);
        console.log("new cappy created!")
    }
}

//On ready actions
window.addEventListener("resize",set_canvas);
set_canvas();
put_capybara();


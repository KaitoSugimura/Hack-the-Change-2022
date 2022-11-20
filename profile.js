//Varaibles
let animalImages = ["images/capybara.gif","images/panda.gif","images/frog.gif","images/wolf.gif","images/pig.gif","images/Tiger.gif"];
const profileImage = document.querySelector(".profileimage");

function set_canvas(){
    let canvas = document.querySelector('.canvas');
    canvas.style.height = window.innerHeight - canvas.offsetTop+'px'
    console.log("Hello World!")
}

function set_profile(){
    let profile = document.querySelector(".profile");
    profile.offsetTop = document.querySelector('.canvas').offsetTop;
}

function unfold_profile(){
    let profile = document.querySelector(".profile");
    if(profile.style.width == "80%"){
        profile.style.width ="fit-content";
    }
    else{
        profile.style.width = "80%";
    }
}

function put_capybara(){
    let canvas = document.querySelector('.animalContainer');
    for(let i =0; i < 6;i++){
        var newCapy = document.createElement('div');
        newCapy.className = "innerImage";
        var image = document.createElement('img');
        image.src = animalImages[Math.floor((Math.random()*animalImages.length))];
        newCapy.appendChild(image);
        canvas.appendChild(newCapy);
    }
}

//On ready actions
window.addEventListener("resize",set_canvas);
profileImage.addEventListener("click",unfold_profile);
set_canvas();
set_profile();
put_capybara();


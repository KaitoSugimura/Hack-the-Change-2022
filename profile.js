//Varaibles
let animalImages = ["images/capybara.gif","images/panda.gif","images/frog.gif","images/wolf.gif","images/pig.gif","images/Tiger.gif"];
const profileImage = document.querySelector(".profileimage");
let userData = [];
let tiervals = [10, 50, 100, 500, 1000, 2000];
let points = 0;

//Event Handlers
function set_userData(){
    userData.push("Name: Joshua Walters");
    userData.push("Total Donations: 100000$");
    userData.push("Favorite Charity: WWF");
    userData.push("Tier: 1");
    console.log(userData)
}

function set_canvas(){
    let canvas = document.querySelector('.canvas');
    canvas.style.height = window.innerHeight - canvas.offsetTop+'px'
}

function set_profile(){
    let profile = document.querySelector(".profile");
    profile.offsetTop = document.querySelector('.canvas').offsetTop;
}

function add_comment(){
    let commentBox = document.querySelector(".commentContainer");
    let comment = document.createElement('div')
    comment.className = "comment"
    let image = document.createElement('img');
    let text = document.createElement('div');
    text.className = "commentText";
    text.textContent = "Thank you for helping me I really appreciate it and I am so grateful for the help that I appreciated";
    image.src = "images/speechbubble.png.png";
    commentBox.appendChild(comment);
    comment.appendChild(text);
    comment.appendChild(image);
}

function unfold_profile(){
    points += 20;
    put_capybara();
    let profile = document.querySelector(".profile");
    if(profile.lastElementChild.className != "profileimage"){
        profile.style.width ="fit-content";
        for(let i =0;i<userData.length;i++){
            profile.removeChild(profile.lastElementChild);
        }
    }
    else{
        profile.style.width = "fit-content";
        for(let i =0; i<userData.length;i++){
            let newInfo = document.createElement('div');
            newInfo.className = "userInfo";
            newInfo.textContent = userData[i];
            profile.appendChild(newInfo)
        }
    }
}

//Methods
function put_capybara(){
    let canvas = document.querySelector('.animalContainer');
    let max =0;
    for(let i =0;i<tiervals.length;i++){
        if(points >= tiervals[i]){
            max = i+1;
        }
    }
    console.log("points: "+points+" max: "+max);
    if(canvas.childElementCount != max){
        var newCapy = document.createElement('div');
        newCapy.className = "innerImage";
        var image = document.createElement('img');
        image.src = animalImages[max-1];
        newCapy.appendChild(image);
        canvas.appendChild(newCapy);
        add_comment();

    }
}

//On ready actions
window.addEventListener("resize",set_canvas);
profileImage.addEventListener("click",unfold_profile);
set_canvas();
set_profile();
set_userData()
put_capybara();



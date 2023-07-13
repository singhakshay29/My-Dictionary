const url="https://api.dictionaryapi.dev/api/v2/entries/en/";
//selctors
const result=document.getElementById("result");
const btn=document.getElementById("search-btn");
const card_container=document.getElementById("card");
const all_historybtn=document.getElementById('history');
const history_card=document.getElementById('history_card');
const inputWord=document.getElementById("input-word");
const sound=document.getElementById("sound");

//setters and creation
all_historybtn.textContent="History";
const mydiv=document.createElement('div');
const searchbox=document.createElement('div');
const search_btn=document.createElement('button');
const myresult=document.createElement('div');
const historyHeadingTex=document.createElement('div');
historyHeadingTex.classList.add('historyScreenText');
historyHeadingTex.innerText="Search History";


showcard();
function showcard(){
mydiv.classList.add('container');
mydiv.setAttribute('id','container');
searchbox.classList.add("search-box");
searchbox.innerHTML=`
<input class="search-bar" type="text"  id="input-word" placeholder="Type here..">
`
search_btn.classList.add('search-btn');
search_btn.setAttribute('id','search-btn');
search_btn.innerHTML=` <i class="fa-solid fa-magnifying-glass"></i>`

searchbox.append(search_btn);
myresult.classList.add('result');
myresult.setAttribute('id','result');
mydiv.appendChild(searchbox);
mydiv.appendChild(myresult);
card_container.append(mydiv);
search_btn.addEventListener('click',showresult);

}



function showresult() {
    const input =document.getElementById("input-word").value;

    if(input === "") return;

    const storedWordData=JSON.parse(localStorage.getItem(input));

    if(storedWordData){


        for (var i = 0; i < localStorage.length; ++i) {

            var key = localStorage.key(i);

            if(input === key){
                console.log("yes");
                var value = localStorage.getItem(key);
                const defi=JSON.parse(value).meanings[0].definitions[0].definition;
                
                    myresult.innerHTML=`
                    <div class="word">
                    <h3>${key}</h3>
                    <button class="play">
                    <i class="fa-solid fa-play"></i>
                    </button>
                </div>
                <div class="details">
                    <p class="word_meaning">
                    Meaning: ${defi}
                    </p>
                </div>`
            }
            
        }



    }else{
        fetch(`${url}${input}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Word not found");
                  }
            
                return response.json()})
            .then((data) => {
                localStorage.setItem(input, JSON.stringify(data[0])); 
                myresult.innerHTML=`
                <div class="word">
                <h3>${input}</h3>
                <button onclick="playSound" class="play">
                <i class="fa-solid fa-play"></i>
                </button>
            </div>
            <div class="details">
                <p class="word_meaning">
                Meaning: ${data[0].meanings[0].definitions[0].definition}
                </p>
                </div>
                <p class="wordExample">
                Example: ${data[0].meanings[0].definitions[0].example || "Not Available"}
                </p>`;
                sound.setAttribute("src", `${data[0].phonetics[0].audio}`);
                console.log(sound);
            }).catch(error => {
                throw error;
              });
        } 
    }
    function playSound(){
        sound.play();
    }



all_historybtn.addEventListener('click',switchtab);

function deleteCard(word){
   localStorage.removeItem(word);
   showHistory();
    
}


function showHistoryCard(word,definition){
    const box=document.createElement('div');
    box.classList.add('box');

    box.innerHTML=`
    <h3>${word}</h3>
    <div class="part_of_speech">
    ${definition}
    </div>

    <button  onclick="deleteCard('${word}')" class="delete"><i class="fa-sharp fa-solid fa-trash"></i></button>
    
    `;
    return box;

}


function showHistory(){
    console.log(localStorage);
    history_card.innerHTML='';
    for (var i = 0; i < localStorage.length; ++i) {

        var key = localStorage.key(i);
        
        var value = localStorage.getItem(key);
        const defi=JSON.parse(value).meanings[0].definitions[0].definition;
        
        const card=showHistoryCard(key,defi);
        history_card.appendChild(card);
        }
}


function switchtab(){
    if(all_historybtn.textContent==='History')
    {
        all_historybtn.textContent='Home'
        showHistory();
        document.querySelector(".homeScreenText").style.display='none';
        history_card.appendChild(historyHeadingTex).style.display='block';
        card_container.style.display='none';
        document.getElementById('history_card').style.display='grid';
    }else if(all_historybtn.textContent==='Home'){
        all_historybtn.textContent='History';
        document.querySelector(".homeScreenText").style.display='block';
        history_card.appendChild(historyHeadingTex).style.display='none';
        showcard();
        document.getElementById('history_card').style.display='none';
        card_container.style.display='block';
    }
}




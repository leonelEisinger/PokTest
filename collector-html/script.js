const items = [
    {, name: "common", rarity: 60},
    {name: "uncommon", rarity: 20},
    {name: "rare", rarity: 15},
    {name: "epic", rarity: 4},
    {name: "legendary", rarity: 1}
];



function getRandomItem(){
    let randomNumber = Math.random() * 100;
    for (let i; items <= items.length; i++) {
           randomNumber -= items[i].rarity;
           if (randomNumber <= 0) {
               alert(items[i].name);
           }
       }
}



function IterateOverArrayAndReturnTileElements(array, x, y){
    let matches = [];
    for (let element of array){
        if (element.x == x && element.y == y){
            matches.push(element);
        }
    }
    return matches;
}

function GetAvailableWarriors(warriorsArray){
    let availableWarriors = [];
    for (let warrior of warriorsArray){
        if (warrior.canMove){
            availableWarriors.push(warrior);
        }
    }
    return availableWarriors;
}

export {IterateOverArrayAndReturnTileElements, GetAvailableWarriors};
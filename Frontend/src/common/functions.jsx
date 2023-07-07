function IterateOverArrayAndReturnTileElements(array, x, y){
    let matches = [];
    for (let element of array){
        if (element.x == x && element.y == y){
            matches.push(element);
        }
    }
    return matches;
}

export {IterateOverArrayAndReturnTileElements};

/**
 * Copies the given object, removing any references.
 * @param {Object} obj 
 */
let deepCopy = function (obj) {
    let result = Object.assign({}, obj);
    for (let propId in result) {
        let prop = result[propId];
        if (obj.hasOwnProperty(propId) && typeof(prop) === "object") {
            result[propId] = deepCopy(prop);
        }
    }

    return result;
};
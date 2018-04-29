
class TestCase {
    constructor(title, nn, id, getInput) {
        this.title = title;
        this.nn = nn;
        this.id = id;
        this.getInput = getInput;
    };

    init(options) {
        throw "The function init must be overridden.";
    };

    update(options) {
        throw "The function update must be overridden.";
    };
}
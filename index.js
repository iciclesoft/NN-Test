let testGroups = [];
let paused = false;
let options;

let initOptions = function () {
    options = {
        $container: $("body")
    };
};

let initTests = function () {
    testGroups = BorderGroup.getGroups();

    for (let testGroup of testGroups) {
        testGroup.init(options);
    }
};

let loop = function () {
    if (!paused) {
        for (let testGroup of testGroups) {
            testGroup.update(options);
        }
    }
    window.requestAnimationFrame(loop);
};

// Document ready
$(function () {
    initOptions();
    initTests();
    window.requestAnimationFrame(loop);
});
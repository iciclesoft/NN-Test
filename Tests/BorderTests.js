
let roundTimeSeconds = 60 * 10;

class BorderGroup extends TestGroup {
    constructor(title, id, tests) {
        super(title, id, tests);
    };

    init(options) {
        super.init(options);
        this.roundStarted = new Date();
    };

    update(options) {
        super.update(options);
        // Check if the current round is completed
        let now = new Date();
        var secondsPassed = (now.getTime() - this.roundStarted.getTime()) / 1000;
        if (secondsPassed >= roundTimeSeconds) {
            let $results = options.$container.find(`#${this.id} .results`);
            this.addResultAndReset($results);
        }
    };

    percentageDone() {
        let now = new Date();
        var secondsPassed = (now.getTime() - this.roundStarted.getTime()) / 1000;
        return ((secondsPassed / roundTimeSeconds) * 100).toFixed(1);
    };

    addResultAndReset($results) {
        // Append a new row to the results element
        $results.append("<hr/>");
        let $row = $("<div></div>");
        $row.appendTo($results);
        for (let test of this.tests) {
            // Add the results of each test
            let $cell = $(`<div>${test.title}: ${test.avgUpdatesNeeded()}</div>`);
            $cell.appendTo($row);
            // Reset the test
            test.reset();
        }
        // Reset the round
        this.roundStarted = new Date();
    };
};

/**
 * Static function where all testcases are declared and put in their respective groups.
 * Returns an array of TestGroups.
 */
BorderGroup.getGroups = function () {
    let testGroups = [];
    
    // 32 hidden nodes
    let c32HiddenTests = [];
    // Single input
    let caseSingle32 = new BorderTest("Single input", new NeuralNetwork(1, 32, 1), `${testGroups.length}_${c32HiddenTests.length}`, function (y) {
        return [y];
    });
    c32HiddenTests.push(caseSingle32);
    // Double input
    let caseDouble32 = new BorderTest("Double input", new NeuralNetwork(2, 32, 1), `${testGroups.length}_${c32HiddenTests.length}`, function (y) {
        return [y, y];
    });
    c32HiddenTests.push(caseDouble32);
    // Double input flipped
    let caseDoubleFlipped32 = new BorderTest("Double input, flipped second", new NeuralNetwork(2, 32, 1), `${testGroups.length}_${c32HiddenTests.length}`, function (y) {
        return [y, 1 - y];
    });
    c32HiddenTests.push(caseDoubleFlipped32);
    let c32Hidden = new BorderGroup("Border test with 32 hidden nodes", testGroups.length, c32HiddenTests);
    testGroups.push(c32Hidden);

    return testGroups;
};
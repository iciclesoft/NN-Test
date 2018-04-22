const height = 100;
const tests = [];
const trainingData = [{
        input: [0],
        output: [1]
    },
    {
        input: [.5],
        output: [0]
    },
    {
        input: [1],
        output: [1]
    }
];

let paused = false;

class TestCase {
    constructor(title, nn, id, getInput) {
        this.title = title;
        this.nn = nn;
        this.id = `case_${id}`;
        this.getInput = getInput;
        this.ctx = undefined;
    };

    createHtml() {
        let $container = $(`<div class='container' id=' ${this.id} '></div>`);
        $container.appendTo($("body"));

        $(`<div><h3>${this.title}</h3></div>`)
            .appendTo($container);
        let $canvas = $(`<canvas width='1' height='${height}'></canvas>`);
        $canvas.appendTo($container);
        this.ctx = $canvas[0].getContext("2d");

        $(`<div>Neural Network:<br/>
            I: ${this.nn.input_nodes}<br/>
            H: ${this.nn.hidden_nodes}<br/>
            O: ${this.nn.output_nodes}</div>`)
            .appendTo($container);
        $(`<hr/>`)
            .appendTo($container);
        let btnReset = $(`<button>Reset</button>`)
        btnReset.appendTo($container);
        btnReset.click(function () {
            this.nn = new NeuralNetwork(this.nn.input_nodes, this.nn.hidden_nodes, this.nn.output_nodes);
        }.bind(this));
    };

    update() {
        for (let i = 0; i < 1000; i++) {
            var rndIndex = Math.floor(Math.random() * trainingData.length);
            var rndData = trainingData[rndIndex];
            var input = this.getInput(rndData.input[0]);
            this.nn.train(input, rndData.output);
        }

        for (let y = 0; y < height; y++) {
            let normalized = y / height;
            let result = this.nn.predict(this.getInput(normalized))[0];
            let color = Math.floor(result * 255);
            this.ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            this.ctx.fillRect(0, y, 1, 1);
        }
    };
}

let initTests = function () {
    // Single input
    let caseSingle = new TestCase("Single input, single hidden", new NeuralNetwork(1, 1, 1), tests.length, function (y) {
        return [y];
    });
    tests.push(caseSingle);
    // Double input
    let caseDouble = new TestCase("Double input, single hidden", new NeuralNetwork(2, 1, 1), tests.length, function (y) {
        return [y, y];
    });
    tests.push(caseDouble);
    // Double input flipped
    let caseDoubleFlipped = new TestCase("Flipped double input, single hidden", new NeuralNetwork(2, 1, 1), tests.length, function (y) {
        return [y, 1 - y];
    });
    tests.push(caseDoubleFlipped);
    // Copy paste with double hidden
    // Single input
    let caseSingle2 = new TestCase("Single input, double hidden", new NeuralNetwork(1, 2, 1), tests.length, function (y) {
        return [y];
    });
    tests.push(caseSingle2);
    // Double input
    let caseDouble2 = new TestCase("Double input, double hidden", new NeuralNetwork(2, 2, 1), tests.length, function (y) {
        return [y, y];
    });
    tests.push(caseDouble2);
    // Double input flipped
    let caseDoubleFlipped2 = new TestCase("Flipped double input, double hidden", new NeuralNetwork(2, 2, 1), tests.length, function (y) {
        return [y, 1 - y];
    });
    tests.push(caseDoubleFlipped2);

    $.each(tests, function (index, test) {
        if (index % 3 === 0) {
            $("body").append($("<br/>"));
        }
        test.createHtml();
    });
};

let loop = function () {
    if (!paused) {
        $.each(tests, function (index, test) {
            test.update();
        });

        window.requestAnimationFrame(loop);
    }
};

// Document ready
$(function () {
    initTests();
    window.requestAnimationFrame(loop);
});
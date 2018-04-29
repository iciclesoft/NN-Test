const height = 100;
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
const trainsPerUpdate = 1000;
const stopAfterCompletion = false;
// Used to determine of the test is succesfully completed
const allowedError = .02;

class BorderTest extends TestCase {
    constructor(title, nn, id, getInput) {
        super(title, nn, `case_${id}`, getInput);

        this.ctx = undefined;
        this.updateCount = 0;
        this.completedCount = 0;
        this.stopped = false;
    };

    init(options) {
        this.createHtml(options.$container);
    };

    update(options) {
        if (!this.stopped) {
            let $this = options.$container.find(`#${this.id}`);
            if (this.isCompleted()) {
                this.stopped = true;
                this.completedCount += 1;
                if (stopAfterCompletion) {
                    $this.addClass('done');
                } else {
                    this.restart();
                }
            } else {
                // Train the neural network
                for (let i = 0; i < trainsPerUpdate; i++) {
                    var rndIndex = Math.floor(Math.random() * trainingData.length);
                    var rndData = trainingData[rndIndex];
                    var input = this.getInput(rndData.input[0]);
                    this.nn.train(input, rndData.output);
                }
                this.updateCount += 1;

                // Show the predictions of the neural network
                for (let y = 0; y < height; y++) {
                    let normalized = y / height;
                    let result = this.nn.predict(this.getInput(normalized))[0];
                    let color = Math.floor(result * 255);
                    this.ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
                    this.ctx.fillRect(0, y, 1, 1);
                }
            }
            // Update the stats of this test
            $this.find('.updatesNeeded').html(this.updateCount);
            $this.find('.completed').html(this.completedCount);
            $this.find('.average').html(this.avgUpdatesNeeded());
        }
    };

    // Functions specific for this test
    createHtml($parent) {
        let $container = $(`<div class='container' id='${this.id}'></div>`);
        $container.appendTo($parent);

        $(`<div><h3>${this.title}</h3></div>`).appendTo($container);
        let $canvas = $(`<canvas class='border-canvas' width='1' height='${height}'></canvas>`);
        $canvas.appendTo($container);
        this.ctx = $canvas[0].getContext("2d");

        $(`
            <div>Neural Network:<br/>
            I: ${this.nn.input_nodes} | H: ${this.nn.hidden_nodes} | O: ${this.nn.output_nodes}<br/>
            Updates needed: <span class='updatesNeeded'>${this.updateCount}</span><br/>
            Times completed: <span class='completed'>${this.completedCount}</span><br/>
            Average: <span class='average'>${this.avgUpdatesNeeded()}</span>
            </div>
        `).appendTo($container);
    };

    restart() {
        this.nn = new NeuralNetwork(this.nn.input_nodes, this.nn.hidden_nodes, this.nn.output_nodes);
        this.stopped = false;
    };

    reset() {
        this.updateCount = 0;
        this.completedCount = 0;
        this.restart();
    };

    isCompleted() {
        let inputTop = 0;
        let resultTop = this.nn.predict(this.getInput(inputTop))[0];
        let topDone = this.isWithinError(resultTop, 1);

        let inputBottom = 1;
        let resultBottom = this.nn.predict(this.getInput(inputBottom))[0];
        let bottomDone = this.isWithinError(resultBottom, 1);

        let inputMiddle = .5;
        let resultMiddle = this.nn.predict(this.getInput(inputMiddle))[0];
        let middleDone = this.isWithinError(resultMiddle, 0);

        return topDone && bottomDone && middleDone;
    };

    isWithinError(result, expected) {
        return expected - allowedError <= result && expected + allowedError >= result;
    };

    avgUpdatesNeeded() {
        let timesCompleted = this.completedCount || 1;
        return (this.updateCount / timesCompleted).toFixed(2);
    };
}

class TestGroup {
    constructor(title, id, tests) {
        this.title = title;
        this.id = id;
        this.tests = tests;
    };

    init(options) {
        // Initialize the html for this TestGroup
        this.createHtml(options.$container);
        let groupOptions = this.getGroupOptions(options);

        // Initialize all tests within this TestGroup
        for (let test of this.tests) {
            test.init(groupOptions);
        }
    };

    update(options) {
        let groupOptions = this.getGroupOptions(options);

        // Update all tests within this TestGroup
        for (let test of this.tests) {
            test.update(groupOptions);
        }
        
        this.updateProgressBar(options.$container.find(`#${this.id}`));
    };

    /**
     * Copies the given options object and updates it for this specific TestGroup.
     * @param {Object} options 
     */
    getGroupOptions(options) {
        let groupOptions = deepCopy(options);
        groupOptions.$container = options.$container.find(`#${this.id} .test-cases`);
        return groupOptions;
    };

    /**
     * This is used by the progress bar, must be overridden and return an inclusive number between 0 and 100.
     */
    percentageDone() {
        throw "The function percentageDone must be overridden and return an inclusive number between 0 and 100";
    };

    /**
     * Updates the progress bar found in $container based on the percentage calculated by percentageDone.
     * @param {jQuery-object} $container
     */
    updateProgressBar($container) {
        let $percentage = $container.find(`.progress-bar .percentage`);
        $percentage.css("width", `${this.percentageDone()}%`);
    }

    /**
     * Appends the html for this TestGroup to the given $container.
     * @param {jQuery-object} $container
     */
    createHtml($container) {
        $container.append($(`
            <div class='container' id='${this.id}'>
                <div class='center'><div class='progress-bar'><div class='percentage'><h2>${this.title}</h2></div></div></div>
                <div class='test-cases'></div>
                <div class='results'><h4>Results:</h4></div>
            </div>
        `));
    };
};
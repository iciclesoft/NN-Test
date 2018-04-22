# README
This is a test project to show behavior of a neural network based on the amount of input- and hidden-nodes.

Based on a code-review (https://github.com/CodingTrain/Toy-Neural-Network-JS/pull/116#pullrequestreview-114173934) the question was raised wether 2 inputs based on the same value would have the same net result as 1 input. This example shows that the amount of inputs have no effect on the result, only the amount of hidden inputs will affect the result.

What we see here are different test-cases, each having a difference in the amount of input- and hidden-nodes of the neural network. The input is always based on the y-value of the canvas. The neural networks are trained in such a way that the top and bottom of the canvas should result in an output of 1, while the middle of the canvas should result in an output of 2.
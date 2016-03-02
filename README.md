# The DBSCAN Clustering Algorithm

In this project, we implement the DBSCAN clustering algorithm. For
further details, please visit my
[homepage](http://yaikhom.com/2015/09/04/implementing-the-dbscan-clustering-algorithm.html),
or view the NOWEB generated documentation `dbscan.pdf`.

##Source code

This repository contains the following source code and data files:

* `dbscan.c` - A C programming language implementation (uses 3D data points).
* `dbscan.js`- A JavaScript implementation (uses 2D data points).
* `dbscan.min.js`- A minified JavaScript implementation.
* `example.dat` - Example data file.
* `imageseg` - Adaptation of DBSCAN algorithm for image segmentation.

##Usage

To run the algorithm on the supplied example data, first compile

    $ clang -O2 -Wall -g -o dbscan dbscan.c -lm

and then run the program:

    $ cat example.dat | ./dbscan

This will produce output as follows:

    Epsilon: 1.000000
    Minimum points: 2
    Number of points: 53
    x     y     z     cluster_id
    ----------------------------------------------
    1.00  3.00  1.00: 0
    1.00  4.00  1.00: 0
    1.00  5.00  1.00: 0
    1.00  6.00  1.00: 0
    2.00  2.00  1.00: 2
    2.00  3.00  0.00: 1
    2.00  4.00  0.00: 1
    2.00  5.00  0.00: 1
    2.00  6.00  0.00: 1
    2.00  7.00  1.00: 3
    3.00  1.00  1.00: 2
    3.00  2.00  1.00: 2
    ...

If you wish to try the algorithm interactively, a JavaScript
implementation is available
[here](http://yaikhom.com/2015/09/04/implementing-the-dbscan-clustering-algorithm.html). This
example uses HTML5 canvas and was implemented using
[d3js](http://d3js.org) for DOM manipulation and user interaction.

/* Copyright 2016 Gagarine Yaikhom (MIT License) */
(function() {
    if (typeof cluster === 'undefined')
        cluster = {};

    var embryo_image = d3.select("#embryo-image"),
    embryo_canvas = d3.select("#embryo-canvas"),
    parameters = d3.select("#parameters"),
    ctx = embryo_canvas.node().getContext("2d"),
    dim = {'w': 300, 'h': 394},
    image_data, number_of_points = 0, points = [],
    epsilon, epsilon_max = 50, minpts = 8, clusters, num_clusters;

    ctx.drawImage(embryo_image.node(), 0, 0);
    image_data = ctx.getImageData(0, 0, dim.w, dim.h);

    /* When the mouse moves over the image, select clustering parameters,
       re-run clustering and render the new clusters */
    embryo_canvas.on("mousemove", function() {
        var event = d3.event, e, m;
        e = convert_to_epsilon(event.offsetX);
        m = convert_to_minpts(event.offsetY);
        if (e != epsilon || m != minpts) {
            epsilon = e;
            minpts = m;
            parameters.text('epsilon: ' + e + ', minpts: ' + m);
            cluster();
        }
    });

    /* Use width to select epsilon parameter */
    function convert_to_epsilon(x)
    {
        var divs = dim.w / epsilon_max;
        return Math.round(x / divs);
    }

    /* Use height to select minpts parameter */
    function convert_to_minpts(y)
    {
        var divs = dim.h / minpts;
        return Math.round(y / divs) + 1;
    }

    /* Renders the cluster using assigned colours for each pixel in a cluster */
    function paint_cluster(cluster_id)
    {
        var i = 0, j = 0, rgb, p, pix = image_data.data;
        while (j < number_of_points) {
            rgb = cluster_colours[0];
            p = points[j];
            if (p.ignore)
                rgb = cluster_colours[p.cluster_id];
            pix[i] = rgb[0];
            pix[i + 1] = rgb[1];
            pix[i + 2] = rgb[2];
            i += 4;
            ++j;
        }
        ctx.putImageData(image_data, 0, 0);
    }

    function pixel_distance(a, b)
    {
        return Math.sqrt(Math.pow(a.r - b.r, 2) +
                         Math.pow(a.g - b.g, 2) +
                         Math.pow(a.b - b.b, 2));
    }

    /* Called every time we wish to reset the data points, and re-run DBSCAN
       clustering with different clustering parameters */
    function cluster()
    {
        var i, p;
        for (i in points) {
            p = points[i];
            p.ignore = false;
            p.cluster_id = -1;
        }
        num_clusters = dbscan.run(points, epsilon, minpts,
                                  pixel_distance, dim);
        paint_cluster(0);
    }

    /* Scan embryo image canvas and convert to RGB data points */
    function canvas_to_points()
    {
        var i, n, x = 0, y = 0, pix = image_data.data;
        for (i = 0, n = pix.length; i < n; i += 4) {
            points.push({"x": x, "y": y,
                         "r": pix[i], "g": pix[i + 1], "b": pix[i + 2],
                         "ignore": false,
                         "cluster_id": -1});
            ++number_of_points;
            ++x;
            if (x === dim.w) {
                x = 0;
                ++y;
            }
        }
    }

    canvas_to_points();

    /* These are the colours we will use to render the clusters */
    cluster_colours = [
        [0,0,0], /* #000000*/
        [71,190,192], /* #47BEC0*/
        [240,74,28], /* #F04A1C */
        [219,65,226], /* #DB41E2 */
        [72,198,33], /* #48C621 */
        [96,56,90], /* #60385A */
        [62,86,23], /* #3E5617 */
        [112,146,236], /* #7092EC */
        [241,63,122], /* #F13F7A */
        [190,169,39], /* #BEA927 */
        [118,54,14], /* #76360E */
        [217,155,187], /* #D99BBB */
        [51,98,107], /* #33626B */
        [227,147,102], /* #E39366 */
        [118,180,101], /* #76B465 */
        [159,47,132], /* #9F2F84 */
        [216,133,224], /* #D885E0 */
        [107,78,181], /* #6B4EB5 */
        [174,37,43], /* #AE252B */
        [73,98,152], /* #496298 */
        [232,127,43], /* #E87F2B */
        [194,103,105], /* #C26769 */
        [97,177,216], /* #61B1D8 */
        [170,121,34], /* #AA7922 */
        [163,165,86], /* #A3A556 */
        [56,103,72], /* #386748 */
        [54,158,43], /* #369E2B */
        [86,59,28], /* #563B1C */
        [224,57,163], /* #E039A3 */
        [177,95,231], /* #B15FE7 */
        [232,102,155], /* #E8669B */
        [95,188,156], /* #5FBC9C */
        [156,91,152], /* #9C5B98 */
        [117,45,66], /* #752D42 */
        [114,119,28], /* #72771C */
        [161,69,179], /* #A145B3 */
        [69,69,86], /* #454556 */
        [167,110,81], /* #A76E51 */
        [150,167,219], /* #96A7DB */
        [131,47,44], /* #832F2C */
        [62,143,155], /* #3E8F9B */
        [128,106,143], /* #806A8F */
        [234,93,83], /* #EA5D53 */
        [230,100,220], /* #E664DC */
        [191,153,224], /* #BF99E0 */
        [195,154,89], /* #C39A59 */
        [99,85,21], /* #635515 */
        [228,157,51], /* #E49D33 */
        [169,54,77], /* #A9364D */
        [73,62,122], /* #493E7A */
        [193,98,71], /* #C16247 */
        [115,43,104], /* #732B68 */
        [131,112,234], /* #8370EA */
        [125,195,50], /* #7DC332 */
        [188,48,20], /* #BC3014 */
        [222,53,85], /* #DE3555 */
        [168,51,109], /* #A8336D */
        [99,128,154], /* #63809A */
        [134,157,43], /* #869D2B */
        [46,107,25], /* #2E6B19 */
        [226,105,185], /* #E269B9 */
        [70,192,134], /* #46C086 */
        [174,114,139], /* #AE728B */
        [134,180,193], /* #86B4C1 */
        [75,149,213], /* #4B95D5 */
        [70,187,98], /* #46BB62 */
        [232,47,190], /* #E82FBE */
        [236,60,58], /* #EC3C3A */
        [34,74,67], /* #224A43 */
        [158,110,200], /* #9E6EC8 */
        [232,102,119], /* #E86677 */
        [59,132,121], /* #3B8479 */
        [66,111,214], /* #426FD6 */
        [78,128,73], /* #4E8049 */
        [233,44,138], /* #E92C8A */
        [128,120,61], /* #80783D */
        [149,94,36], /* #955E24 */
        [166,145,190], /* #A691BE */
        [96,105,180], /* #6069B4 */
        [88,159,115], /* #589F73 */
        [50,76,111], /* #324C6F */
        [218,125,167], /* #DA7DA7 */
        [238,142,139], /* #EE8E8B */
        [186,50,166], /* #BA32A6 */
        [94,64,146], /* #5E4092 */
        [169,185,45], /* #A9B92D */
        [155,61,26], /* #9B3D1A */
        [115,62,44], /* #733E2C */
        [69,74,32], /* #454A20 */
        [200,161,68], /* #C8A144 */
        [209,99,43], /* #D1632B */
        [151,80,97], /* #975061 */
        [95,135,50], /* #5F8732 */
        [105,165,49], /* #69A531 */
        [237,122,97], /* #ED7A61 */
        [37,77,33], /* #254D21 */
        [161,186,94], /* #A1BA5E */
        [64,206,71], /* #40CE47 */
        [122,80,102], /* #7A5066 */
        [202,44,105], /* #CA2C69 */
        [115,82,40] /* #735228*/
    ];

})();

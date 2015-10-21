/* Copyright 2015 Gagarine Yaikhom (MIT License) */
(function () {
    var UNCLASSIFIED = -1,
        NOISE = -2,
        CORE_POINT = 1,
        NOT_CORE_POINT = 0,
        SUCCESS = 0;

    if (typeof dbscan === 'undefined')
        dbscan = {};

    dbscan.run = function (points, num_points, epsilon, minpts, dist)
    {
        var i, cluster_id = 0;
        for (i = 0; i < num_points; ++i) {
            if (points[i].cluster_id === UNCLASSIFIED) {
                if (expand(i, cluster_id, points,
                    num_points, epsilon, minpts,
                    dist) === CORE_POINT)
                    ++cluster_id;
            }
        }
    };

    function get_epsilon_neighbours(index, points, num_points, epsilon, dist)
    {
        var i, en = [], d;
        for (i = 0; i < num_points; ++i) {
            if (i === index)
                continue;
            d = dist(points[index], points[i]);
            if (d > epsilon)
                continue;
            else
                en.push(i);
        }
        return en;
    }

    function expand(index, cluster_id, points,
        num_points, epsilon, minpts, dist)
    {
        var i, return_value = NOT_CORE_POINT,
            seeds = get_epsilon_neighbours(index, points,
                num_points, epsilon, dist);
        if (seeds.length < minpts)
            points[index].cluster_id = NOISE;
        else {
            points[index].cluster_id = cluster_id;
            for (i = 0; i < seeds.length; ++i)
                points[seeds[i]].cluster_id = cluster_id;
            for (i = 0; i < seeds.length; ++i)
                spread(seeds[i], seeds, cluster_id, points,
                    num_points, epsilon, minpts, dist);
            return_value = CORE_POINT;
        }
        return return_value;
    }

    function spread(index, seeds, cluster_id, points,
        num_points, epsilon, minpts, dist)
    {
        var i, c, d, idx,
            spread = get_epsilon_neighbours(index, points,
                num_points, epsilon, dist);
        c = spread.length;
        if (c >= minpts) {
            for (i = 0; i < c; ++i) {
                idx = spread[i];
                d = points[idx];
                if (d.cluster_id === NOISE ||
                    d.cluster_id === UNCLASSIFIED) {
                    if (d.cluster_id === UNCLASSIFIED) {
                        seeds.push(idx);
                    }
                    d.cluster_id = cluster_id;
                }
            }
        }
        return SUCCESS;
    }

    dbscan.euclidean_dist = function (a, b)
    {
        return Math.sqrt(Math.pow(a.x - b.x, 2) +
            Math.pow(a.y - b.y, 2));
    };

    dbscan.print_points = function (points, num_points)
    {
        var i = 0;
        console.log("Number of points: " + num_points);
        while (i < num_points) {
            p = points[i];
            console.log(p.x, p.y, p.cluster_id);
            ++i;
        }
    };

})();

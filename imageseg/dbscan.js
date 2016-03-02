/* Copyright 2015 Gagarine Yaikhom (MIT License) */
(function () {
    var UNCLASSIFIED = -1,
    NOISE = -2,
    CORE_POINT = 1,
    NOT_CORE_POINT = 0,
    SUCCESS = 0,

    /* minimum number of points required for a cluster to be valid */
    MIN_CLUSTER_SIZE = 50,
    num_clusters = 0,
    viable_cluster_ids,
    clusters,

    /* For a 2D image, the following gives the adjacent neighbours of a pixel */
    neighbours = [
        [-1, -1],
        [-1,  0],
        [-1,  1],
        [ 0, -1],
        [ 0,  1],
        [ 1, -1],
        [ 1,  0],
        [ 1,  1]
    ];

    if (typeof dbscan === 'undefined')
        dbscan = {};

    dbscan.run = function (points, epsilon, minpts, dist, dim)
    {
        var i, cluster_id;
        num_clusters = 0;
        viable_cluster_ids = [];

        /* The first clustering removes the space surrounding the embryo */
        num_clusters = cluster_unclustered(points, 1, minpts, dist, dim);

        /* Now cluster segments within the embryo image */
        num_clusters = cluster_unclustered(points, epsilon, minpts, dist, dim);
        return num_clusters;
    };

    function cluster_unclustered(points, epsilon, minpts,
                                 dist, dim)
    {
        var i;
        cluster_id = 0;
        clusters = {};
        clusters[cluster_id] = [];
        for (i in points)
            if (points[i].cluster_id === UNCLASSIFIED) {
                if (expand(i, cluster_id, points,
                           epsilon, minpts,
                           dist, dim) === CORE_POINT) {
                    ++cluster_id;
                    clusters[cluster_id] = [];
                }
            }
        return extract_viable_clusters(points);
    }

    function extract_viable_clusters(points)
    {
        var i, p, cluster_id, pts;
        for (cluster_id in clusters) {
            pts = clusters[cluster_id];
            if (pts.length >= MIN_CLUSTER_SIZE) {
                viable_cluster_ids.push(cluster_id);
                for (i in pts) {
                    p = points[pts[i]];
                    p.cluster_id = num_clusters;
                    p.ignore = true;
                }
                ++num_clusters;
            }
        }
        for (i in points) {
            p = points[i];
            if (!p.ignore)
                p.cluster_id = UNCLASSIFIED;
        }
        return num_clusters;
    }

    function get_epsilon_neighbours(index, points, epsilon, dist, dim)
    {
        var i, en = [], x, y, nx, ny, idx, neighbour;
        x = points[index].x;
        y = points[index].y;
        for (i = 0; i < 8; ++i) {
            neighbour = neighbours[i];
            nx = x + neighbour[0];
            if (nx < 0 || nx >= dim.w)
                continue;
            ny = y + neighbour[1];
            if (ny < 0 || ny >= dim.h)
                continue;
            idx = nx + ny * dim.w;
            if (points[idx].ignore)
                continue;
            if (dist(points[index], points[idx]) > epsilon)
                continue;
            else
                en.push(idx);
        }
        return en;
    }

    function expand(index, cluster_id, points,
                    epsilon, minpts, dist, dim)
    {
        var i, return_value = NOT_CORE_POINT,
        seeds = get_epsilon_neighbours(index, points,
                                       epsilon, dist, dim);
        if (seeds.length < minpts)
            points[index].cluster_id = NOISE;
        else {
            points[index].cluster_id = cluster_id;
            clusters[cluster_id].push(index);
            for (i = 0; i < seeds.length; ++i) {
                points[seeds[i]].cluster_id = cluster_id;
                clusters[cluster_id].push(seeds[i]);
            }
            for (i = 0; i < seeds.length; ++i)
                spread(seeds[i], seeds, cluster_id, points,
                       epsilon, minpts, dist, dim);
            return_value = CORE_POINT;
        }
        return return_value;
    }

    function spread(index, seeds, cluster_id, points,
                    epsilon, minpts, dist, dim)
    {
        var i, c, d, idx,
        spread = get_epsilon_neighbours(index, points,
                                        epsilon, dist, dim);
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
                    clusters[cluster_id].push(idx);
                }
            }
        }
        return SUCCESS;
    }

})();

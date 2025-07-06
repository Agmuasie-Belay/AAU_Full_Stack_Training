//Merge sort, alternatively we can use the library function sort()
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    var mid = Math.floor(arr.length / 2);
    var left = mergeSort(arr.slice(0, mid));
    var right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    var result = [];
    var i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }

    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}

//Mean
function getMean(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;

    var sum = 0;
    var count = 0;

    for (var i = 0; i < arr.length; i++) {
        var val = arr[i];
        if (typeof val === 'number' && !isNaN(val)) {
            sum += val;
            count++;
        }
    }

    return count === 0 ? null : sum / count;
}

//Median
function getMedian(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;

    var cleaned = [];
    for (var i = 0; i < arr.length; i++) {
        if (typeof arr[i] === 'number' && !isNaN(arr[i])) {
            cleaned.push(arr[i]);
        }
    }

    if (cleaned.length === 0) return null;

    var sorted = mergeSort(cleaned);
    var mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

// Mode
function getMode(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;

    var freq = {};
    var maxFreq = 0;
    var modes = [];

    for (var i = 0; i < arr.length; i++) {
        var num = arr[i];
        if (typeof num !== 'number' || isNaN(num)) continue;

        freq[num] = (freq[num] || 0) + 1;

        if (freq[num] > maxFreq) {
            maxFreq = freq[num];
        }
    }

    for (var key in freq) {
        if (freq[key] === maxFreq) {
            modes.push(Number(key));
        }
    }

    return modes.length === 0 ? null : (modes.length === 1 ? modes[0] : modes);
}

//Test
let arr = [1, 9, 0, 3, 6, 11, -2, 0, -2];
const mean1 = getMean(arr);
const median1 = getMedian(arr);
const mode1 = getMode(arr);

console.log(mean1, median1, mode1);
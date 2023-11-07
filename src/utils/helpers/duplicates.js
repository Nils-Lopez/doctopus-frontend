const removeDuplicates = (arr) => {
  var seen = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
    if (!(arr[i]._id in seen)) {
      ret_arr.push(arr[i]);
      seen[arr[i]._id] = true;
    }
  }
  return ret_arr;
};

export default removeDuplicates;

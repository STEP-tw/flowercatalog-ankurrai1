let displayComments = function() {
  document.getElementById("table").innerHTML=inSingleHtml(data);
};

const inSingleHtml = function(feedBacks) {
  let feedBacksInHtml = feedBacks.map(intoTableRow);
  feedBacksInHtml.unshift(`<tr align="left"><th>Date And Time </th><th>Name</th><th>Comments</th></tr>`);
  return feedBacksInHtml.join('<br>');
};

const intoTableRow = function(details) {
  let feedBack = "";
  feedBack += `<td>${details.dateTime}</td>`;
  feedBack += `<td>${details.name}</td>`;
  feedBack += `<td>${details.comment}</td>`;
  return `<tr>${feedBack}</tr>`;
};

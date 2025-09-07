function makeNode(type, content = undefined, classlist = []){
  const el = document.createElement(type);

  if(classlist.length > 0){
    el.classList.add(classlist);
  }

  if(content){
    el.textContent = content;
  }
  return el;
}

function displayValue(valueFound){
  const keyDiv = makeNode("div", undefined, ["col-md-6"]);
  const key = makeNode("b", "Calculated");
  keyDiv.appendChild(key);

  const valueDiv = makeNode("div", undefined, ["col-md-6"]);
  const value = makeNode("b", valueFound);
  valueDiv.appendChild(value);

  const row = makeNode("div", undefined, ["row"]);
  row.appendChild(keyDiv);
  row.appendChild(valueDiv);

  const rows = document.querySelectorAll(".row");
  rows[2].insertAdjacentElement("afterend", row);
}

function countMark(){
  const values = document.querySelectorAll(".defmarkcl");
  let sum = 0;

  values.forEach((x)=>{
    if(x.value){
      sum += Number(x.value);
    }
  });

  return sum;
}

displayValue(countMark());
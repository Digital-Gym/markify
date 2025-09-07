// in case if srs changes something, we need to react quickly !
const MARK_COLUMN_NAME = 'Mark'
const LEVEL_COLUMN_NAME = 'Level'
const CREDIT_COLUMN_NAME = 'Credit'

const OUTPUT_DIV_CLASS = '.card-header'

function makeNode(type, content = undefined, classlist = []){
  const el = document.createElement(type);

  if(classlist.length > 0){
    classlist.forEach(className => {
      el.classList.add(className);
    })
  }

  if(content){
    el.textContent = content;
  }
  return el;
}

function applyFlex(targetNode, direction, justify, align, gap) {
  targetNode.style.display = "flex"
  targetNode.style.justifyContent = justify
  targetNode.style.alignItems = align
  targetNode.style.flexDirection = direction

  if (gap) {
    targetNode.style.gap = gap
  }
}

// function getSeverityByLabel(label){
//   if (label.startsWith("A") || label.startsWith("B+")) return 'bg-success'
//   if (label.startsWith("B")) return 'bg-info'
//   if (label.startsWith("C")) return 'bg-info'
//   if (label.startsWith("D")) return 'bg-warning'
//   if (label.startsWith("F")) return 'bg-error'

//   return 'bg-secondary'
// }

function mountUSGPAExplanation(target) {
  const card = makeNode("div", null, ["mt-4"]);
  const body = makeNode("div", null);

  const title = makeNode("h5", "Conversion Scale", ["card-title"]);
  const intro = makeNode("p", "Approximate rules for calculation of the table above (US):", ["card-text"]);

  const list = makeNode("ul", null, ["list-unstyled", "mb-0"]);
  list.appendChild(makeNode("li", "93 and above → 4.0 (A)"));
  list.appendChild(makeNode("li", "90 – 92 → 3.7 (A–)"));
  list.appendChild(makeNode("li", "87 – 89 → 3.3 (B+)"));
  list.appendChild(makeNode("li", "83 – 86 → 3.0 (B)"));
  list.appendChild(makeNode("li", "80 – 82 → 2.7 (B–)"));
  list.appendChild(makeNode("li", "77 – 79 → 2.3 (C+)"));
  list.appendChild(makeNode("li", "73 – 76 → 2.0 (C)"));
  list.appendChild(makeNode("li", "70 – 72 → 1.7 (C–)"));
  list.appendChild(makeNode("li", "67 – 69 → 1.3 (D+)"));
  list.appendChild(makeNode("li", "65 – 66 → 1.0 (D)"));
  list.appendChild(makeNode("li", "Below 65 → 0.0 (F)"));
  
  body.appendChild(title);
  body.appendChild(intro);
  body.appendChild(list);
  card.appendChild(body);
  
  const linkToGithub = makeNode("a", "Check logic in github")
  linkToGithub.href = "https://github.com/Digital-Gym/markify"
  linkToGithub.target = "_blank";
  
  card.appendChild(makeNode("p", "Note: Credtis are also taken into consideration", ['mt-4']))
  card.appendChild(linkToGithub);

  target.appendChild(card);
}


function mountExtensionInfo(gpaTree) {
  const relativeTarget = document.querySelector(OUTPUT_DIV_CLASS);
  applyFlex(relativeTarget, "column", "flex-start", "flex-start", "12px");

  const title = makeNode("h2", 'GPA', ['mt-4'])
  title.title = 'Inserted by extension Markify';

  // Table wrapper
  const table = makeNode("table", null, ["table", "table-bordered", "table-striped", "align-middle", "text-center"]);
  
  // Table head
  const thead = makeNode("thead");
  const headRow = makeNode("tr");
  headRow.appendChild(makeNode("th", "Group"));
  headRow.appendChild(makeNode("th", "Category"));
  headRow.appendChild(makeNode("th", "Score"));
  headRow.appendChild(makeNode("th", "Grade"));
  thead.appendChild(headRow);
  table.appendChild(thead);

  // Table body
  const tbody = makeNode("tbody");

  Object.entries(gpaTree).forEach(([groupKey, categories]) => {
    Object.entries(categories).forEach(([catKey, catValue], index) => {
      const row = makeNode("tr");

      // Show group only once for the first row of that group
      if (index === 0) {
        const groupCell = makeNode("td", groupKey);
        groupCell.rowSpan = Object.keys(categories).length;
        groupCell.classList.add("fw-bold");
        row.appendChild(groupCell);
      }

      row.appendChild(makeNode("td", catKey));

      // Score
      row.appendChild(makeNode("td", catValue.score.toFixed(2)));

      // Label with Bootstrap badge
      const labelTd = makeNode("td");
      const badge = makeNode("span", catValue.label);

      badge.width = "30px";
      badge.height = "30px";

      labelTd.appendChild(badge);
      row.appendChild(labelTd);

      tbody.appendChild(row);
    });
  });

  table.appendChild(tbody);


  // const helperDiv = makeNode('div')

  // helperDiv.appendChild(makeNode("p", "Thank you for using Markify!"))
  // helperDiv.appendChild(makeNode("p",
  //   "Thank you for using Markify!"
  // ))

  const infoCard = makeNode("div", null, ["card", "mt-4"]);
  const infoBody = makeNode("div", null, ["card-body"]);

  const thankYou = makeNode("h5", "✨ Thank you for using Markify!", ["card-title"]);
  const intro = makeNode("p", "I appreciate your trust. Here's what each GPA score means:", ["card-text"]);

  const list = makeNode("ul", null, ["mb-0"]);
  const us = makeNode("li", "US: Based on US grading standards.");
  const fair = makeNode("li", "Fair (US): US grading with pass mark difference taken into consideration");
  const linear = makeNode("li", "Linear: A linear scaling approach for GPA distribution.");
  list.appendChild(us);
  list.appendChild(fair);
  list.appendChild(linear);

  infoBody.appendChild(thankYou);
  infoBody.appendChild(intro);
  infoBody.appendChild(list);
  infoCard.appendChild(infoBody);

  const details = makeNode('details', undefined, ['mt-4'])
  details.appendChild(makeNode('summary', 'More info'))
  mountUSGPAExplanation(details)
  infoBody.appendChild(details)

  relativeTarget.appendChild(title);
  relativeTarget.appendChild(table);
  relativeTarget.appendChild(infoCard);
}



function parseTableData() {
  try {
    const tableBody = document.querySelector("tbody");
    const tableHead = document.querySelector("thead");
    const headers = [];
    const info = [];


    for (const columnNode of tableHead.children[0].children) {
      headers.push(columnNode.innerHTML?.replaceAll(" ", ''));
    }

    // sniifff it
    for (let row = 0; row < tableBody.children.length; row++) {
      info.push({});
      for (let column = 0; column < tableBody.children[row].children.length; column++) {
        const currentColumnName = headers[column];

        if (currentColumnName == MARK_COLUMN_NAME) {
          info[row][currentColumnName] = tableBody.children[row].children[column].children[0].innerHTML?.trim();
          continue;
        }

        info[row][currentColumnName] = tableBody.children[row].children[column].innerHTML?.trim();
      }
    }

    return info;
  } catch (error) {
    // console.error(error)
    console.log("[Markify]: Failed to calculate sorry :/")
  }
}

function sanitizeTableData(rows) {
  if (!rows) return;
  return rows.filter(row => !isNaN(Number(row[MARK_COLUMN_NAME])))
}

// asks for parsed table data and valid TableColumnName
// returns a Map<TableColumnName, Array<TableRow>>
function groupBy(info, columnName) {
  if (!info || !Array.isArray(info) || !info.length) return;
  const hash = new Map();

  for (const row of info) {
    if (hash.has(row[columnName])) {
      const currentValue = hash.get(row[columnName])
      currentValue.push(row)
      hash.set(row[columnName], currentValue);
      continue;
    }

    hash.set(row[columnName], [row]);
  }

  return hash;
}


function gpaToLabel(gpa, scale = 'us') {
  if (scale === "us") {
    if (gpa >= 3.85) return "A";
    else if (gpa >= 3.7) return "A-";
    else if (gpa >= 3.3) return "B+";
    else if (gpa >= 3.0) return "B";
    else if (gpa >= 2.7) return "B-";
    else if (gpa >= 2.3) return "C+";
    else if (gpa >= 2.0) return "C";
    else if (gpa >= 1.7) return "C-";
    else if (gpa >= 1.3) return "D+";
    else if (gpa >= 1.0) return "D";
    else return "F";
  }

  else if (scale === "simple") {
    if (gpa >= 3.0) return "A";
    else if (gpa >= 2.0) return "B";
    else if (gpa >= 1.0) return "C";
    else if (gpa > 0) return "D";
    else return "F";
  }

  else if (scale === "linear") {
    if (gpa >= 3.6) return "A";
    else if (gpa >= 2.6) return "B";
    else if (gpa >= 1.6) return "C";
    else if (gpa >= 0.6) return "D";
    else return "F";
  }
}

function convertMarkToGPA(mark, passMark = 40) {
  if (isNaN(mark) || mark < 0 || mark > 100) {
    console.error("[Markify] Given mark is invalid", mark);
    return;
  }

  // Standard US Grade
  let usGPA;
  if (mark >= 93) { usGPA = 4.0; }
  else if (mark >= 90) { usGPA = 3.7; }
  else if (mark >= 87) { usGPA = 3.3; }
  else if (mark >= 83) { usGPA = 3.0; }
  else if (mark >= 80) { usGPA = 2.7; }
  else if (mark >= 77) { usGPA = 2.3; }
  else if (mark >= 73) { usGPA = 2.0; }
  else if (mark >= 70) { usGPA = 1.7; }
  else if (mark >= 67) { usGPA = 1.3; }
  else if (mark >= 65) { usGPA = 1.0; }
  else { usGPA = 0.0; }

  // Linear
  let linearGPA = (mark / 100) * 4;
  if (linearGPA > 4) linearGPA = 4;

  // --- Fair U.S. Scale (adaptive with passMark) ---
  const range = 100 - passMark;
  let fairGPA;

  if (mark < passMark) {
    fairGPA = 0.0;
  } else {
    const relative = (mark - passMark) / range; // 0..1

    if (relative >= 0.875) { fairGPA = 4.0; }
    else if (relative >= 0.75) { fairGPA = 3.7; }
    else if (relative >= 0.675) { fairGPA = 3.3; }
    else if (relative >= 0.55) { fairGPA = 3.0; }
    else if (relative >= 0.45) { fairGPA = 2.7; }
    else if (relative >= 0.35) { fairGPA = 2.3; }
    else if (relative >= 0.25) { fairGPA = 2.0; }
    else if (relative >= 0.15) { fairGPA = 1.7; }
    else if (relative >= 0.07) { fairGPA = 1.3; }
    else { fairGPA = 1.0 }
  }

  return {
    usScale: { score: usGPA, label: gpaToLabel(usGPA) },
    linearScale: { score: parseFloat(linearGPA.toFixed(2)), label: "Linear" },
    fairUsScale: { score: fairGPA, label: gpaToLabel(fairGPA) }
  };
}

// accepts an array of table rows
// returns calculated gpas in 3 formats
function calculateGroupGPA(values) {
  let totalCredits = 0;
  let weightsSumUS = 0;
  let weightsSumFair = 0;
  let weightsSumLinear = 0;
  let weightsSumRaw = 0;

  for (const module of values) {
    totalCredits += Number(module[CREDIT_COLUMN_NAME])
    weightsSumLinear += Number(module[CREDIT_COLUMN_NAME]) * module.linearScale.score
    weightsSumUS += Number(module[CREDIT_COLUMN_NAME]) * module.usScale.score
    weightsSumFair += Number(module[CREDIT_COLUMN_NAME]) * module.fairUsScale.score
    weightsSumRaw += Number(module[CREDIT_COLUMN_NAME]) * Number(module[MARK_COLUMN_NAME])
  }

  const usScore = Math.round((weightsSumUS / totalCredits) * 100) / 100;
  const fairScore = Math.round((weightsSumFair / totalCredits) * 100) / 100
  const linearScore = Math.round((weightsSumLinear / totalCredits) * 100) / 100
  const rawScore = Math.round((weightsSumRaw / totalCredits) * 100) / 100

  return {
    "US": {
      score: usScore,
      label: gpaToLabel(usScore)
    },
    "Fair (US)": {
      score: fairScore,
      label: gpaToLabel(fairScore)
    },
    "Linear": {
      score: linearScore,
      label: gpaToLabel(linearScore, 'linear')
    },
    "WIUT": {
      score: rawScore,
      label: "-"
    }
  }
}

function calculateAllGPA(tableData) {
  const tableDataWithGPA = tableData.map(row => {
    return {
      ...row,
      ...convertMarkToGPA(row[MARK_COLUMN_NAME])
    }
  })

  const mapByLevel = groupBy(tableDataWithGPA, LEVEL_COLUMN_NAME);
  const gpaPerLevels = {}

  // calculate GPA
  for (const [key, values] of mapByLevel) {
    gpaPerLevels[`LVL ${key}`] = calculateGroupGPA(values);
  }

  if (mapByLevel.size > 1) {
    // calculate CGPA
    gpaPerLevels['Total'] = calculateGroupGPA(tableDataWithGPA)
  }

  return gpaPerLevels;
}


function init() {
  try {
    const tableData = sanitizeTableData(parseTableData());
    if (!tableData) {
      return;
    }
  
    const gpaTree = calculateAllGPA(tableData);
    if(!gpaTree) {
      return;
    }

    mountExtensionInfo(gpaTree);
  } catch(error) {
    console.error("[Markify]:", error)
  }
}

init();

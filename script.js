// Cache DOM elements
const numSemestersInput = document.getElementById('numSemesters');
const submitSemestersBtn = document.getElementById('submitSemestersBtn');
const gpaInputsDiv = document.getElementById('gpaInputs');
const calcBtn = document.getElementById('calcBtn');
const resultDiv = document.getElementById('result');
const percentageConverter = document.getElementById('percentageConverter');
const cgpaInput = document.getElementById('cgpaInput');
const convertBtn = document.getElementById('convertBtn');
const percentResult = document.getElementById('percentResult');
const gpaForm = document.getElementById('gpaForm');

// Create semester GPA input fields
function createInputs() {
  const num = parseInt(numSemestersInput.value, 10);
  gpaInputsDiv.innerHTML = '';
  resultDiv.innerHTML = '';
  percentageConverter.style.display = 'none';
  calcBtn.style.display = 'none';

  if (isNaN(num) || num < 1 || num > 20) {
    resultDiv.innerHTML = `<p style="color:tomato;">Please enter a valid number of semesters (1-20).</p>`;
    return;
  }

  for (let i = 1; i <= num; i++) {
    const groupDiv = document.createElement('div');

    const label = document.createElement('label');
    label.htmlFor = `gpa${i}`;
    label.textContent = `GPA for semester ${i}:`;

    const input = document.createElement('input');
    input.type = 'number';
    input.step = '0.01';
    input.min = '0';
    input.max = '10';
    input.id = `gpa${i}`;
    input.name = `gpa${i}`;
    input.autocomplete = 'off';
    input.required = true;
    input.style.marginLeft = '10px';

    groupDiv.appendChild(label);
    groupDiv.appendChild(input);

    gpaInputsDiv.appendChild(groupDiv);
  }
  calcBtn.style.display = 'inline-block';

  // Remove any previous handler to prevent multiple bindings
  gpaInputsDiv.removeEventListener('keydown', handleGpaInputsEnter);
  gpaInputsDiv.addEventListener('keydown', handleGpaInputsEnter);

  // Focus the first GPA input after creation
  const firstInput = document.getElementById('gpa1');
  if (firstInput) firstInput.focus();
}

// Handler for Enter key within GPA inputs
function handleGpaInputsEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault();

    const inputs = Array.from(gpaInputsDiv.querySelectorAll('input[type="number"]'));
    const currentIndex = inputs.indexOf(event.target);

    if (currentIndex !== -1) {
      if (currentIndex < inputs.length - 1) {
        // Focus next GPA input
        inputs[currentIndex + 1].focus();
      } else {
        // If last input, trigger CGPA calculation
        calcBtn.click();
      }
    }
  }
}

// Calculate CGPA from inputs
function calculateCGPA() {
  const num = parseInt(numSemestersInput.value, 10);
  let sum = 0;
  let valid = true;
  const errorFields = [];

  for (let i = 1; i <= num; i++) {
    const input = document.getElementById(`gpa${i}`);
    const gpaValue = input.value.trim();

    input.style.borderColor = ''; // Reset border color

    const gpa = parseFloat(gpaValue);
    if (gpaValue === '' || isNaN(gpa) || gpa < 0 || gpa > 10) {
      valid = false;
      errorFields.push(input);
    } else {
      sum += gpa;
    }
  }

  if (valid) {
    const cgpa = (sum / num).toFixed(2);
    resultDiv.innerHTML = `<h3>Your CGPA is: <span style="color:#222">${cgpa}</span></h3>`;
    showConverter(cgpa);
  } else {
    resultDiv.innerHTML = `<p style="color:tomato;">Please enter valid GPA values (0-10) for all semesters.</p>`;
    percentageConverter.style.display = 'none';
    // Highlight invalid fields briefly
    errorFields.forEach(input => {
      input.style.borderColor = 'tomato';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 1500);
    });
  }
}

// Display & initialize the percentage converter section
function showConverter(cgpa) {
  percentageConverter.style.display = 'block';
  cgpaInput.value = cgpa;
  percentResult.textContent = '';
}

// Convert CGPA input to percentage and show result
function convertToPercent() {
  const cgpaVal = parseFloat(cgpaInput.value.trim());
  if (!isNaN(cgpaVal)) {
    let percent = ((cgpaVal - 0.5) * 10).toFixed(2);
    // Clamp between 0 and 100
    percent = Math.min(Math.max(percent, 0), 100);
    percentResult.innerHTML = `
      Equivalent Percentage: <b style="color:#222">${percent}%</b>
    `;
  } else {
    percentResult.textContent = '';
  }
}

// Attach event listeners
submitSemestersBtn.addEventListener('click', createInputs);
calcBtn.addEventListener('click', calculateCGPA);
convertBtn.addEventListener('click', convertToPercent);

// Pressing Enter inside number of semesters input triggers GPA input creation
numSemestersInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    createInputs();
  }
});

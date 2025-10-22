// --- COMBINED SCRIPT FOR ALL STEPS ---
document.addEventListener("DOMContentLoaded", () => {
  // --- GLOBAL STATE & CONFIG ---
  let currentPage = 1;
  const totalPages = 5;
  const pageTitles = [
    "Vitals",
    "Vision",
    "Hearing",
    "Medical History",
    "Results",
  ];
  const mainData = JSON.parse(localStorage.getItem("armyMedicalData")) || {};

  const checkIcon = `<svg class="w-5 h-5 mr-2 shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;
  const crossIcon = `<svg class="w-5 h-5 mr-2 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
  const infoIcon = `<svg class="w-5 h-5 mr-2 shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>`;

  // --- NAVIGATION & UI FUNCTIONS ---
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  function updateUI() {
    // Update Pages
    for (let i = 1; i <= totalPages; i++) {
      document
        .getElementById(`page-${i}`)
        .classList.toggle("hidden", i !== currentPage);
    }

    // Update Stepper
    const stepperContainer = document.getElementById("stepper");
    stepperContainer.innerHTML = "";
    for (let i = 0; i < pageTitles.length; i++) {
      const step = i + 1;
      let stepClass = "step-inactive";
      if (step === currentPage) stepClass = "step-active";
      else if (step < currentPage) stepClass = "step-complete";

      const stepEl = document.createElement("div");
      stepEl.className = `step-indicator flex items-center space-x-2 ${stepClass}`;
      stepEl.innerHTML = `
        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold">${step}</div>
        <span class="hidden md:inline">${pageTitles[i]}</span>
    `;
      stepperContainer.appendChild(stepEl);

      if (i < pageTitles.length - 1) {
        const line = document.createElement("div");
        line.className = "flex-1 h-px bg-gray-300";
        stepperContainer.appendChild(line);
      }
    }

    // Update Buttons
    prevBtn.classList.toggle("hidden", currentPage === 1);
    if (currentPage === totalPages) {
      nextBtn.textContent = "Restart";
      nextBtn.classList.remove("bg-blue-600", "hover:bg-blue-700");
      nextBtn.classList.add("bg-green-600", "hover:bg-green-700");
    } else if (currentPage === totalPages - 1) {
      nextBtn.textContent = "Finish & See Summary";
      nextBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
      nextBtn.classList.remove("bg-green-600", "hover:bg-green-700");
    } else {
      nextBtn.textContent = "Next";
      nextBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
      nextBtn.classList.remove("bg-green-600", "hover:bg-green-700");
    }
  }

  function navigate(direction) {
    if (direction === 1 && !validateStep(currentPage)) {
      return; // Stop navigation if validation fails
    }
    saveStepData(currentPage);
    currentPage += direction;
    if (currentPage > totalPages) currentPage = 1; // Restart
    if (currentPage < 1) currentPage = 1;

    if (currentPage === totalPages) {
      generateFinalResults();
    }
    updateUI();
  }

  function validateStep(step) {
    if (step === 1) {
      const age = parseFloat(document.getElementById("age").value);
      const height = parseFloat(document.getElementById("height").value);
      const weight = parseFloat(document.getElementById("weight").value);
      if (
        isNaN(age) ||
        isNaN(height) ||
        isNaN(weight) ||
        age <= 0 ||
        height <= 0 ||
        weight <= 0
      ) {
        alert(
          "Please fill in all vitals fields with valid, positive numbers before proceeding.",
        );
        return false;
      }
    }
    if (step === 2) {
      if (
        !document.getElementById("entry-type").value ||
        !document.getElementById("service-type").value
      ) {
        alert("Please select your entry and service type.");
        return false;
      }
    }
    // Add more validations for other steps if needed
    return true;
  }

  function saveStepData(step) {
    switch (step) {
      case 1:
        mainData.vitals = {
          entry: document.getElementById("entry").value,
          gender: document.getElementById("gender").value,
          age: parseFloat(document.getElementById("age").value),
          height: parseFloat(document.getElementById("height").value),
          weight: parseFloat(document.getElementById("weight").value),
        };
        break;
      case 2:
        mainData.vision = {
          entryType: document.getElementById("entry-type").value,
          serviceType: document.getElementById("service-type").value,
          myopia: parseFloat(document.getElementById("myopia").value || 0),
          hypermetropia: parseFloat(
            document.getElementById("hypermetropia").value || 0,
          ),
          colorVisionScore: parseInt(
            document.getElementById("color-vision-score").textContent,
            10,
          ),
          hadLasik: document.querySelector('input[name="lasik"]:checked').value,
          lasikAge: parseInt(document.getElementById("lasik-age").value, 10),
          lasikDuration: parseInt(
            document.getElementById("lasik-duration").value,
            10,
          ),
        };
        break;
      case 3:
        mainData.hearing = {
          "left-low": document.getElementById("left-low").checked,
          "left-mid": document.getElementById("left-mid").checked,
          "left-high": document.getElementById("left-high").checked,
          "right-low": document.getElementById("right-low").checked,
          "right-mid": document.getElementById("right-mid").checked,
          "right-high": document.getElementById("right-high").checked,
        };
        break;
      case 4:
        const historyCheckboxes = document.querySelectorAll(
          'input[name="medical_history"]:checked',
        );
        mainData.medicalHistory = Array.from(historyCheckboxes).map(
          (cb) => cb.value,
        );
        break;
    }
    localStorage.setItem("armyMedicalData", JSON.stringify(mainData));
  }

  prevBtn.addEventListener("click", () => navigate(-1));
  nextBtn.addEventListener("click", () => navigate(1));

  // --- STEP 1: Vitals ---
  const vitalsStandards = {
    nda_army_navy: {
      male: {
        age: { min: 16.5, max: 19.5 },
        minHeight: 157,
        weightChart: [
          { h: 152, w: { 17: 42.5, 18: 44.0, 19: 45.0 } },
          { h: 155, w: { 17: 43.5, 18: 45.3, 19: 47.0 } },
          { h: 157, w: { 17: 45.0, 18: 47.0, 19: 48.0 } },
          { h: 160, w: { 17: 46.0, 18: 48.0, 19: 49.0 } },
          { h: 163, w: { 17: 47.0, 18: 49.0, 19: 51.0 } },
          { h: 165, w: { 17: 49.0, 18: 51.0, 19: 53.0 } },
          { h: 168, w: { 17: 50.0, 18: 52.0, 19: 54.0 } },
          { h: 170, w: { 17: 51.0, 18: 53.5, 19: 55.0 } },
          { h: 173, w: { 17: 52.5, 18: 55.0, 19: 57.0 } },
          { h: 175, w: { 17: 54.5, 18: 57.0, 19: 59.0 } },
          { h: 178, w: { 17: 56.0, 18: 58.5, 19: 61.0 } },
          { h: 180, w: { 17: 58.0, 18: 61.0, 19: 63.0 } },
          { h: 183, w: { 17: 60.0, 18: 63.0, 19: 65.0 } },
        ],
      },
      female: {
        age: { min: 16.5, max: 19.5 },
        minHeight: 152,
        weightChart: [
          { h: 152, w: 42.5 },
          { h: 155, w: 43.5 },
          { h: 157, w: 45.0 },
          { h: 160, w: 46.0 },
          { h: 163, w: 47.0 },
          { h: 165, w: 49.0 },
          { h: 168, w: 50.0 },
        ],
      },
    },
    nda_af: {
      male: {
        age: { min: 16.5, max: 19.5 },
        minHeight: 162.5,
        weightChart: [
          { h: 163, w: { 17: 47.0, 18: 49.0, 19: 51.0 } },
          { h: 165, w: { 17: 49.0, 18: 51.0, 19: 53.0 } },
          { h: 168, w: { 17: 50.0, 18: 52.0, 19: 54.0 } },
          { h: 170, w: { 17: 51.0, 18: 53.5, 19: 55.0 } },
          { h: 173, w: { 17: 52.5, 18: 55.0, 19: 57.0 } },
          { h: 175, w: { 17: 54.5, 18: 57.0, 19: 59.0 } },
          { h: 178, w: { 17: 56.0, 18: 58.5, 19: 61.0 } },
          { h: 180, w: { 17: 58.0, 18: 61.0, 19: 63.0 } },
          { h: 183, w: { 17: 60.0, 18: 63.0, 19: 65.0 } },
        ],
      },
      female: {
        age: { min: 16.5, max: 19.5 },
        minHeight: 152,
        weightChart: [
          { h: 152, w: 42.5 },
          { h: 155, w: 43.5 },
          { h: 157, w: 45.0 },
          { h: 160, w: 46.0 },
          { h: 163, w: 47.0 },
          { h: 165, w: 49.0 },
          { h: 168, w: 50.0 },
        ],
      },
    },
    cds_ima_ina_ota: {
      male: {
        age: { min: 19, max: 25 },
        minHeight: 157.5,
        weightChart: [
          { h: 157, w: { 20: 49, 22: 50, 24: 51 } },
          { h: 160, w: { 20: 50, 22: 51, 24: 52 } },
          { h: 163, w: { 20: 52, 22: 53, 24: 54 } },
          { h: 165, w: { 20: 53, 22: 54, 24: 55 } },
          { h: 168, w: { 20: 55, 22: 56, 24: 57 } },
          { h: 170, w: { 20: 56, 22: 57, 24: 58 } },
          { h: 173, w: { 20: 58, 22: 59, 24: 60 } },
          { h: 175, w: { 20: 59, 22: 61, 24: 62 } },
          { h: 178, w: { 20: 61, 22: 62, 24: 63 } },
          { h: 180, w: { 20: 63, 22: 64, 24: 65 } },
          { h: 183, w: { 20: 65, 22: 66, 24: 67 } },
        ],
      },
      female: {
        age: { min: 19, max: 25 },
        minHeight: 152,
        weightChart: [
          { h: 152, w: 44 },
          { h: 155, w: 45 },
          { h: 157, w: 46 },
          { h: 160, w: 47 },
          { h: 163, w: 49 },
          { h: 165, w: 50 },
          { h: 168, w: 51 },
        ],
      },
    },
    cds_afa: {
      male: {
        age: { min: 20, max: 24 },
        minHeight: 162.5,
        weightChart: [
          { h: 163, w: { 20: 52, 22: 53, 24: 54 } },
          { h: 165, w: { 20: 53, 22: 54, 24: 55 } },
          { h: 168, w: { 20: 55, 22: 56, 24: 57 } },
          { h: 170, w: { 20: 56, 22: 57, 24: 58 } },
          { h: 173, w: { 20: 58, 22: 59, 24: 60 } },
          { h: 175, w: { 20: 59, 22: 61, 24: 62 } },
          { h: 178, w: { 20: 61, 22: 62, 24: 63 } },
          { h: 180, w: { 20: 63, 22: 64, 24: 65 } },
          { h: 183, w: { 20: 65, 22: 66, 24: 67 } },
        ],
      },
      female: {
        age: { min: 20, max: 24 },
        minHeight: 152,
        weightChart: [
          { h: 152, w: 44 },
          { h: 155, w: 45 },
          { h: 157, w: 46 },
          { h: 160, w: 47 },
          { h: 163, w: 49 },
          { h: 165, w: 50 },
          { h: 168, w: 51 },
        ],
      },
    },
  };
  function getVitalsAgeKey(age, entryType) {
    if (entryType.startsWith("nda")) {
      if (age < 17.5) return "17";
      if (age < 18.5) return "18";
      return "19";
    }
    if (entryType.startsWith("cds")) {
      if (age < 22) return "20";
      if (age < 24) return "22";
      return "24";
    }
    return null;
  }
  function getIdealWeight(chart, height, age, entryType) {
    if (!chart || chart.length === 0) return null;
    let lower = chart.filter((p) => p.h <= height).pop() || chart[0];
    let upper =
      chart.filter((p) => p.h >= height)[0] || chart[chart.length - 1];
    if (typeof lower.w === "number") {
      if (lower.h === upper.h) return lower.w;
      const h_diff_simple = upper.h - lower.h;
      if (h_diff_simple === 0) return lower.w;
      const w_diff_simple = upper.w - lower.w;
      return lower.w + ((height - lower.h) / h_diff_simple) * w_diff_simple;
    }
    const ageKey = getVitalsAgeKey(age, entryType);
    if (!ageKey) return null;
    const w_lower = lower.w[ageKey];
    const w_upper = upper.w[ageKey];
    if (lower.h === upper.h) return w_lower;
    const h_diff = upper.h - lower.h;
    if (h_diff === 0) return w_lower;
    const w_diff = w_upper - w_lower;
    const ideal = w_lower + ((height - lower.h) / h_diff) * w_diff;
    return ideal;
  }

  // --- STEP 2: Vision ---
  const colorPlates = [
    {
      src: "img/1.png",
      answer: "12",
    },
    {
      src: "img/2.png",
      answer: "8",
    },
    {
      src: "img/3.png",
      answer: "6",
    },
    {
      src: "img/4.png",
      answer: "29",
    },
    {
      src: "img/5.png",
      answer: "5",
    },
    {
      src: "img/6.png",
      answer: "3",
    },
    {
      src: "img/7.png",
      answer: "15",
    },
    {
      src: "img/8.png",
      answer: "74",
    },
    {
      src: "img/9.png",
      answer: "6",
    },
    {
      src: "img/10.png",
      answer: "57",
    },
    {
      src: "img/11.png",
      answer: "5",
    },
  ];
  const visionStandards = {
    nda: {
      army: { myopia: -2.5, hypermetropia: 2.5 },
      "navy-airforce": { myopia: -0.75, hypermetropia: 1.5 },
    },
    cds: {
      "ima-ota-ina": { myopia: -3.5, hypermetropia: 3.5 },
      afa: { myopia: -0.75, hypermetropia: 1.5 },
    },
  };
  const serviceOptions = {
    nda: [
      { value: "army", text: "Army" },
      { value: "navy-airforce", text: "Navy / Air Force" },
    ],
    cds: [
      { value: "ima-ota-ina", text: "IMA / OTA / INA" },
      { value: "afa", text: "Air Force Academy (AFA)" },
    ],
  };
  const entryTypeSelect = document.getElementById("entry-type");
  const serviceSelectionContainer = document.getElementById(
    "service-selection-container",
  );
  const serviceTypeSelect = document.getElementById("service-type");
  const colorBlindTestGrid = document.getElementById("color-blind-test-grid");
  const colorVisionScoreSpan = document.getElementById("color-vision-score");
  const lasikRadioGroup = document.getElementById("lasik-radio-group");
  const lasikDetailsContainer = document.getElementById("lasik-details");

  function populateColorPlates() {
    colorBlindTestGrid.innerHTML = "";
    colorPlates.forEach((plate) => {
      const plateContainer = document.createElement("div");
      plateContainer.className = "flex flex-col items-center space-y-2";
      const plateDiv = document.createElement("div");
      plateDiv.className = "ishihara-plate";
      plateDiv.style.backgroundImage = `url('${plate.src}')`;
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 2;
      input.className =
        "w-20 text-center rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
      input.dataset.answer = plate.answer;
      input.addEventListener("input", () => {
        if (input.value === plate.answer) {
          plateDiv.classList.add("plate-correct");
          plateDiv.classList.remove("plate-incorrect");
        } else {
          plateDiv.classList.remove("plate-correct");
          if (input.value.length >= String(plate.answer).length) {
            plateDiv.classList.add("plate-incorrect");
          }
        }
        updateColorVisionScore();
      });
      plateContainer.appendChild(plateDiv);
      plateContainer.appendChild(input);
      colorBlindTestGrid.appendChild(plateContainer);
    });
  }
  function updateColorVisionScore() {
    let currentScore = 0;
    const inputs = colorBlindTestGrid.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.value === input.dataset.answer) {
        currentScore++;
      }
    });
    colorVisionScoreSpan.textContent = currentScore;
  }
  function updateServiceOptions() {
    const entry = entryTypeSelect.value;
    if (!entry || !serviceOptions[entry]) {
      serviceSelectionContainer.classList.add("hidden-section");
      return;
    }
    serviceTypeSelect.innerHTML =
      '<option value="" selected disabled>-- Choose a Service --</option>';
    serviceOptions[entry].forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option.value;
      opt.textContent = option.text;
      serviceTypeSelect.appendChild(opt);
    });
    serviceSelectionContainer.classList.remove("hidden-section");
  }
  function toggleLasikDetails() {
    const selected = document.querySelector(
      'input[name="lasik"]:checked',
    ).value;
    if (selected === "yes") {
      lasikDetailsContainer.classList.remove("hidden-section");
    } else {
      lasikDetailsContainer.classList.add("hidden-section");
    }
  }

  entryTypeSelect.addEventListener("change", updateServiceOptions);
  lasikRadioGroup.addEventListener("change", toggleLasikDetails);
  populateColorPlates();

  // --- STEP 3: Hearing ---
  let audioContext;
  window.initAudio = function () {
    try {
      if (!audioContext) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
      }
      document
        .getElementById("hearing-controls")
        .classList.remove("opacity-50", "pointer-events-none");
      document.getElementById("start-test-btn").style.display = "none";
    } catch (e) {
      alert("Web Audio API is not supported in your browser.");
    }
  };
  window.playTone = function (frequency, pan) {
    if (!audioContext) {
      alert('Please click "Start Test" first.');
      return;
    }
    const oscillator = audioContext.createOscillator();
    const panner = audioContext.createStereoPanner();
    const gainNode = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    panner.pan.setValueAtTime(
      pan === "left" ? -1 : 1,
      audioContext.currentTime,
    );
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // --- STEP 4: Medical History ---
  const medicalChecklistData = [
    {
      category: "General Health",
      items: [
        {
          id: "hist-weight",
          value: "Over/Under Weight",
          label: "Overweight / Underweight",
          type: "TR",
          infoId: "weight",
        },
        {
          id: "hist-chest",
          value: "Under Sized Chest",
          label: "Under Sized Chest (Improvable)",
          type: "TR",
          infoId: "chest",
        },
        {
          id: "hist-substance",
          value: "Substance Abuse",
          label: "History of Substance Abuse",
          type: "PR",
          infoId: "substance",
        },
      ],
    },
    {
      category: "Musculoskeletal System",
      items: [
        {
          id: "hist-scoliosis",
          value: "Spinal Deformity",
          label: "Spinal Deformities (Scoliosis >15°)",
          type: "PR",
          infoId: "scoliosis",
        },
        {
          id: "hist-knock",
          value: "Knock Knees",
          label: "Knock Knees (>5cm) or Flat Feet",
          type: "PR",
          infoId: "knockKnees",
        },
        {
          id: "hist-fracture",
          value: "Mal-united Fractures",
          label: "Major Skeletal Deformities",
          type: "PR",
          infoId: "fracture",
        },
      ],
    },
    {
      category: "Eyes & Ears",
      items: [
        {
          id: "hist-color",
          value: "Colour Blindness",
          label: "Colour Blindness (CP-III or worse)",
          type: "PR",
          infoId: "colorBlindness",
        },
        {
          id: "hist-vision",
          value: "Poor Vision",
          label: "Poor Visual Acuity (beyond limits)",
          type: "PR",
          infoId: "vision",
        },
        {
          id: "hist-wax",
          value: "Ear Wax",
          label: "Ear Wax (Obstructing view)",
          type: "TR",
          infoId: "wax",
        },
        {
          id: "hist-hearing",
          value: "Hearing Loss",
          label: "Significant Hearing Loss",
          type: "PR",
          infoId: "hearing",
        },
      ],
    },
    {
      category: "Cardiovascular & Respiratory",
      items: [
        {
          id: "hist-dns",
          value: "DNS",
          label: "Deviated Nasal Septum (DNS)",
          type: "TR",
          infoId: "dns",
        },
        {
          id: "hist-tonsil",
          value: "Tonsillitis",
          label: "Tonsillitis",
          type: "TR",
          infoId: "tonsillitis",
        },
        {
          id: "hist-heart",
          value: "Heart Condition",
          label: "Heart/Blood Vessel Disease",
          type: "PR",
          infoId: "heart",
        },
        {
          id: "hist-asthma",
          value: "Asthma",
          label: "Asthma",
          type: "PR",
          infoId: "asthma",
        },
      ],
    },
    {
      category: "Abdomen & Genito-Urinary",
      items: [
        {
          id: "hist-hydrocele",
          value: "Hydrocele/Phimosis",
          label: "Hydrocele / Phimosis",
          type: "TR",
          infoId: "hydrocele",
        },
        {
          id: "hist-varicocele",
          value: "Varicocele",
          label: "Varicocele",
          type: "TR",
          infoId: "varicocele",
        },
        {
          id: "hist-piles",
          value: "Piles",
          label: "Piles (Haemorrhoids)",
          type: "TR",
          infoId: "piles",
        },
      ],
    },
    {
      category: "Other Conditions",
      items: [
        {
          id: "hist-gynae",
          value: "Gynaecomastia",
          label: "Gynaecomastia",
          type: "TR",
          infoId: "gynaecomastia",
        },
        {
          id: "hist-skin",
          value: "Chronic Skin Disease",
          label: "Chronic Skin Diseases (Eczema)",
          type: "PR",
          infoId: "skin",
        },
        {
          id: "hist-chronic",
          value: "Chronic Disease",
          label: "Chronic Diseases (Diabetes, Epilepsy)",
          type: "PR",
          infoId: "chronic",
        },
        {
          id: "hist-mental",
          value: "Mental Health",
          label: "History of Psychological Disorders",
          type: "PR",
          infoId: "mental",
        },
      ],
    },
  ];
  const diseaseInfo = {
    weight: {
      title: "Overweight / Underweight",
      info: "Candidates must meet specific height-weight standards. Being significantly over or under the acceptable range can impact physical performance and endurance.",
    },
    chest: {
      title: "Under Sized Chest",
      info: "The chest must be well-developed with a minimum expansion of 5 cm. An undersized chest can indicate poor respiratory function.",
    },
    substance: {
      title: "History of Substance Abuse",
      info: "Any history of drug or alcohol abuse is a major disqualifier, raising concerns about reliability and discipline.",
    },
    scoliosis: {
      title: "Spinal Deformities (Scoliosis)",
      info: "Conditions like scoliosis (>15°) can impair the ability to carry heavy loads and perform physical tasks.",
    },
    knockKnees: {
      title: "Knock Knees or Flat Feet",
      info: "Knock knees (>5cm) and severe flat feet affect gait and increase the risk of stress fractures and joint injuries.",
    },
    fracture: {
      title: "Major Skeletal Deformities",
      info: "Mal-united fractures can lead to functional impairment and chronic pain. The skeleton must be structurally sound.",
    },
    colorBlindness: {
      title: "Colour Blindness",
      info: "Severe color blindness (worse than CP-II/III) is a disqualifier as it hinders reading maps, identifying signals, and recognizing camouflage.",
    },
    vision: {
      title: "Poor Visual Acuity",
      info: "Uncorrected vision beyond specified limits is a cause for rejection. Clear vision is essential for battlefield awareness.",
    },
    wax: {
      title: "Ear Wax",
      info: "Significant ear wax that obstructs the view of the eardrum will result in a temporary rejection until removed.",
    },
    hearing: {
      title: "Significant Hearing Loss",
      info: "Good hearing is vital for communication, detecting enemy movements, and understanding commands.",
    },
    dns: {
      title: "Deviated Nasal Septum (DNS)",
      info: "A DNS that causes breathing obstruction is a cause for temporary rejection, as it can impair respiratory function under exertion.",
    },
    tonsillitis: {
      title: "Tonsillitis",
      info: "Chronic or recurring tonsillitis can affect a soldier's availability for duty and may require a tonsillectomy.",
    },
    heart: {
      title: "Heart/Blood Vessel Disease",
      info: "Any evidence of heart disease or abnormal rhythms is a permanent disqualifier due to the high risk of cardiac events under stress.",
    },
    asthma: {
      title: "Asthma",
      info: "A history of bronchial asthma is a permanent disqualifier, as it can be triggered by exercise, dust, or stress.",
    },
    hydrocele: {
      title: "Hydrocele / Phimosis",
      info: "These genital conditions are grounds for temporary rejection pending successful surgical correction.",
    },
    varicocele: {
      title: "Varicocele",
      info: "This condition is often a cause for temporary rejection until it is surgically corrected.",
    },
    piles: {
      title: "Piles (Haemorrhoids)",
      info: "Significant or symptomatic piles are a cause for rejection as the condition can be aggravated by field conditions.",
    },
    gynaecomastia: {
      title: "Gynaecomastia",
      info: "Enlargement of male breast tissue is usually a cause for temporary rejection pending surgical evaluation.",
    },
    skin: {
      title: "Chronic Skin Diseases",
      info: "Chronic conditions like eczema or psoriasis are disqualifying as they can be worsened by field conditions.",
    },
    chronic: {
      title: "Chronic Diseases (Diabetes, Epilepsy)",
      info: "Systemic diseases requiring continuous medication are incompatible with military service.",
    },
    mental: {
      title: "History of Psychological Disorders",
      info: "A history of any psychological disorder is a permanent disqualifier. Mental resilience is critical.",
    },
  };
  function populateMedicalChecklist() {
    const container = document.getElementById("medical-history-checklist");
    container.innerHTML = "";
    medicalChecklistData.forEach((cat) => {
      let itemsHTML = cat.items
        .map((item) => {
          const typeClass =
            item.type === "TR"
              ? "text-yellow-700 bg-yellow-100"
              : "text-red-700 bg-red-100";
          return `<div class="flex items-start"><input id="${item.id}" name="medical_history" type="checkbox" class="h-4 w-4 mt-1 flex-shrink-0" value="${item.value}"><label for="${item.id}" class="ml-2 flex items-center">${item.label} <span class="text-xs font-semibold ${typeClass} px-2 py-0.5 rounded-full ml-1">${item.type}</span><button class="ml-2 info-btn" data-id="${item.infoId}"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500 hover:text-blue-700" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" /></svg></button></label></div>`;
        })
        .join("");
      container.innerHTML += `<div><h3 class="font-semibold text-lg text-gray-700 border-b pb-2 mb-3">${cat.category}</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">${itemsHTML}</div></div>`;
    });
  }
  populateMedicalChecklist();

  // --- MODAL LOGIC ---
  const openModal = (modal) => {
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("visible");
    modal.querySelector(".modal-content").classList.remove("-translate-y-10");
  };
  const closeModal = (modal) => {
    modal.classList.add("opacity-0");
    modal.querySelector(".modal-content").classList.add("-translate-y-10");
    setTimeout(() => {
      modal.classList.add("pointer-events-none");
      modal.classList.remove("visible");
    }, 300);
  };
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".modal-close")) {
        closeModal(modal);
      }
    });
  });
  document
    .getElementById("rejection-info-button")
    .addEventListener("click", () =>
      openModal(document.getElementById("rejection-info-modal")),
    );
  document
    .getElementById("medical-history-checklist")
    .addEventListener("click", (e) => {
      const infoBtn = e.target.closest(".info-btn");
      if (infoBtn) {
        e.preventDefault();
        const data = diseaseInfo[infoBtn.dataset.id];
        if (data) {
          document.getElementById("condition-modal-title").textContent =
            data.title;
          document.getElementById("condition-modal-content").textContent =
            data.info;
          openModal(document.getElementById("condition-info-modal"));
        }
      }
    });

  // --- FINAL RESULTS ---
  function generateFinalResults() {
    const data = JSON.parse(localStorage.getItem("armyMedicalData"));
    const container = document.getElementById("final-results-container");
    if (!data || !data.vitals) {
      container.innerHTML = `<p>Please complete all previous steps to see your summary.</p>`;
      return;
    }

    let resultsHTML = "";
    let overallEligible = true;

    // Vitals
    const { entry, gender, age, height, weight } = data.vitals;
    const criteria = vitalsStandards[entry]
      ? vitalsStandards[entry][gender]
      : undefined;
    let vitalsMessages = [];
    if (criteria) {
      if (age >= criteria.age.min && age <= criteria.age.max)
        vitalsMessages.push({
          pass: true,
          text: `Age ${age} is within the required ${criteria.age.min}-${criteria.age.max} range.`,
        });
      else {
        vitalsMessages.push({
          pass: false,
          text: `Age is outside the required ${criteria.age.min}-${criteria.age.max} range.`,
        });
        overallEligible = false;
      }
      if (height >= criteria.minHeight)
        vitalsMessages.push({
          pass: true,
          text: `Height ${height}cm meets the minimum of ${criteria.minHeight}cm.`,
        });
      else {
        vitalsMessages.push({
          pass: false,
          text: `Height does not meet the minimum of ${criteria.minHeight}cm.`,
        });
        overallEligible = false;
      }
      const idealWeight = getIdealWeight(
        criteria.weightChart,
        height,
        age,
        entry,
      );
      if (idealWeight !== null) {
        const minW = idealWeight * 0.9,
          maxW = idealWeight * 1.1;
        if (weight >= minW && weight <= maxW)
          vitalsMessages.push({
            pass: true,
            text: `Weight ${weight}kg is in the acceptable range (${minW.toFixed(1)}-${maxW.toFixed(1)}kg).`,
          });
        else {
          vitalsMessages.push({
            pass: false,
            text: `Weight is outside the acceptable range (${minW.toFixed(1)}-${maxW.toFixed(1)}kg).`,
          });
          overallEligible = false;
        }
      }
    } else {
      vitalsMessages.push({
        pass: false,
        text: "Vitals criteria not found for selected entry.",
      });
      overallEligible = false;
    }
    resultsHTML += `<div><h3 class="text-xl font-semibold mb-2">Vitals</h3><ul class="list-none space-y-2">${vitalsMessages.map((m) => `<li class="flex items-center">${m.pass ? checkIcon : crossIcon}${m.text}</li>`).join("")}</ul></div>`;

    // Vision
    if (data.vision) {
      const {
        entryType,
        serviceType,
        myopia,
        hypermetropia,
        colorVisionScore,
        hadLasik,
        lasikAge,
        lasikDuration,
      } = data.vision;
      const visionCrit = visionStandards[entryType][serviceType];
      let visionMessages = [];
      if (
        myopia < visionCrit.myopia ||
        hypermetropia > visionCrit.hypermetropia
      ) {
        visionMessages.push({
          pass: false,
          text: `Refractive error exceeds limits for ${serviceType.toUpperCase()}.`,
        });
        overallEligible = false;
      } else {
        visionMessages.push({
          pass: true,
          text: `Refractive error is within limits.`,
        });
      }
      if (colorVisionScore < 9) {
        visionMessages.push({
          pass: false,
          text: `Color perception score of ${colorVisionScore}/11 may not meet CP-II standard.`,
        });
        overallEligible = false;
      } else {
        visionMessages.push({
          pass: true,
          text: `Color perception score is satisfactory.`,
        });
      }
      if (hadLasik === "yes" && (lasikAge < 20 || lasikDuration < 12)) {
        visionMessages.push({
          pass: false,
          text: `Corrective surgery conditions are not met.`,
        });
        overallEligible = false;
      } else {
        visionMessages.push({
          pass: true,
          text: `Corrective surgery status is acceptable.`,
        });
      }
      resultsHTML += `<div class="border-t pt-4 mt-4"><h3 class="text-xl font-semibold mb-2">Vision</h3><ul class="list-none space-y-2">${visionMessages.map((m) => `<li class="flex items-center">${m.pass ? checkIcon : crossIcon}${m.text}</li>`).join("")}</ul></div>`;
    }

    // Hearing
    if (data.hearing) {
      const heardAll = Object.values(data.hearing).every((v) => v === true);
      resultsHTML += `<div class="border-t pt-4 mt-4"><h3 class="text-xl font-semibold mb-2">Hearing</h3><p class="flex items-center">${heardAll ? checkIcon : crossIcon}${heardAll ? "Passed the basic hearing self-assessment." : "Did not hear all frequencies. An official test is required."}</p></div>`;
      if (!heardAll) overallEligible = false;
    }

    // Medical History
    if (data.medicalHistory && data.medicalHistory.length > 0) {
      const prConditions = data.medicalHistory.filter((c) =>
        medicalChecklistData
          .flatMap((cat) => cat.items)
          .find((item) => item.value === c && item.type === "PR"),
      );
      resultsHTML += `<div class="border-t pt-4 mt-4"><h3 class="text-xl font-semibold mb-2">Medical History</h3>`;
      if (prConditions.length > 0) {
        resultsHTML += `<p class="flex items-center">${crossIcon}You have selected conditions that are often grounds for <strong>Permanent Rejection (PR)</strong>: ${prConditions.join(", ")}.</p>`;
        overallEligible = false;
      } else {
        resultsHTML += `<p class="flex items-center">${infoIcon}You have selected conditions that may be grounds for <strong>Temporary Rejection (TR)</strong>. These are often curable. Selected: ${data.medicalHistory.join(", ")}.</p>`;
      }
      resultsHTML += `</div>`;
    } else {
      resultsHTML += `<div class="border-t pt-4 mt-4"><h3 class="text-xl font-semibold mb-2">Medical History</h3><p class="flex items-center">${checkIcon}No disqualifying medical history items selected.</p></div>`;
    }

    // Final Verdict
    resultsHTML += `<div class="mt-6 p-4 text-white text-center font-bold rounded-lg text-lg ${overallEligible ? "bg-green-600" : "bg-red-600"}">Overall Status: ${overallEligible ? "Likely Eligible" : "Potentially Ineligible"}</div>`;
    container.innerHTML = resultsHTML;
  }

  // --- INITIALIZATION ---
  updateUI();
});

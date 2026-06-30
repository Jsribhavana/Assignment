document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Header & Scroll Effects
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. Mobile Navigation Toggle
  // ==========================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileNavToggle.classList.toggle('active');
    });

    // Close menu when clicking links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileNavToggle.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3. Theme Toggle (Light / Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved user preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // ==========================================
  // 4. Practical Methods Tabs
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Deactivate all buttons & panels
      tabButtons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // Activate current button & its corresponding panel
      const targetPanelId = btn.getAttribute('aria-controls');
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // ==========================================
  // 5. Eco-Footprint Calculator (Quiz)
  // ==========================================
  const steps = document.querySelectorAll('.calc-quiz-step');
  const resultView = document.getElementById('quiz-result-view');
  
  // Track selected values
  let quizSelections = {
    commute: null,
    diet: null,
    waste: null
  };

  // Helper to enable/disable step footer buttons
  function evaluateStepState(stepElement) {
    const nextBtn = stepElement.querySelector('.next-step-btn');
    const radios = stepElement.querySelectorAll('input[type="radio"]');
    let chosen = false;

    radios.forEach(radio => {
      if (radio.checked) {
        chosen = true;
        // visual selected styling
        radio.closest('.calc-option').classList.add('selected');
      } else {
        radio.closest('.calc-option').classList.remove('selected');
      }
    });

    if (nextBtn) {
      nextBtn.disabled = !chosen;
    }
  }

  // Setup options selection listeners
  steps.forEach(step => {
    const options = step.querySelectorAll('.calc-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          const category = radio.name;
          quizSelections[category] = radio.value;
          evaluateStepState(step);
        }
      });
    });

    // Check step initial state
    evaluateStepState(step);
  });

  // Step navigation listeners
  const nextBtns = document.querySelectorAll('.next-step-btn');
  const prevBtns = document.querySelectorAll('.prev-step-btn');

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.calc-quiz-step');
      const stepNum = parseInt(currentStep.getAttribute('data-step'));
      
      if (stepNum < 3) {
        currentStep.classList.remove('active');
        const nextStep = document.getElementById(`quiz-step-${stepNum + 1}`);
        nextStep.classList.add('active');
        evaluateStepState(nextStep);
      } else if (btn.id === 'quiz-submit-btn') {
        // We are on step 3 and user wants to submit
        calculateFootprint();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = btn.closest('.calc-quiz-step');
      const stepNum = parseInt(currentStep.getAttribute('data-step'));
      
      currentStep.classList.remove('active');
      const prevStep = document.getElementById(`quiz-step-${stepNum - 1}`);
      prevStep.classList.add('active');
      evaluateStepState(prevStep);
    });
  });

  // Calculation Logic
  function calculateFootprint() {
    // Emissions weights in Tons CO2e/year
    const commuteWeights = { low: 0.2, medium: 1.8, high: 4.6 };
    const dietWeights = { low: 0.9, medium: 1.7, high: 3.0 };
    const wasteWeights = { low: 0.1, medium: 0.6, high: 1.2 };

    const wCommute = commuteWeights[quizSelections.commute] || 0;
    const wDiet = dietWeights[quizSelections.diet] || 0;
    const wWaste = wasteWeights[quizSelections.waste] || 0;

    const totalEmissions = (wCommute + wDiet + wWaste).toFixed(1);
    
    // Hide final question step
    document.getElementById('quiz-step-3').classList.remove('active');
    
    // Set values in results UI
    const scoreVal = document.getElementById('carbon-score-val');
    const feedbackTitle = document.getElementById('carbon-feedback-title');
    const feedbackDesc = document.getElementById('carbon-feedback-desc');

    scoreVal.innerText = totalEmissions;
    
    // Set feedback descriptions based on total emissions
    if (totalEmissions < 2.5) {
      feedbackTitle.innerHTML = 'Eco Champion! 🌟';
      feedbackDesc.innerText = 'Exceptional job! Your footprint is extremely low and sets a fantastic benchmark. Keep driving local practices and inspiring neighbors.';
    } else if (totalEmissions <= 5.5) {
      feedbackTitle.innerHTML = 'Moderate Balance 🌿';
      feedbackDesc.innerText = 'You are on the right track! Your carbon output matches sustainable averages. Take a look at water recovery or active travel details to optimize further.';
    } else {
      feedbackTitle.innerHTML = 'High Carbon Weight ⚠️';
      feedbackDesc.innerText = 'Your current lifestyle contributes significantly to carbon loads. Transitioning to composting, active transit, or smart energy tools can rapidly trim your weight.';
    }

    resultView.classList.add('active');
  }

  // Reset Quiz
  const quizResetBtn = document.getElementById('quiz-reset-btn');
  if (quizResetBtn) {
    quizResetBtn.addEventListener('click', () => {
      // Clear radio selections
      const radios = document.querySelectorAll('#carbon-quiz input[type="radio"]');
      radios.forEach(radio => {
        radio.checked = false;
      });

      // Clear selections data
      quizSelections = { commute: null, diet: null, waste: null };

      // Hide results
      resultView.classList.remove('active');

      // Go back to step 1
      const step1 = document.getElementById('quiz-step-1');
      step1.classList.add('active');
      evaluateStepState(step1);
    });
  }

  // ==========================================
  // 6. Pledge Form Validation & Certificate Generation
  // ==========================================
  const pledgeForm = document.getElementById('pledge-form');
  const nameInput = document.getElementById('pledge-name');
  const emailInput = document.getElementById('pledge-email');
  const pledgeTypeSelect = document.getElementById('pledge-type');
  const customCommitment = document.getElementById('pledge-text');
  const agreeCheck = document.getElementById('pledge-agree');

  // Error divs
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const agreeError = document.getElementById('agree-error');

  // Real-time input styling & error removal
  function clearErrors() {
    nameError.style.display = 'none';
    emailError.style.display = 'none';
    agreeError.style.display = 'none';
    nameInput.style.borderColor = '';
    emailInput.style.borderColor = '';
  }

  pledgeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Validate Name
    if (nameInput.value.trim() === '') {
      nameError.style.display = 'block';
      nameInput.style.borderColor = 'hsl(0 84% 60%)';
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailError.style.display = 'block';
      emailInput.style.borderColor = 'hsl(0 84% 60%)';
      isValid = false;
    }

    // Validate Checkbox
    if (!agreeCheck.checked) {
      agreeError.style.display = 'block';
      isValid = false;
    }

    if (isValid) {
      generateCertificate(nameInput.value.trim(), pledgeTypeSelect.value, customCommitment.value.trim());
    }
  });

  // Certificate Modal Handling
  const certModal = document.getElementById('certificate-modal');
  const certCloseBtn = document.getElementById('cert-close-btn');

  function generateCertificate(name, pledgeType, customPledgeText) {
    const certUserName = document.getElementById('cert-user-name');
    const certUserPledge = document.getElementById('cert-user-pledge');
    const certCustomText = document.getElementById('cert-custom-text');
    const certDate = document.getElementById('cert-date');

    // Populate data
    certUserName.innerText = name;
    certUserPledge.innerText = pledgeType;
    
    if (customPledgeText !== '') {
      certCustomText.innerText = `"${customPledgeText}"`;
      certCustomText.style.display = 'block';
    } else {
      certCustomText.style.display = 'none';
    }

    // Set today's date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const todayStr = new Date().toLocaleDateString('en-US', options);
    certDate.innerText = todayStr;

    // Show modal
    certModal.classList.add('active');

    // Reset Form
    pledgeForm.reset();
  }

  // Close Certificate Modal
  if (certCloseBtn && certModal) {
    certCloseBtn.addEventListener('click', () => {
      certModal.classList.remove('active');
    });

    // Close when clicking backdrop
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('active');
      }
    });
  }
});

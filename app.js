/**
 * DON'T MEASURE YOUR WORTH IN LIKES
 * Interactive Mobile Web Application Logic
 * Neo-Brutalism meets Cozy Sketchbook Aesthetic
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. AUDIO SYSTEM (Synthesized via Web Audio API - Zero External Asset Deps)
     ========================================================================== */
  class SoundController {
    constructor() {
      this.enabled = localStorage.getItem('worth_sound_enabled') !== 'false';
      this.ctx = null;
      this.initContext();
    }

    initContext() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio not supported');
      }
    }

    ensureContext() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('worth_sound_enabled', this.enabled);
      return this.enabled;
    }

    playPop() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      } catch (err) {}
    }

    playCheck() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.12); // G5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.26);
      } catch (err) {}
    }

    playFanfare() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + (idx * 0.09);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.2, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.36);
        });
      } catch (err) {}
    }
  }

  const sound = new SoundController();

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = soundToggleBtn.querySelector('.btn-text');

  function updateSoundUI() {
    if (sound.enabled) {
      soundIcon.textContent = '🔊';
      soundText.textContent = 'Audio On';
      soundToggleBtn.classList.remove('active');
    } else {
      soundIcon.textContent = '🔇';
      soundText.textContent = 'Muted';
      soundToggleBtn.classList.add('active');
    }
  }
  updateSoundUI();

  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = sound.toggle();
    updateSoundUI();
    if (isEnabled) sound.playPop();
  });


  /* ==========================================================================
     2. GRAYSCALE MODE SIMULATOR (Dopamine Blocker Demo)
     ========================================================================== */
  const grayscaleToggleBtn = document.getElementById('grayscale-toggle');
  const tipGrayscaleTrigger = document.getElementById('tip-grayscale-trigger');

  function toggleGrayscale() {
    document.body.classList.toggle('grayscale-mode');
    const isGray = document.body.classList.contains('grayscale-mode');
    sound.playPop();
    if (isGray) {
      grayscaleToggleBtn.classList.add('active');
      grayscaleToggleBtn.querySelector('.btn-text').textContent = 'Color Mode';
    } else {
      grayscaleToggleBtn.classList.remove('active');
      grayscaleToggleBtn.querySelector('.btn-text').textContent = 'Try Grayscale';
    }
  }

  if (grayscaleToggleBtn) grayscaleToggleBtn.addEventListener('click', toggleGrayscale);
  if (tipGrayscaleTrigger) tipGrayscaleTrigger.addEventListener('click', toggleGrayscale);


  /* ==========================================================================
     3. 60-SECOND DIGITAL WELL-BEING QUIZ
     ========================================================================== */
  const quizWrapper = document.getElementById('quiz-questions-wrapper');
  const questionSlides = document.querySelectorAll('.quiz-question-slide');
  const stepDots = document.querySelectorAll('.step-dot');
  const stepIndicator = document.getElementById('quiz-step-indicator');
  const resultContainer = document.getElementById('quiz-result-container');
  const resultBadge = document.getElementById('result-badge');
  const resultEmoji = document.getElementById('result-emoji');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-description');
  const scoreNumber = document.getElementById('score-number');
  const retakeBtn = document.getElementById('btn-retake-quiz');
  const jumpChallengeBtn = document.getElementById('btn-jump-challenge');

  let currentQuestion = 1;
  let totalScore = 0;
  const userAnswers = [];

  // Handle Option Clicks
  const optionButtons = document.querySelectorAll('.quiz-option-btn');
  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop();
      const val = parseInt(btn.getAttribute('data-value'), 10) || 1;
      userAnswers.push(val);
      totalScore += val;

      if (currentQuestion < questionSlides.length) {
        goToQuestion(currentQuestion + 1);
      } else {
        showQuizResults();
      }
    });
  });

  function goToQuestion(nextStep) {
    questionSlides.forEach(slide => slide.classList.remove('active'));
    stepDots.forEach(dot => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      dot.classList.remove('active');
      if (step < nextStep) {
        dot.classList.add('completed');
      } else if (step === nextStep) {
        dot.classList.add('active');
      }
    });

    const nextSlide = document.querySelector(`.quiz-question-slide[data-index="${nextStep}"]`);
    if (nextSlide) {
      nextSlide.classList.add('active');
    }

    currentQuestion = nextStep;
    stepIndicator.textContent = `Question ${currentQuestion} of 4`;
  }

  function showQuizResults() {
    quizWrapper.style.display = 'none';
    resultContainer.style.display = 'block';
    stepIndicator.textContent = 'Checkup Complete ✨';
    scoreNumber.textContent = `${totalScore} / 12`;

    // Calculate Persona Result
    if (totalScore <= 6) {
      // 4 to 6: Real-Life Champion
      resultBadge.textContent = '🌿 REAL-LIFE CHAMPION';
      resultBadge.style.backgroundColor = 'var(--mint-green)';
      resultEmoji.textContent = '🏆';
      resultTitle.textContent = 'You have Healthy Digital Boundaries!';
      resultDesc.textContent = "Incredible work! You treat your smartphone as an occasional tool rather than a validation metric. You live in the moment with friends, savor real life unfiltered, and don't let algorithms tell you what you're worth.";
    } else if (totalScore <= 9) {
      // 7 to 9: Mindful Scroller
      resultBadge.textContent = '⚖️ MINDFUL SCROLLER';
      resultBadge.style.backgroundColor = 'var(--highlighter-yellow)';
      resultEmoji.textContent = '📱';
      resultTitle.textContent = 'You are Balancing the Noise, but Watch Out!';
      resultDesc.textContent = "You have solid awareness, but social media comparisons and habitual checking still sneak into your day. Taking a deliberate phone-free meal and unfollowing high-stress accounts will give you an instant mental recharge.";
    } else {
      // 10 to 12: The Comparison Trap
      resultBadge.textContent = '❤️‍🩹 THE COMPARISON TRAP';
      resultBadge.style.backgroundColor = 'var(--bubblegum-pink)';
      resultBadge.style.color = '#FFFFFF';
      resultEmoji.textContent = '🫂';
      resultTitle.textContent = "You're Feeling Burned Out by the Algorithm";
      resultDesc.textContent = "You are not alone—nearly 70% of Gen Z students report feeling anxious or exhausted after scrolling feeds of curated highlight reels. Your worth is NOT your like count. It's time for a gentle 7-day reset.";
    }

    sound.playFanfare();
    if (window.confetti) {
      window.confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    // Save quiz completed state
    localStorage.setItem('worth_quiz_completed', 'true');
    localStorage.setItem('worth_quiz_score', totalScore);
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      sound.playPop();
      currentQuestion = 1;
      totalScore = 0;
      userAnswers.length = 0;
      stepDots.forEach(dot => {
        dot.classList.remove('completed', 'active');
        if (dot.getAttribute('data-step') === '1') dot.classList.add('active');
      });
      resultContainer.style.display = 'none';
      quizWrapper.style.display = 'block';
      goToQuestion(1);
    });
  }

  if (jumpChallengeBtn) {
    jumpChallengeBtn.addEventListener('click', () => {
      sound.playPop();
      const target = document.getElementById('section-challenge');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  /* ==========================================================================
     4. 7-DAY SOCIAL MEDIA RESET CHALLENGE (with localStorage persistence)
     ========================================================================== */
  const taskCheckboxes = document.querySelectorAll('.task-checkbox');
  const completedCountEl = document.getElementById('completed-count');
  const completedPctEl = document.getElementById('completed-pct');
  const progressFillEl = document.getElementById('challenge-progress-fill');
  const progressCheerEl = document.getElementById('progress-cheer');
  const resetChecklistBtn = document.getElementById('btn-reset-checklist');

  const cheers = [
    "Pick your first habit below to kick off your reset!",
    "Great first step! Small shifts build massive peace.",
    "2 down! You're making real space for yourself.",
    "Almost halfway! Real life is already feeling brighter.",
    "More than half done! Look at that focus.",
    "5 habits checked! You are reclaiming your daily presence.",
    "Just 1 habit left! You're an inspiration.",
    "🎉 All 7 Habits Done! You are 100% in charge of your life!"
  ];

  function loadChecklistState() {
    try {
      const saved = JSON.parse(localStorage.getItem('worth_challenge_state') || '[]');
      taskCheckboxes.forEach((cb, idx) => {
        const isChecked = !!saved[idx];
        cb.checked = isChecked;
        const parentCard = cb.closest('.check-item-card');
        if (parentCard) {
          if (isChecked) parentCard.classList.add('completed');
          else parentCard.classList.remove('completed');
        }
      });
      updateChecklistProgress(false);
    } catch (e) {
      updateChecklistProgress(false);
    }
  }

  function saveChecklistState() {
    const states = Array.from(taskCheckboxes).map(cb => cb.checked);
    localStorage.setItem('worth_challenge_state', JSON.stringify(states));
  }

  function updateChecklistProgress(triggerCelebrate = true) {
    const total = taskCheckboxes.length;
    let completed = 0;
    taskCheckboxes.forEach(cb => {
      if (cb.checked) completed++;
    });

    const pct = Math.round((completed / total) * 100);
    completedCountEl.textContent = completed;
    completedPctEl.textContent = `${pct}%`;
    progressFillEl.style.width = `${pct}%`;
    progressCheerEl.textContent = cheers[completed] || cheers[0];

    if (completed === total && triggerCelebrate) {
      sound.playFanfare();
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#FF6B9D', '#FFE66D', '#A8E6CF', '#A2D2FF', '#DCD3FF']
        });
      }
    }
  }

  taskCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const parentCard = cb.closest('.check-item-card');
      if (cb.checked) {
        parentCard.classList.add('completed');
        sound.playCheck();
      } else {
        parentCard.classList.remove('completed');
        sound.playPop();
      }
      saveChecklistState();
      updateChecklistProgress(true);
    });
  });

  if (resetChecklistBtn) {
    resetChecklistBtn.addEventListener('click', () => {
      if (confirm('Start fresh for a new week? Reset your 7 habits?')) {
        taskCheckboxes.forEach(cb => {
          cb.checked = false;
          const parentCard = cb.closest('.check-item-card');
          if (parentCard) parentCard.classList.remove('completed');
        });
        saveChecklistState();
        updateChecklistProgress(false);
        sound.playPop();
      }
    });
  }

  loadChecklistState();


  /* ==========================================================================
     5. DAILY MOOD LOG / REFLECTION
     ========================================================================== */
  const moodButtons = document.querySelectorAll('.mood-btn');
  const moodFeedback = document.getElementById('mood-feedback');

  const moodResponses = {
    '1': "Sending kindness your way. Unplugging when stressed takes courage—rest your eyes and take 3 deep breaths.",
    '2': "It's normal to feel fidgety when you put the phone down. Try a warm drink or short walk outside.",
    '3': "Neutral is healthy! You're creating calm, quiet headspace without endless notification buzzes.",
    '4': "Wonderful! Feeling grounded is the real superpower in a hyper-connected world.",
    '5': "✨ High vibration! You're fully present in your real life—cherish this feeling!"
  };

  function loadSavedMood() {
    const savedMood = localStorage.getItem('worth_daily_mood');
    if (savedMood) {
      moodButtons.forEach(btn => {
        if (btn.getAttribute('data-mood') === savedMood) {
          btn.classList.add('selected');
        }
      });
      if (moodResponses[savedMood]) {
        moodFeedback.textContent = moodResponses[savedMood];
        moodFeedback.style.display = 'block';
      }
    }
  }

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sound.playPop();
      moodButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const moodVal = btn.getAttribute('data-mood');
      localStorage.setItem('worth_daily_mood', moodVal);
      if (moodResponses[moodVal]) {
        moodFeedback.textContent = moodResponses[moodVal];
        moodFeedback.style.display = 'block';
      }
    });
  });

  loadSavedMood();


  /* ==========================================================================
     6. THE LIVE "DIGITAL PLEDGE" WALL
     ========================================================================== */
  const pledgeForm = document.getElementById('pledge-form');
  const pledgerNameInput = document.getElementById('pledger-name');
  const pledgerHobbyInput = document.getElementById('pledger-hobby');
  const pledgeCounterNumber = document.getElementById('pledge-counter-number');
  const pledgeSuccessBox = document.getElementById('pledge-signed-success');
  const signedUserTitle = document.getElementById('signed-user-title');
  const signedUserQuote = document.getElementById('signed-user-quote');
  const signedDate = document.getElementById('signed-date');
  const userPinnedPledge = document.getElementById('user-pinned-pledge');
  const userPinnedText = document.getElementById('user-pinned-text');
  const btnSharePledge = document.getElementById('btn-share-pledge');
  const btnSaveBadge = document.getElementById('btn-save-badge');

  const BASE_PLEDGE_COUNT = 4832;

  function loadPledgeState() {
    const hasPledged = localStorage.getItem('worth_has_pledged') === 'true';
    const savedName = localStorage.getItem('worth_pledge_name') || '';
    const savedHobby = localStorage.getItem('worth_pledge_hobby') || '';
    const pledgeCount = parseInt(localStorage.getItem('worth_pledge_count') || BASE_PLEDGE_COUNT, 10);

    pledgeCounterNumber.textContent = pledgeCount.toLocaleString();

    if (hasPledged && savedName) {
      pledgeForm.style.display = 'none';
      pledgeSuccessBox.style.display = 'block';
      signedUserTitle.textContent = `${savedName}'s Digital Freedom Badge`;
      signedUserQuote.textContent = savedHobby ? `Favorite offline moment: "${savedHobby}"` : `"I choose real conversations over likes!"`;
      signedDate.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Show pinned pill
      userPinnedPledge.style.display = 'flex';
      userPinnedText.innerHTML = `<strong>${savedName}</strong>: ${savedHobby || 'Pledged to live more and compare less!'}`;
    }
  }

  if (pledgeForm) {
    pledgeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = pledgerNameInput.value.trim();
      const hobby = pledgerHobbyInput.value.trim();
      if (!name) return;

      sound.playFanfare();

      // Confetti Hearts Animation
      if (window.confetti) {
        window.confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF6B9D', '#FFE66D', '#A8E6CF']
        });
      }

      const currentCount = parseInt(localStorage.getItem('worth_pledge_count') || BASE_PLEDGE_COUNT, 10) + 1;
      localStorage.setItem('worth_has_pledged', 'true');
      localStorage.setItem('worth_pledge_name', name);
      localStorage.setItem('worth_pledge_hobby', hobby);
      localStorage.setItem('worth_pledge_count', currentCount);

      // Animate Counter
      pledgeCounterNumber.textContent = currentCount.toLocaleString();

      // Update Badge & UI
      pledgeForm.style.display = 'none';
      pledgeSuccessBox.style.display = 'block';
      signedUserTitle.textContent = `${name}'s Digital Freedom Badge`;
      signedUserQuote.textContent = hobby ? `Favorite offline moment: "${hobby}"` : `"I choose real conversations over likes!"`;
      signedDate.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      // Add to live wall
      userPinnedPledge.style.display = 'flex';
      userPinnedText.innerHTML = `<strong>${name}</strong>: ${hobby || 'Pledged to live more and compare less!'}`;
    });
  }

  // Share / Copy Link
  if (btnSharePledge) {
    btnSharePledge.addEventListener('click', () => {
      sound.playPop();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        btnSharePledge.textContent = '✅ Link Copied!';
        setTimeout(() => {
          btnSharePledge.textContent = '📋 Copy Pledge Link';
        }, 2200);
      }
    });
  }

  // Save Badge
  if (btnSaveBadge) {
    btnSaveBadge.addEventListener('click', () => {
      sound.playPop();
      alert("✨ You've signed the pledge! Screenshot this badge or share the link with campus friends to inspire them.");
    });
  }

  loadPledgeState();


  /* ==========================================================================
     7. BENTO BOX MODALS & INTERACTIVE TOOLS
     ========================================================================== */
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  const closeButtons = document.querySelectorAll('[data-close]');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      sound.playPop();
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      sound.playPop();
      document.body.style.overflow = '';
      if (modalId === 'modal-mindfulness') {
        stopBreathingPacer();
      }
    }
  }

  // Modal Triggers
  document.getElementById('bento-tips')?.addEventListener('click', () => openModal('modal-tips'));
  document.getElementById('bento-tracker')?.addEventListener('click', () => openModal('modal-tracker'));
  document.getElementById('bento-mindfulness')?.addEventListener('click', () => {
    openModal('modal-mindfulness');
    startBreathingPacer();
  });
  document.getElementById('bento-resources')?.addEventListener('click', () => openModal('modal-resources'));

  // Printable Tracker Triggers
  const openPrintableModal = () => openModal('modal-printable');
  document.getElementById('btn-download-tracker')?.addEventListener('click', openPrintableModal);
  document.getElementById('btn-print-from-modal')?.addEventListener('click', () => {
    closeModal('modal-tracker');
    openModal('modal-printable');
  });

  // Print Action
  document.getElementById('btn-trigger-print')?.addEventListener('click', () => {
    window.print();
  });

  // Close Handlers
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-close');
      closeModal(targetId);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal.id);
        }
      });
    }
  });


  /* ==========================================================================
     8. TOOL: SCREEN TIME REALITY CALCULATOR
     ========================================================================== */
  const screenSlider = document.getElementById('screentime-slider');
  const sliderHoursVal = document.getElementById('slider-hours-val');
  const calcDaysYear = document.getElementById('calc-days-year');
  const calcDecadeYears = document.getElementById('calc-decade-years');
  const booksCount = document.getElementById('books-count');
  const hoursSkills = document.getElementById('hours-skills');
  const conversationsCount = document.getElementById('conversations-count');

  function calculateScreenImpact(hours) {
    sliderHoursVal.textContent = hours.toFixed(1);

    // Days per year (hours * 365 / 24)
    const daysPerYear = (hours * 365) / 24;
    calcDaysYear.textContent = `${daysPerYear.toFixed(1)} Days`;

    // 10 years of waking days
    const yearsInDecade = (daysPerYear * 10) / 365;
    calcDecadeYears.textContent = `${yearsInDecade.toFixed(1)} Full Years`;

    // Equivalent activities (assuming 6 hrs per book)
    const annualTotalHours = hours * 365;
    const books = Math.floor(annualTotalHours / 18);
    const chats = Math.floor(annualTotalHours / 3);

    booksCount.textContent = books;
    hoursSkills.textContent = Math.round(annualTotalHours).toLocaleString();
    conversationsCount.textContent = chats;
  }

  if (screenSlider) {
    screenSlider.addEventListener('input', (e) => {
      calculateScreenImpact(parseFloat(e.target.value));
    });
    calculateScreenImpact(parseFloat(screenSlider.value));
  }


  /* ==========================================================================
     9. TOOL: BOX BREATHING PACER & MINDFULNESS TABS
     ========================================================================== */
  const tabBreathing = document.getElementById('tab-btn-breathing');
  const tabGrounding = document.getElementById('tab-btn-grounding');
  const toolBreathingPanel = document.getElementById('tool-box-breathing');
  const toolGroundingPanel = document.getElementById('tool-grounding');

  const breathingCircle = document.getElementById('breathing-circle');
  const breathActionText = document.getElementById('breath-action-text');
  const breathTimerCount = document.getElementById('breath-timer-count');
  const btnToggleBreathing = document.getElementById('btn-toggle-breathing');
  const breathBtnLabel = document.getElementById('breath-btn-label');

  if (tabBreathing && tabGrounding) {
    tabBreathing.addEventListener('click', () => {
      sound.playPop();
      tabBreathing.classList.add('active');
      tabGrounding.classList.remove('active');
      toolBreathingPanel.style.display = 'block';
      toolGroundingPanel.style.display = 'none';
      startBreathingPacer();
    });

    tabGrounding.addEventListener('click', () => {
      sound.playPop();
      tabGrounding.classList.add('active');
      tabBreathing.classList.remove('active');
      toolBreathingPanel.style.display = 'none';
      toolGroundingPanel.style.display = 'block';
      stopBreathingPacer();
    });
  }

  let breathingInterval = null;
  let breathPhaseIndex = 0;
  let phaseSecondsRemaining = 4;
  let isBreathingActive = false;

  const phases = [
    { text: 'Inhale (4s)', class: 'expand' },
    { text: 'Hold Breath (4s)', class: 'expand' },
    { text: 'Slowly Exhale (4s)', class: 'contract' },
    { text: 'Hold Empty (4s)', class: 'contract' }
  ];

  function startBreathingPacer() {
    if (isBreathingActive) return;
    isBreathingActive = true;
    breathBtnLabel.textContent = '⏸️ Pause Exercise';

    updateBreathingPhase();
    breathingInterval = setInterval(() => {
      phaseSecondsRemaining--;
      if (phaseSecondsRemaining <= 0) {
        breathPhaseIndex = (breathPhaseIndex + 1) % phases.length;
        phaseSecondsRemaining = 4;
        updateBreathingPhase();
      } else {
        breathTimerCount.textContent = phaseSecondsRemaining;
      }
    }, 1000);
  }

  function updateBreathingPhase() {
    const phase = phases[breathPhaseIndex];
    breathActionText.textContent = phase.text;
    breathTimerCount.textContent = phaseSecondsRemaining;

    breathingCircle.classList.remove('expand', 'contract');
    breathingCircle.classList.add(phase.class);
  }

  function stopBreathingPacer() {
    if (breathingInterval) {
      clearInterval(breathingInterval);
      breathingInterval = null;
    }
    isBreathingActive = false;
    breathBtnLabel.textContent = '▶️ Resume Exercise';
  }

  if (btnToggleBreathing) {
    btnToggleBreathing.addEventListener('click', () => {
      sound.playPop();
      if (isBreathingActive) {
        stopBreathingPacer();
      } else {
        startBreathingPacer();
      }
    });
  }


  /* ==========================================================================
     10. STICKY BOTTOM NAVIGATION & SCROLL TRACKING
     ========================================================================== */
  const navItems = document.querySelectorAll('.bottom-nav-bar .nav-item');
  const sections = [
    document.getElementById('section-home'),
    document.getElementById('section-challenge'),
    document.getElementById('section-pledge'),
    document.getElementById('section-kit')
  ];

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      sound.playPop();
      const targetId = item.getAttribute('data-target');
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // IntersectionObserver for active tab highlights
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          if (item.getAttribute('data-target') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    if (sec) observer.observe(sec);
  });


  /* ==========================================================================
     11. FOOTER: RESET ALL LOCAL DATA (For Testing / Fresh Starts)
     ========================================================================== */
  const restartAllBtn = document.getElementById('footer-restart-all');
  if (restartAllBtn) {
    restartAllBtn.addEventListener('click', () => {
      if (confirm('Clear all locally saved progress (quiz, challenge checkmarks, pledge, and moods)?')) {
        localStorage.clear();
        sound.playPop();
        window.location.reload();
      }
    });
  }

});

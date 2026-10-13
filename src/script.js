/* ---- Step set-up: one step per .step-button in the panel, so the two
        always stay in sync. Each step is a picture, a divider and a
        caption.

        DEV NOTE: stepImages and stepCaptions are indexed by step
        number, so each must hold one entry per .step-button, in order.
        The image files sit in the Images folder beside this file. ---- */

// DEV NOTE: zoomMin, zoomMax and zoomStep are multiples of the image's
// normal height. setZoom keeps each step's zoom inside that range.

const zoomMin = 1;
const zoomMax = 3;
const zoomStep = 0.25;

const stepImages = [
  'Images/Step1.jpeg',
  'Images/Step2.jpeg',
  'Images/Step3.jpeg',
  'Images/Step4.jpeg',
  'Images/Step5.jpeg'
];

const stepCaptions = [
  'Make the first two cuts.',
  'Make the angled cut. Ask someone to hold the bamboo for you if you need it.',
  'Make a short cut, then flick off the waste bamboo.',
  'Sharpen the bottom of the stake.',
  'Finish by making the hole inside at the right point.'
];

// DEV NOTE: stepWarnings is indexed by step number like stepCaptions.
// An entry of null means the step has no warning, and buildStep adds no
// warning element for it.

const stepWarnings = [
  null,
  null,
  'Do not use a small knife if it is not strong enough',
  null,
  null
];

const steps = [];    // one state object per step

// DEV NOTE: briefPage uses the same .step class as a step, so it shares
// the show/hide animation, and the .brief-page class adds the hidden-bar
// scrolling. Its text is held in briefText and set with textContent, so
// it is never read as HTML. The brief image has no divider and is
// appended after the text, so it sits under it.

const briefText = 'The project is a bamboo fertiliser funnel. It will hold a fertiliser formula. The formula will leak out the hole in the bottom of the cup day by day, God willing.';

const briefPage = document.createElement('div');
briefPage.className = 'step brief-page';
briefPage.append(Object.assign(document.createElement('p'), {
  className: 'brief-text',
  textContent: briefText
}));

const briefButton = document.getElementById('read-brief-button');

const briefImage = document.createElement('img');
briefImage.className = 'brief-image';
briefImage.src = 'Images/Brief.jpeg';
briefImage.alt = 'Brief diagram';
briefPage.append(briefImage);

let current = null;  // the step on show, or null while the brief is on show

/* Builds one step's page and its state. */

function buildStep(index){
  const step = {
    index: index,
    zoom: zoomMin
  };

  step.el = document.createElement('div');
  step.el.className = 'step';

  const image = document.createElement('img');
  image.className = 'step-image';
  image.src = stepImages[index];
  image.alt = 'Step ' + (index + 1) + ' diagram';
  step.image = image;

  const scroll = document.createElement('div');
  scroll.className = 'step-scroll';
  scroll.append(image);

  const divider = document.createElement('hr');
  divider.className = 'divider';
  const stepMessage = document.createElement('p');
  stepMessage.className = 'step-message';
  stepMessage.textContent = stepCaptions[index];
  scroll.append(divider);
  scroll.append(stepMessage);

  if (stepWarnings[index] !== null){
    const stepWarning = document.createElement('p');
    stepWarning.className = 'step-warning';
    stepWarning.textContent = stepWarnings[index];
    scroll.append(stepWarning);
  }

  step.el.append(scroll);

  const controls = document.createElement('div');
  controls.className = 'step-controls';

  const zoomOutButton = document.createElement('button');
  zoomOutButton.className = 'zoom-button';
  zoomOutButton.type = 'button';
  zoomOutButton.textContent = '-';
  zoomOutButton.setAttribute('aria-label', 'Zoom out');
  zoomOutButton.addEventListener('click', () => setZoom(step, step.zoom - zoomStep));

  const zoomInButton = document.createElement('button');
  zoomInButton.className = 'zoom-button';
  zoomInButton.type = 'button';
  zoomInButton.textContent = '+';
  zoomInButton.setAttribute('aria-label', 'Zoom in');
  zoomInButton.addEventListener('click', () => setZoom(step, step.zoom + zoomStep));

  controls.append(zoomOutButton, zoomInButton);
  step.el.append(controls);

  return step;
}

/* Sets a step's zoom, kept between zoomMin and zoomMax, and passes it
   to the image through the --zoom custom property. */

function setZoom(step, value){
  step.zoom = Math.min(zoomMax, Math.max(zoomMin, value));
  step.image.style.setProperty('--zoom', step.zoom);
}

/* ---- Panel: always shows the state of the page on show. The step
        passed in is null while the brief is on show, so no STEP button
        is highlighted and the BRIEF button is. ---- */

function showPanelState(step){
  document.querySelectorAll('.step-button').forEach((button, i) => {
    button.classList.toggle('current', step !== null && i === step.index);
  });
  briefButton.classList.toggle('current', step === null);
}

/* Fades the page on show into the centre and brings the requested page
   up in its place (the animation is in the .step CSS). */

let activePage = null; // whichever page - a step or the brief - is on show

function showPage(el){
  if (el === activePage) return;
  if (activePage) activePage.classList.remove('active');
  el.classList.add('active');
  activePage = el;
}

const stepButtonCount = document.querySelectorAll('.step-button').length;
for (let i = 0; i < stepButtonCount; i++) steps.push(buildStep(i));
document.getElementById('container').append(...steps.map(step => step.el), briefPage);

current = steps[0];
showPage(current.el);
showPanelState(current);

briefButton.addEventListener('click', () => {
  current = null;
  showPage(briefPage);
  showPanelState(current);
});

document.querySelectorAll('.step-button').forEach((button, i) => {
  button.addEventListener('click', () => {
    current = steps[i];
    showPage(current.el);
    showPanelState(current);
  });
});

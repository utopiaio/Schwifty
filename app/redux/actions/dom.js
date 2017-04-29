import anime from 'animejs';

function showElement(targets, duration = 750, easing = 'easeOutElastic') {
  return new Promise((resolve) => {
    anime({
      targets,
      translateY: ['100vh', '0vh'],
      duration,
      easing,
      complete() {
        resolve();
      },
    });
  });
}

function hideElement(targets, duration = 750, easing = 'easeInElastic') {
  return new Promise((resolve) => {
    anime({
      targets,
      opacity: 0,
      duration,
      complete() {
        resolve();
        anime({
          targets,
          duration: 0,
          translateY: ['0vh', '100vh'],
          easing,
        });
      },
    });
  });
}

module.exports = {
  showElement,
  hideElement,
};

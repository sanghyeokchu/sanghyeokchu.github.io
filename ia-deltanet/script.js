// Values from manuscript/tables/quantitative_lmms.tex (active table).
const videoScores = {
  2: [
    [54.4, 67.4, 51.6, 55.0],
    [59.5, 66.4, 51.9, 61.4],
    [59.4, 60.0, 55.2, 62.0],
    [58.6, 67.5, 52.4, 61.1],
    [65.4, 71.1, 55.2, 63.5],
    [63.2, 71.7, 56.7, 64.4]
  ],
  4: [
    [60.0, 70.2, 57.0, 56.9],
    [62.9, 69.1, 54.5, 63.1],
    [62.6, 66.2, 57.7, 64.5],
    [62.7, 70.0, 56.3, 64.2],
    [67.7, 75.0, 58.4, 64.6],
    [66.8, 75.4, 57.6, 65.8]
  ],
  8: [
    [66.3, 72.7, 58.7, 58.0],
    [64.9, 71.9, 55.9, 64.2],
    [66.4, 73.5, 58.3, 64.6],
    [67.5, 73.6, 58.1, 65.4],
    [70.1, 76.9, 59.2, 65.4],
    [68.8, 76.7, 58.1, 65.7]
  ]
};

const windowControls = document.querySelector('.window-controls');
const windowButtons = document.querySelectorAll('[data-window]');
const videoRows = document.querySelectorAll('#video-results tbody tr');
const DEFAULT_VIDEO_WINDOW = 8;

function showVideoResults(windowSize, { announce = true } = {}) {
  const scores = videoScores[windowSize];
  if (!scores) return;
  const best = scores[0].map((_, column) =>
    Math.max(...scores.slice(2, 5).map(row => row[column]))
  );
  videoRows.forEach((row, rowIndex) => {
    scores[rowIndex].forEach((score, column) => {
      const cell = row.cells[column + 2];
      const formatted = score.toFixed(1);
      if (rowIndex >= 2 && rowIndex <= 4 && score === best[column]) {
        const strong = document.createElement('strong');
        strong.textContent = formatted;
        cell.replaceChildren(strong);
      } else {
        cell.textContent = formatted;
      }
    });
  });
  windowButtons.forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.window === String(windowSize)));
  });
  document.getElementById('video-caption').textContent =
    `Streaming video QA accuracy (%) with the last ${windowSize} frames visible to the LLM.`;
  if (announce) {
    document.getElementById('results-announcement').textContent =
      `Showing results for ${windowSize} visible frames.`;
  }
}

windowButtons.forEach(button => {
  button.addEventListener('click', () => showVideoResults(button.dataset.window));
});
showVideoResults(DEFAULT_VIDEO_WINDOW, { announce: false });
windowControls.hidden = false;

const SECONDS_IN_YEAR = 31536000;
const SECONDS_IN_MONTH = 2629800;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

const getTimeAgo = (
  timestamp,
  string = '',
  years,
  months,
  days,
  hours,
  seconds
) => {
  isNaN(timestamp) &&
    (timestamp = Math.floor((new Date() - new Date(timestamp)) / 1000));
  let interval = Math.floor(timestamp / SECONDS_IN_YEAR);
  if (interval >= 1) {
    const newString = `${string}, ${interval.toString()}y`;
    return getTimeAgo(
      timestamp - interval * SECONDS_IN_YEAR,
      newString,
      interval,
      0,
      0,
      0,
      0
    );
  } else {
    interval = Math.floor(timestamp / SECONDS_IN_MONTH);
    if (interval >= 1) {
      const newString = `${string}, ${interval.toString()}mo`;
      return getTimeAgo(
        timestamp - interval * SECONDS_IN_MONTH,
        newString,
        years,
        interval,
        0,
        0,
        0
      );
    } else {
      interval = Math.floor(timestamp / SECONDS_IN_DAY);
      if (interval >= 1) {
        const newString = `${string}, ${interval.toString()}d`;
        return getTimeAgo(
          timestamp - interval * SECONDS_IN_DAY,
          newString,
          years,
          months,
          interval,
          0,
          0
        );
      } else {
        interval = Math.floor(timestamp / SECONDS_IN_HOUR);
        if (string) {
          return string;
        }
        if (interval >= 1) {
          const newString = `${string}, ${interval.toString()}h`;
          return getTimeAgo(
            timestamp - interval * SECONDS_IN_HOUR,
            newString,
            years,
            months,
            days,
            interval,
            0
          );
        } else {
          interval = Math.floor(timestamp / SECONDS_IN_MINUTE);
          if (interval >= 1) {
            const newString = `${string}, ${interval.toString()}m`;
            return getTimeAgo(
              timestamp - interval * SECONDS_IN_MINUTE,
              newString,
              years,
              months,
              days,
              hours,
              interval
            );
          } else {
            return string;
          }
        }
      }
    }
  }
  return;
};

const ready = (target = document, callback) => {
  if (target.readyState != 'loading') {
    callback();
  } else {
    target.addEventListener('DOMContentLoaded', callback);
  }
};

ready(window.document, () => {
  // get the start time
  const html = document.querySelector('html').textContent;
  const re = /startTime":(\d+?),/;
  const startTime = html.match(re)[1];

  const listed = new Date(Number(startTime)).toLocaleString();
  const timeAgo = getTimeAgo(listed).replace(',', '');

  const template = document.createElement('div');
  const h1 = document.querySelector('h1');
  h1.insertAdjacentElement('afterend', template);

  fetch(chrome.runtime.getURL('content/template.html'))
    .then((response) => {
      response.text().then((text) => {
        template.innerHTML = text;
        const timeAgoElement = template.querySelector('.time-ago .value');
        const listedElement = template.querySelector('.listed .value');
        timeAgoElement.textContent = timeAgo;
        listedElement.textContent = listed;
      });
    })
    .catch((e) => {
      console.error(`Ebay Listing Time (extension) error: ${e}`);
    });

  // adding table to DOM
  const item = document.querySelector('h1');
});

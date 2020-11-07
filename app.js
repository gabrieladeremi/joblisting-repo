const jobElement = document.querySelector(".main__job-box");
const button = document.querySelector(".button");
const filter = document.querySelector(".filter");
const filterBox = document.querySelector(".search__container");
const cancel = document.querySelector(".cancel");
const clear = document.querySelector(".clear");

let filterArray = [];
let allJobs;
let removeJobs;

const fetchData = () => {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      allJobs = data;
      removeJobs = data;
      renderJobs(allJobs);
    });
};

const renderJobs = (data) => {
  return data.forEach(showJob);
};

const showJob = (job) => {
  jobElement.innerHTML += `<div class="job">
    <div class="job__container">
      <div class="job__img-box">
        <img src="${job.logo}" alt="${job.company}" class="job__img" />
      </div>
    <div class="job__content">
      <div class="job__meta">
        <p>${job.company}</p>
          ${job.new ? `<p class="new">NEW</p>` : ""}
          ${job.featured ? `<p class="featured">Featured</p>` : ""}
      </div>
      <h3 class="job__title">${job.position}</h3>
      <div class="job__date">
        <p>${job.postedAt}</p>
        <p>${job.contract}</p>
        <p>${job.location}</p>
      </div>
      </div>
        <div class="job__description">
          <button onclick="searchButtonListener(event)" class="button"  data-role="${
            job.level
          }">${job.level}</button> 
          <button onclick="searchButtonListener(event)"  class="button" data-role="${
            job.role
          }">${job.role}</button>
          ${job.languages.map(
            (lang) =>
              `<button onclick="searchButtonListener(event)" class="button"  data-role="${lang}">${lang}</button>`
          )}
          ${job.tools.map(
            (tool) =>
              `<button onclick="searchButtonListener(event)" class="button" data-role="${tool}">${tool}</button>`
          )}
        </div>
    </div>
  </div>
        `;
};

const searchButtonListener = (event) => {
  const query = event.target.dataset.role;
  const isQueried = filterArray.includes(query);
  if (isQueried) {
    return;
  }
  jobElement.innerHTML = "";
  filterArray.push(query);
  if (filterArray.length > 0) {
    // filter.classList.remove("")
    filter.classList.add("active");
  }
  const markup = `
  <div class="search">
  <p class="search__item" data-role=${query}>${query}</p>
  <p onclick="cancelFilter(event)" class="cancel">X</p>
  </div>
  `;
  filterBox.insertAdjacentHTML("beforeend", markup);
  filterResult(query);
  console.log(filterArray);
};

const filterResult = (query) => {
  const newJobs = allJobs.filter((job) => {
    return (
      job.role === query ||
      job.level === query ||
      job.languages.includes(query) ||
      job.tools.includes(query)
    );
  });
  allJobs = newJobs;
  renderJobs(newJobs);
};

clear.addEventListener("click", (e) => {
  filterArray = [];
  filterBox.innerHTML = "";
  filter.classList.remove("active");
  jobElement.innerHTML = "";
  allJobs = removeJobs;
  renderJobs(allJobs);
});

const cancelFilter = (event) => {
  const searchItem = event.target.previousElementSibling;
  const role = searchItem.dataset.role;
  const newFilter = filterArray.filter((s) => s !== role);
  filterArray = newFilter;
  if (filterArray.length === 0) filter.classList.remove("active");
  jobElement.innerHTML = "";
  const search = event.target.parentElement;
  search.classList.add("remove");
  let newJobs = removeJobs.filter((job) => {
    return (
      filterArray.includes(job.role) ||
      filterArray.includes(job.level) ||
      filterArray.every((el) => {
        return job.languages.indexOf(el) !== -1;
      }) ||
      filterArray.every((el) => {
        return job.tools.indexOf(el) !== -1;
      })
    );
  });
  if (newJobs.length === 0) newJobs = removeJobs;
  allJobs = newJobs;
  renderJobs(newJobs);
};

fetchData();

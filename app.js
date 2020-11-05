const jobElement = document.querySelector(".main__container");
const filter = document.querySelector(".filter");
const filterBox = document.querySelector(".filter__container");
const cancel = document.querySelector(".cancel");

let filterArray = [];
let allJobs;
let removeJobs;

window.addEventListener("load", () => {
  const buttons = document.querySelectorAll(".button");
  const button = Array.from(buttons);
  button.forEach((role) => {
    role.addEventListener("click", (event) =>
      searchButtonListener(event, role)
    );
  });
});

const searchButtonListener = (event, role) => {
  const query = event.target.dataset.role;
  const isQueried = filterArray.includes(event.target.dataset.role);
  if (isQueried) {
    return;
  }
  filterArray.push(query);
  if (filterArray.length > 0) filter.classList.add("active");
  const markup = `
  <div class="search">
  <p class="search__item" data-role=${query}>${query}</p>
  <p onclick="cancelFilter(event)" class="cancel">X</p>
  </div>
  `;
  filterBox.insertAdjacentHTML("beforeend", markup);
  filterResult(role);
};

const cancelFilter = (event) => {
  const searchItem = event.target.previousElementSibling;
  const role = searchItem.dataset.role;
  const newFilter = filterArray.filter((s) => s !== role);
  filterArray = newFilter;
  if (filterArray.length === 0) filter.classList.remove("active");
  const search = event.target.parentElement;
  search.classList.add("remove");

  let newJobs = removeJobs.filter((job) => {
    let langs;
    job.languages.forEach((lang) => {
      return (langs = lang);
    });
    let t;
    job.tools.forEach((tool) => {
      return (t = tool);
    });

    return (
      filterArray.includes(job.role) ||
      filterArray.includes(job.level) ||
      filterArray.includes(langs) ||
      filterArray.includes(t)
    );
  });
  if (newJobs.length === 0) newJobs = removeJobs;
  console.log(newJobs);
  allJobs = newJobs;
  crazyjobs(newJobs);
};

const filterResult = (button) => {
  const role = button.dataset.role;
  const newJobs = allJobs.filter((job) => {
    return (
      job.role === role ||
      job.level === role ||
      job.languages.includes(role) ||
      job.tools.includes(role)
    );
  });
  allJobs = newJobs;
  crazyjobs(newJobs);
};

const crazyjobs = (data) => {
  return data.forEach(showJob);
};

const showJob = (job) => {
  const markup = `<div class="job">
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
          <button class="button"  data-role="${job.level}">${job.level}</button>
          <button  class="button" data-role="${job.role}">${job.role}</button>
          ${job.languages.map(
            (lang, i) =>
              `<button  class="button"  data-role="${lang}">${lang}</button>`
          )}
          ${job.tools.map(
            (tool, i) =>
              `<button  class="button" data-role="${tool}">${tool}</button>`
          )}
        </div>
    </div>
  </div>
        `;
  jobElement.insertAdjacentHTML("beforeend", markup);
};

const fetchData = () => {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      // console.log("Showing jobs");
      allJobs = data;
      removeJobs = data;
      crazyjobs(allJobs);
    });
};

fetchData();

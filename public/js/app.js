const specsTableHeaders = ["Manufacturer", "Storage", "OS", "Camera"];
// Just for reference ^^
const httpInit = {    // For CORS
  method: 'GET',
  mode: 'cors',
  cache: 'default'
};

// Creates the "specs and description" DOM element
const constructPhoneDescriptionTableDOMElements = (phoneDescriptionTable, specs, description) => {
  let descriptionContainerDiv = document.createElement("div");
  let descriptionLiEl = "";
  let descriptionSpanEl = "";
  // Iterate trough a prestored array of specs headings
  for (header in specsTableHeaders) {
    // Add specs heading and information from the API data
    descriptionLiEl = document.createElement("li");
    descriptionSpanEl = document.createElement("span");
    descriptionLiEl.innerHTML = specsTableHeaders[header] + ": ";
    descriptionSpanEl.innerHTML = specs[specsTableHeaders[header].toLowerCase()];
    descriptionLiEl.appendChild(descriptionSpanEl);
    descriptionContainerDiv.appendChild(descriptionLiEl);
  }
  // Add the product description section to DOM
  descriptionLiEl = document.createElement("li");
  descriptionSpanEl = document.createElement("span");
  descriptionLiEl.innerHTML = "Description: ";
  descriptionSpanEl.innerHTML = description;
  descriptionLiEl.appendChild(descriptionSpanEl);
  descriptionContainerDiv.appendChild(descriptionLiEl);
  return descriptionContainerDiv;
};

// Clears all products from the DOM
const removePhoneDataFromDOMElements = (phoneData) => {
  const phonesParent = document.getElementById("products-container");
  const phonesChild = document.getElementById("products-list");
  const newEmptyChild = descriptionLiEl = document.createElement("ul");
  newEmptyChild.id = "products-list";
  newEmptyChild.classList.add("products-list");
  phonesParent.removeChild(phonesChild);
  phonesParent.appendChild(newEmptyChild);
  // Store node
  // Remove node from DOM (with all children)
  // Add stored node to DOM
}

// Adds one product to the DOM
const insertPhoneDataIntoDOMElements = (phoneData) => {

  const phones = document.getElementById("products-list");

  // Create all elements together
  let phoneElement = document.createElement("li");
  let phoneImageLink = document.createElement("a");
  let phoneImage = document.createElement("img");

  let phoneName = document.createElement("h2");
  let phoneNameLink = document.createElement("a");
  let phoneDescriptionTable = document.createElement("ul");
  let phoneDescriptionTableContent = document.createElement("li");
  let phonePrice = document.createElement("p");

  // Construct product photo element
  phoneImageLink.href = "#";
  phoneImageLink.classList.add("product-photo");
  phoneImage.src = "http://"+phoneData.image.small;
  phoneImage.height = 130;
  phoneImage.alt = phoneData.name;
  phoneImageLink.appendChild(phoneImage);

  // Construct phone name link element
  phoneNameLink.href = "#";
  phoneNameLink.innerHTML = phoneData.name;
  phoneName.appendChild(phoneNameLink);

  // Construct phone description table element
  phoneDescriptionTable.classList.add("product-description");
  phoneDescriptionTable.appendChild(constructPhoneDescriptionTableDOMElements(phoneDescriptionTable, phoneData.specs, phoneData.description));

  // Construct phone price element
  phonePrice.classList.add("product-price");
  phonePrice.innerHTML = phoneData.price;

  // Construct the full phone element
  phoneElement.appendChild(phoneImageLink);
  phoneElement.appendChild(phoneNameLink);
  phoneElement.appendChild(phoneDescriptionTable);
  phoneElement.appendChild(phonePrice);

  // Add phone element to the product table DOM
  phones.appendChild(phoneElement);
};

// Gets JSON data and updates DOM asyncronously
async function getProcessedData() {
  try {
    // If an API call has already been made for this session
    // there is no need to make another API call
    if (!sessionStorage['productData']) {
      // Make API call for all products and store in the session
      var response = await fetch('http://localhost:3000/phones', httpInit);
      response = await response.json();
      sessionStorage.setItem('productData', await JSON.stringify(response));
      // Translate JSON data to a string
    } else {
      // Retrieve product data from the session
      var response = await sessionStorage.getItem('productData');
      response = await JSON.parse(response);
      // Translate String data to a JSON
    }
    for (var data in response) {
      // Will load a dom element for each product in the JSON file
      if (response.hasOwnProperty(data)) {
        await insertPhoneDataIntoDOMElements(response[data]);
      }
    }
  } catch(e) {
    console.log(e);
  }
}

// Global hash table of selected filters
let currentFilters = new Map([]);

// An object to handle filter changes
const handleFilterChange = (id, key, value, isChecked) => {

  // Update DOM after filter change
  const updateDom = (currentData) => {
    removePhoneDataFromDOMElements();
    for (var product in currentData) {
      insertPhoneDataIntoDOMElements(currentData[product]);
    }
  };

  // Applys filter change to data
  const applyFilters = () => {
    let data = JSON.parse(sessionStorage.getItem('productData'));
    let filteredData = data;
    for (var key of currentFilters.keys()) {
        let filter = currentFilters.get(key);
        filteredData = filteredData.filter(product => product.specs[filter[0]] == filter[1]);
    };
    // After data is filtered, update the DOM
    updateDom(filteredData);
  };

  // Adds selected filter to globally stored filters
  const addFilter = () => {
    filter = [key, value];
    currentFilters.set(id, filter);
  };

  // Removes selected from globally stored filters
  const removeFilter = () => {
    currentFilters.delete(id);
  };

  // If checked or unchecked => apply or remove filter
  if(isChecked) {
    addFilter();
  } else {
    removeFilter();
  }

  // Apply filter changes to data
  applyFilters();
};

// When a button or checkbox is clicked
const filterTable = document.getElementById("filters");
filterTable.addEventListener('click', function(event) {
  const clickedElement = event.target;

  if (clickedElement.tagName.toLowerCase() === 'input') {

    const id = clickedElement.value;
    const isChecked = clickedElement.checked;
    let filterValue = clickedElement.parentElement.innerText;
    const specCategory = clickedElement.parentElement.parentElement.id;

    if (specCategory === 'storage' || specCategory === 'camera') {
      filterValue = filterValue.replace(/\D/g,'');
      console.log(filterValue);
    }

    handleFilterChange(id, specCategory, filterValue, isChecked);
  }
});

// When the "clear filters" button is clicked
const clearFilterButton = document.getElementById("clear-filters");
clearFilterButton.addEventListener('click', function(event) {
  getProcessedData();
});

// When the page gets loaded or refreshed
document.addEventListener("DOMContentLoaded", () => {
  getProcessedData();
});

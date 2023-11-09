const menuList = document.querySelector('.products')
const berger = document.querySelector('.berger')
const searchInput = document.querySelector('.search__input')
const loading = document.querySelector(".loading__element");
const buttonsContainer = document.querySelector(".buttons-container");
const option = document.querySelector(".option");
const leftSide = document.querySelector(".left__side");
const error = document.querySelector(".error");
const footer = document.querySelector(".footer");
const leftTree = document.querySelector(".left__tree");

// events
searchInput.addEventListener("input", searchItemsByName);

// store menu items from api
let menuItems = null;

// function to get items from api
const fetchMenuItems = async () => {
  try {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/search.php?s"
    );
    const data = await response.data;
    menuItems = data.meals;

    // get all categories to create button by its name
    const categories = menuItems.reduce((acc, item) => {
        if (item.strCategory && !acc.includes(item.strCategory)) {
          acc.push(item.strCategory);
        }
        return acc;
      },
      ["All"]
    );
    showLoadeing()
    
    // create button for each category
    createCategoryButtons(categories);
    
    displayMenuItems(menuItems);
  } catch (err) {
    error.innerText = ` ${err.message} !`
    footer.style.display = "none"
    leftTree.style.display = "none"

  }
};

// function to show items
const displayMenuItems = (items) => {
  menuList.innerHTML = "";

  // no items exist
  if (items.length === 0) {
    menuList.innerHTML = `<h2 class='not-found-text'>Item Doesnt Exist!</h2>`;
  }
  items.map((item) => {
    const menuItem = `
    <div class='product'>
    <div class='menu-item'>
        <img src='${item.strMealThumb}' alt='${item.strMeal}' class='product__image' />
        <h3 class='product__title'>${item.strMeal}<h3>
    </div>
    </div>
    `;

    menuList.innerHTML += menuItem;
  });
};

// SEARCH MENU ITEMS BY ITS NAME
function searchItemsByName() {
  const searchedText = searchInput.value.toLowerCase().trim();

  const filteredItmes = menuItems.filter((item) => {
    const matchedItems = item.strMeal.toLowerCase().includes(searchedText);
    return matchedItems;
  });

  // update menu list
  displayMenuItems(filteredItmes);
}

// function to create category buttons
const createCategoryButtons = (categories) => {
  categories.map((category) => {
    const button = `
    <div class='category'>
    <button type="button"
     data-category='${category}'
     class="category__name"
     onclick='filterItemsByCategory(this)'
    >${category}</button>
    </div>
    `;
    buttonsContainer.innerHTML += button;
  });
};

// function to filter items by its category
const filterItemsByCategory = (btn) => {
  const category = btn.dataset.category;

  const filteredItems = menuItems.filter((item) => {
    const matchedItems =
      item.strCategory.toLowerCase() === category.toLowerCase();
    return matchedItems;
  });

  searchInput.value = "";
  displayMenuItems(filteredItems);

  // show all items when click to all button
  if (category === "All") {
    displayMenuItems(menuItems);
  }
};

fetchMenuItems();



// OPEN AND CLOSE BERGER BUTTON WHEN CLICK
berger.addEventListener('click',()=>{
    berger.classList.toggle('exit')
    option.classList.toggle('active__option')
    leftSide.classList.toggle('active__side')
})


const showLoadeing = ()=>{
  loading.style.display = "none"
}
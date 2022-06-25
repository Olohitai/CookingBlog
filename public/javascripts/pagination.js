const paginate = document.querySelectorAll(".paginate");
const $recipesContainer = $("#recipes-container");

// // paginate.addEventListener("click", function (e) {
// //   e.preventDefault();
// //   fetch(this.href)
// //     .then((res) => res.json())
// //     .then((data) => {
// //       for (const recipe of data.docs) {
// //         let template = generateRecipe(recipe);
// //         $recipesContainer.append(template);
// //       }
// //       let { nextPage } = data;
// //       this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
// //       recipes.features.push(...data.docs);
// //       map.getSource("recipes").setData(recipes);
// //     })
// //     .catch((err) => {
// //       "Error", err;
// //     });
// //   // alert("clicked");
// // });

// if (recipePage.hasNextPage === false) {
//   paginate.forEach((item) => (item.style.visiblity = "hidden"));
// }

paginate.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();
    fetch(this.href)
      .then((res) => res.json())
      .then((data) => {
        for (const recipe of data.docs) {
          let template = generateRecipe(recipe);
          $recipesContainer.append(template);
        }
        let { nextPage } = data;
        this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
        recipes.features.push(...data.docs);
      })
      .catch((err) => {
        "Error", err;
      });
    // alert("clicked");
  });
});

function generateRecipe(recipe) {
  let template = `<div class="card mb-3">
  <div class="row">
      <div class="col-md-4">
          <img class="img-fluid" alt="" src="${
            recipe.images.length
              ? recipe.images[0].url
              : "https://res.cloudinary.com/douqbebwk/image/upload/v1600103881/YelpCamp/lz8jjv2gyynjil7lswf4.png"
          }">
      </div>
      <div class="col-md-8">
          <div class="card-body">
              <h5 class="card-title">${recipe.name} </h5>

              <p class="card-text">${recipe.description.slice(0, 80)}...</p>
           
              <a class="btn btn-primary" href="/recipes/${recipe._id}">View ${
    recipe.name
  }</a>
          </div>
      </div>
  </div>
  </div>`;
  return template;
}

//---------------Infinite Scroll----------------------------//
// window.onscroll = function (ev) {
//   if (
//     window.innerHeight + Math.ceil(window.pageYOffset + 1) >=
//     document.body.scrollHeight
//   ) {
//     fetch(paginate.href)
//       .then((res) => res.json())
//       .then((data) => {
//         for (const recipe of data.docs) {
//           let template = generateRecipe(recipe);
//           $recipesContainer.append(template);
//         }
//         let { nextPage } = data;
//         paginate.href = paginate.href.replace(/page=\d+/, `page=${nextPage}`);
//         recipes.features.push(...data.docs);
//         map.getSource("recipes").setData(recipes);
//       })
//       .catch((err) => {
//         "Error", err;
//       });

//     function generateRecipe(recipe) {
//       let template = `<div class="card mb-3">
//       <div class="row">
//           <div class="col-md-4">
//               <img class="img-fluid" alt="" src="${
//                 recipe.images.length
//                   ? recipe.images[0].url
//                   : "https://res.cloudinary.com/douqbebwk/image/upload/v1600103881/YelpCamp/lz8jjv2gyynjil7lswf4.png"
//               }">
//           </div>
//           <div class="col-md-8">
//               <div class="card-body">
//                   <h5 class="card-title">${recipe.title} </h5>

//                   <p class="card-text">${recipe.description}</p>
//                   <p class="card-text">
//                       <small class="text-muted">${recipe.location}</small>
//                   </p>
//                   <a class="btn btn-primary" href="/recipes/${
//                     recipe._id
//                   }">View ${recipe.title}</a>
//               </div>
//           </div>
//       </div>
//       </div>`;
//       return template;
//     }
//   }
// };

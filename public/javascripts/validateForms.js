// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".validated-form");

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

$(document).ready(function () {
  $('[data-bs-toggle="popover"]').popover({
    html: true,
    sanitize: false,
    trigger: "focus",
    title: function () {
      return $("#popover-head").html();
    },
    content: function () {
      return $("#popover-content").html();
    },
    dismiss: function () {
      return $(".popover-dismiss").html();
    },
  });
});
$(document).ready(function () {
  $('[data-bs-toggle="popover-review"]').popover({
    html: true,
    sanitize: false,
    trigger: "focus",
    title: function () {
      return $("#popover-head").html();
    },
    content: function () {
      return $("#popover-review").html();
    },
    dismiss: function () {
      return $(".popover-dismiss").html();
    },
  });
});

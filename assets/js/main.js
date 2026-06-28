const initialPageHash = window.location.hash;





(function () {
  const toggle = document.getElementById("theme-toggle");

  const savedTheme = localStorage.getItem("theme");

  const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  const currentTheme = savedTheme || preferredTheme;

  if (!toggle) return;

  toggle.setAttribute("aria-pressed", currentTheme === "dark");

  toggle.addEventListener("click", () => {
    const html = document.documentElement;

    html.classList.add("theme-changing");

    const activeTheme = html.getAttribute("data-theme");
    const nextTheme = activeTheme === "dark" ? "light" : "dark";

    html.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    toggle.setAttribute("aria-pressed", nextTheme === "dark");

    clearTimeout(window.themeTransitionTimer);

    window.themeTransitionTimer = setTimeout(() => {
      html.classList.remove("theme-changing");
    }, 650);
  });
})();





const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});





document.querySelectorAll('.booking-select').forEach(select => {

  const toggle = select.querySelector('.booking-select-toggle');
  const menu = select.querySelector('.booking-select-menu');
  const options = select.querySelectorAll('li');
  const hiddenInput = select.querySelector('input');
  const label = toggle.querySelector('span');

  toggle.addEventListener('click', () => {

    document.querySelectorAll('.booking-select').forEach(other => {
      if (other !== select) {
        other.querySelector('.booking-select-menu').classList.remove('show');
        other.querySelector('.booking-select-toggle').classList.remove('active');
      }
    });

    menu.classList.toggle('show');
    toggle.classList.toggle('active');
  });

  options.forEach(option => {

    option.addEventListener('click', () => {

      label.textContent = option.textContent;
      toggle.classList.add("has-value");
      hiddenInput.value = option.dataset.value;

      menu.classList.remove('show');
      toggle.classList.remove('active');
    });

  });

});

document.addEventListener('click', e => {

  if (!e.target.closest('.booking-select')) {

    document.querySelectorAll('.booking-select-menu').forEach(menu => {
      menu.classList.remove('show');
    });

    document.querySelectorAll('.booking-select-toggle').forEach(toggle => {
      toggle.classList.remove('active');
    });

  }

});





const bookingDate = document.querySelector(".booking-date");

if (bookingDate) {
  const dateToggle = bookingDate.querySelector(".booking-date-toggle");
  const dateMenu = bookingDate.querySelector(".booking-calendar");
  const dateLabel = dateToggle.querySelector("span");
  const hiddenDate = bookingDate.querySelector('input[name="date"]');

  const calendarTitle = bookingDate.querySelector(".booking-calendar-title");
  const calendarGrid = bookingDate.querySelector(".booking-calendar-grid");
  const prevButton = bookingDate.querySelector(".booking-calendar-prev");
  const nextButton = bookingDate.querySelector(".booking-calendar-next");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let visibleYear = today.getFullYear();
  let visibleMonth = today.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function getMonthKey(year, month) {
    return `${year}-${String(month + 1).padStart(2, "0")}`;
  }

  function getRandomBookedDays(year, month) {
    const key = getMonthKey(year, month);
    const saved = sessionStorage.getItem(`booked-${key}`);

    if (saved) return JSON.parse(saved);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bookedDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      if (Math.random() < 0.18) {
        bookedDays.push(day);
      }
    }

    sessionStorage.setItem(`booked-${key}`, JSON.stringify(bookedDays));
    return bookedDays;
  }

  function isCurrentMonth() {
    return visibleYear === today.getFullYear() && visibleMonth === today.getMonth();
  }

  function renderCalendar() {
    calendarGrid.innerHTML = "";
    calendarTitle.textContent = `${monthNames[visibleMonth]} ${visibleYear}`;

    const firstDay = new Date(visibleYear, visibleMonth, 1);
    const daysInMonth = new Date(visibleYear, visibleMonth + 1, 0).getDate();

    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 7 : startDay;

    const bookedDays = getRandomBookedDays(visibleYear, visibleMonth);

    prevButton.classList.toggle("disabled", isCurrentMonth());

    for (let i = 1; i < startDay; i++) {
      const emptyButton = document.createElement("button");
      emptyButton.type = "button";
      emptyButton.classList.add("empty");
      calendarGrid.appendChild(emptyButton);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayButton = document.createElement("button");
      dayButton.type = "button";
      dayButton.textContent = day;

      const buttonDate = new Date(visibleYear, visibleMonth, day);
      buttonDate.setHours(0, 0, 0, 0);

      const isPastDate = buttonDate < today;
      const isBooked = bookedDays.includes(day);

      if (isPastDate) {
        dayButton.classList.add("disabled");
      }

      if (isBooked && !isPastDate) {
        dayButton.classList.add("booked");
      }

      dayButton.addEventListener("click", () => {
        if (dayButton.classList.contains("disabled") || dayButton.classList.contains("booked")) {
          return;
        }

        bookingDate.querySelectorAll(".booking-calendar-grid button").forEach(button => {
          button.classList.remove("selected");
        });

        dayButton.classList.add("selected");

        const selectedDate = new Date(visibleYear, visibleMonth, day);
        const displayDate = `${day} ${monthNames[visibleMonth]} ${visibleYear}`;
        const inputDate = selectedDate.toISOString().split("T")[0];

        dateLabel.textContent = displayDate;
        dateToggle.classList.add("has-value");
        hiddenDate.value = inputDate;

        dateMenu.classList.remove("show");
        dateToggle.classList.remove("active");
      });

      calendarGrid.appendChild(dayButton);
    }
  }

  function changeMonth(direction) {
    if (direction === "prev" && isCurrentMonth()) return;

    const fadeClass = direction === "next" ? "fade-out-left" : "fade-out-right";
    calendarGrid.classList.add(fadeClass);

    setTimeout(() => {
      if (direction === "next") {
        visibleMonth++;

        if (visibleMonth > 11) {
          visibleMonth = 0;
          visibleYear++;
        }
      }

      if (direction === "prev") {
        visibleMonth--;

        if (visibleMonth < 0) {
          visibleMonth = 11;
          visibleYear--;
        }
      }

      renderCalendar();
      calendarGrid.classList.remove("fade-out-left", "fade-out-right");
    }, 220);
  }

  dateToggle.addEventListener("click", () => {
    dateMenu.classList.toggle("show");
    dateToggle.classList.toggle("active");
    renderCalendar();
  });

  prevButton.addEventListener("click", () => {
    changeMonth("prev");
  });

  nextButton.addEventListener("click", () => {
    changeMonth("next");
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".booking-date")) {
      dateMenu.classList.remove("show");
      dateToggle.classList.remove("active");
    }
  });

  renderCalendar();
}





const bookingForm = document.querySelector(".booking-form");
const bookingMessage = document.querySelector("#bookingMessage");

if (bookingForm && bookingMessage) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    const requiredFields = bookingForm.querySelectorAll(
      'input[required], textarea[required], input[type="hidden"]'
    );

    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
      }
    });

    if (!isValid) {
      showBookingMessage("Please complete all booking fields before sending.", "error");
      return;
    }

    showBookingMessage("Sending your booking enquiry...", "sending");

    setTimeout(() => {
      showBookingMessage("Thank you. Your booking enquiry has been sent successfully.", "success");
      resetBookingForm();
    }, 1400);
  });

  function resetBookingForm() {
    bookingForm.reset();

    document.querySelectorAll(".booking-select-toggle").forEach(toggle => {
      toggle.classList.remove("has-value", "active");
    });

    document.querySelectorAll(".booking-select-toggle span").forEach((span, index) => {
      span.textContent = index === 0 ? "Guest Count" : "Booking Type";
    });

    const dateToggle = document.querySelector(".booking-date-toggle");
    const dateLabel = document.querySelector(".booking-date-toggle span");

    if (dateToggle && dateLabel) {
      dateToggle.classList.remove("has-value", "active");
      dateLabel.textContent = "Select Date";
    }

    document.querySelectorAll(".booking-calendar-grid button").forEach(button => {
      button.classList.remove("selected");
    });
  }

  function showBookingMessage(text, type) {
    bookingMessage.textContent = text;
    bookingMessage.className = `booking-message show ${type}`;

    clearTimeout(window.bookingMessageTimer);

    window.bookingMessageTimer = setTimeout(() => {
      bookingMessage.classList.remove("show");
    }, 3500);
  }
}





const contactForm = document.querySelector(".contact-message-form");
const contactMessage = document.querySelector("#contactMessage");

if (contactForm && contactMessage) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const requiredFields = contactForm.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
      }
    });

    if (!isValid) {
      showContactMessage("Please complete all contact fields before sending.", "error");
      return;
    }

    showContactMessage("Sending your message...", "sending");

    setTimeout(() => {
      showContactMessage("Thank you. Your message has been sent successfully.", "success");
      contactForm.reset();
    }, 1400);
  });

  function showContactMessage(text, type) {
    contactMessage.textContent = text;
    contactMessage.className = `contact-message show ${type}`;

    clearTimeout(window.contactMessageTimer);

    window.contactMessageTimer = setTimeout(() => {
      contactMessage.classList.remove("show");
    }, 3500);
  }
}





const menuFilterButtons = document.querySelectorAll(".menu-filters button");
const menuItems = document.querySelectorAll(".menu-item");

menuFilterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    menuFilterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    menuItems.forEach(item => {
      item.classList.add("fade-out");
    });

    setTimeout(() => {
      menuItems.forEach(item => {
        const itemCategory = item.dataset.category;
        const shouldShow = selectedCategory === "all" || itemCategory === selectedCategory;

        if (shouldShow) {
          item.classList.remove("hidden");
          item.classList.add("fade-out");
        } else {
          item.classList.add("hidden");
        }
      });

      setTimeout(() => {
        menuItems.forEach(item => {
          if (!item.classList.contains("hidden")) {
            item.classList.remove("fade-out");
          }
        });
      }, 30);

    }, 350);
  });
});





window.addEventListener("load", function () {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  if (initialPageHash) {
    return;
  }

  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 10);
});





document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]');

  function getOffset(targetId) {
    if (targetId === "#hero") return 125;
    return 80;
  }

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      e.preventDefault();

      const offset = getOffset(targetId);
      const start = window.pageYOffset;
      const end = target.getBoundingClientRect().top + window.pageYOffset - offset;
      const duration = 1000;
      let startTime = null;

      function smoothScroll(currentTime) {
        if (!startTime) startTime = currentTime;

        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, start + (end - start) * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      }

      requestAnimationFrame(smoothScroll);
      history.replaceState(null, null, window.location.pathname);
    });
  });
});





(function () {
  function isMobileOrTablet() {
    return window.matchMedia("(max-width: 1023px)").matches;
  }

  function getMobileOffset(targetId) {
    if (targetId === "#hero") return 95;
    if (targetId === "#booking") return 95;
    return 95;
  }

  function smoothScrollMobile(target, targetId) {
    const offset = getMobileOffset(targetId);
    const start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const end = target.getBoundingClientRect().top + start - offset;
    const distance = end - start;
    const duration = 900;

    let startTime = null;

    function animate(currentTime) {
      if (!startTime) startTime = currentTime;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const nextPosition = start + distance * ease;

      window.scrollTo(0, nextPosition);
      document.documentElement.scrollTop = nextPosition;
      document.body.scrollTop = nextPosition;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  function handleMobileIndexScroll(event) {
    if (!isMobileOrTablet()) return;
    if (!document.body.classList.contains("index-page")) return;

    const link = event.target.closest('a[href="#hero"], a[href="#booking"]');
    if (!link) return;

    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    document.body.classList.remove("mobile-nav-active");

    smoothScrollMobile(target, targetId);

    history.replaceState(null, null, window.location.pathname);
  }

  document.addEventListener("touchend", handleMobileIndexScroll, true);
  document.addEventListener("click", handleMobileIndexScroll, true);
})();





const header = document.querySelector("#header");

if (header) {
  function updateHeaderState() {
    if (window.scrollY > 10) {
      header.classList.add("header-shrink");
    } else {
      header.classList.remove("header-shrink");
    }
  }

  window.addEventListener("scroll", updateHeaderState);
  updateHeaderState();
}





const magneticLinks = document.querySelectorAll(".header .navmenu a");

magneticLinks.forEach(link => {
  link.addEventListener("mousemove", event => {
    if (window.innerWidth <= 992) return;

    const rect = link.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    link.style.transition = "color 0.4s ease, transform 0.25s ease-out";
    link.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  link.addEventListener("mouseleave", () => {
    link.style.transition = "color 0.4s ease, transform 0.35s ease";
    link.style.transform = "translate(0, 0)";
  });
});





function aosInit() {
  if (typeof AOS === "undefined") return;

  const isMobileOrTablet = window.innerWidth <= 1023;

  if (isMobileOrTablet) {
    document.body.classList.add("aos-disabled-mobile");

    document.querySelectorAll("[data-aos]").forEach(el => {
      el.classList.add("aos-animate");
      el.style.opacity = "1";
      el.style.transform = "none";
    });

    return;
  }

  AOS.init({
    duration: 650,
    easing: "ease-in-out",
    once: false,
    mirror: false,
    offset: 80
  });

  AOS.refreshHard();
}

function runPreloader() {
  if (window.preloaderHasRun) return;
  window.preloaderHasRun = true;

  const preloader = document.querySelector("#preloader");

  if (initialPageHash) {
    const target = document.querySelector(initialPageHash);

    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "instant"
      });

      history.replaceState(null, null, window.location.pathname);
    }
  }

  setTimeout(() => {
    if (preloader) {
      preloader.classList.add("hide");
    }

    document.body.classList.remove("preloader-active");

    aosInit();
  }, 1400);

  setTimeout(() => {
    if (preloader) {
      preloader.remove();
    }
  }, 3600);
}

if (document.body.classList.contains("menu-page")) {
  document.addEventListener("DOMContentLoaded", runPreloader);
} else {
  window.addEventListener("load", runPreloader);
}

setTimeout(runPreloader, 5000);





const mobileBurger = document.querySelector(".mobile-burger");
const mobileClose = document.querySelector(".mobile-nav-close");
const mobileDrawer = document.querySelector(".mobile-nav-drawer");

if (mobileBurger) {
  mobileBurger.addEventListener("click", event => {
    event.stopPropagation();
    document.body.classList.add("mobile-nav-active");
  });
}

if (mobileClose) {
  mobileClose.addEventListener("click", event => {
    event.stopPropagation();
    document.body.classList.remove("mobile-nav-active");
  });
}

document.addEventListener("click", event => {
  if (!document.body.classList.contains("mobile-nav-active")) return;

  if (mobileDrawer && mobileDrawer.contains(event.target)) {
    return;
  }

  if (mobileBurger && mobileBurger.contains(event.target)) {
    return;
  }

  document.body.classList.remove("mobile-nav-active");
});
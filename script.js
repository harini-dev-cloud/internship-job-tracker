let applications =
    JSON.parse(localStorage.getItem("applications")) || [];

let editId = null;

const form = document.getElementById("applicationForm");
const applicationList =
    document.getElementById("applicationList");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");


// Add / Update Application
form.addEventListener("submit", function (event) {

    event.preventDefault();

    const application = {

        id: editId || Date.now(),

        company:
            document.getElementById("company").value,

        role:
            document.getElementById("role").value,

        type:
            document.getElementById("type").value,

        location:
            document.getElementById("location").value,

        appliedDate:
            document.getElementById("appliedDate").value,

        status:
            document.getElementById("status").value,

        jobLink:
            document.getElementById("jobLink").value,

        notes:
            document.getElementById("notes").value
    };


    if (editId) {

        applications =
            applications.map(function (item) {

                return item.id === editId
                    ? application
                    : item;

            });

        editId = null;

    } else {

        applications.push(application);

    }


    saveApplications();

    form.reset();

    document.querySelector(
        "button[type='submit']"
    ).textContent = "Add Application";

    renderApplications();

});


// Save data in LocalStorage
function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}


// Display Applications
function renderApplications() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedStatus =
        filterStatus.value;


    const filteredApplications =
        applications.filter(function (application) {

            const matchesSearch =
                application.company
                    .toLowerCase()
                    .includes(searchText) ||

                application.role
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                selectedStatus === "All" ||
                application.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    applicationList.innerHTML = "";


    if (filteredApplications.length === 0) {

        applicationList.innerHTML =
            "<p>No applications found.</p>";

        updateDashboard();

        return;
    }


    filteredApplications.forEach(function (application) {

        const card =
            document.createElement("div");

        card.className =
            "application-card";


        card.innerHTML = `

            <h3>
                ${application.company}
            </h3>

            <p>
                ${application.role}
            </p>

            <div class="application-info">

                Type: ${application.type}
                <br>

                Location: ${application.location}
                <br>

                Applied Date: ${application.appliedDate}

            </div>

            <span class="status">
                ${application.status}
            </span>

            <br><br>

            <button onclick="editApplication(${application.id})">
                Edit
            </button>

            <button onclick="deleteApplication(${application.id})">
                Delete
            </button>

            ${
                application.jobLink
                ? `
                <button onclick="openJobLink('${application.jobLink}')">
                    Open Job Link
                </button>
                `
                : ""
            }

        `;


        applicationList.appendChild(card);

    });


    updateDashboard();

}


// Edit Application
function editApplication(id) {

    const application =
        applications.find(function (item) {

            return item.id === id;

        });


    if (!application) return;


    document.getElementById("company").value =
        application.company;

    document.getElementById("role").value =
        application.role;

    document.getElementById("type").value =
        application.type;

    document.getElementById("location").value =
        application.location;

    document.getElementById("appliedDate").value =
        application.appliedDate;

    document.getElementById("status").value =
        application.status;

    document.getElementById("jobLink").value =
        application.jobLink;

    document.getElementById("notes").value =
        application.notes;


    editId = id;


    document.querySelector(
        "button[type='submit']"
    ).textContent = "Update Application";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete Application
function deleteApplication(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmDelete) return;


    applications =
        applications.filter(function (application) {

            return application.id !== id;

        });


    saveApplications();

    renderApplications();

}


// Open Job Link
function openJobLink(link) {

    window.open(link, "_blank");

}


// Dashboard
function updateDashboard() {

    document.getElementById("totalApplications")
        .textContent = applications.length;


    document.getElementById("appliedCount")
        .textContent =
        applications.filter(function (application) {

            return application.status === "Applied";

        }).length;


    document.getElementById("shortlistedCount")
        .textContent =
        applications.filter(function (application) {

            return application.status === "Shortlisted";

        }).length;


    document.getElementById("interviewCount")
        .textContent =
        applications.filter(function (application) {

            return application.status === "Interview";

        }).length;


    document.getElementById("selectedCount")
        .textContent =
        applications.filter(function (application) {

            return application.status === "Selected";

        }).length;

}


// Search
searchInput.addEventListener(
    "input",
    renderApplications
);


// Filter
filterStatus.addEventListener(
    "change",
    renderApplications
);


// Load saved applications
renderApplications();
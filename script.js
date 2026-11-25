const scholarshipList = document.getElementById("scholarship-list")
const resultsCount = document.getElementById("results-count")
const searchInput = document.getElementById("scholarship-search")
const universityFilter = document.getElementById("university-filter")
const typeFilter = document.getElementById("type-filter")
const searchForm = document.getElementById("search-form")

let allScholarships = []
function displayScholarships(scholarships){
    scholarshipList.innerHTML = ""
    if(scholarships.length === 0){
        scholarshipList.textContent=
            "No scholarships found. Try changing your search or filters."
        resultsCount.textContent = "0 scholarships found"
        return

    }
    scholarships.forEach(scholarship =>{
        const card = document.createElement("div")
        card.classList.add("scholarship-card")
        card.innerHTML=  `
            <h3>${scholarship.name || "Unnamed scholarship"}</h3>
            <p>University: ${scholarship.university || "Not specified"}</p>
            <p>Type: ${scholarship.type || "Not specified"}</p>
            <p>Value: ${scholarship.value || "Not specified"}</p>
            <p>Eligibility: ${scholarship.eligibility || "Not specified"}</p>
            <p>${scholarship.notes || ""}</p>
        `;

        scholarshipList.appendChild(card);
    })
    resultsCount.textContent = 
        `${scholarships.length} scholarships found`
}
function prepareScholarships(data){
     if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Invalid scholarship data");
     }
     allScholarships = []
     data.data.forEach(university =>{
        if (!Array.isArray(university.scholarships)) {
            return;
        }

        const option = document.createElement("option");
        option.value = university.university_code;
        option.textContent = university.university_code;
        if(
             university.university_code &&
            !Array.from(universityFilter.options).some(
                existing => existing.value === university.university_code
        )
    ){
        universityFilter.appendChild(option)
    }
    university.scholarships.forEach(scholarship=>{
        allScholarships.push({
            ...scholarship,
            university:university.university_code
        })
    })
     })
     displayScholarships(allScholarships)
}
function applyFilters(){
     const selectedUniversity = universityFilter.value;
    const selectedType = typeFilter.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredScholarships = allScholarships.filter(scholarship=>{
        const matchUniversity =
            selectedUniversity === ""||
            scholarship.university === selectedUniversity
        const matchType = 
            selectedType==="" ||
            (scholarship.type || "").toLowerCase() === selectedType
        const matchSearch =
            (scholarship.name || "").toLowerCase().includes(searchTerm) ||
            (scholarship.university || "").toLowerCase().includes(searchTerm);

        return matchUniversity && matchType && matchSearch;

    })
    displayScholarships(filteredScholarships)
}
async function loadScholarships() {
    
    let data
    try{
        try{
            const response = await fetch(
                "https://api.worqnow.ai/education/uk/scholarships?country=GM&limit=20"
            )
            if(!response.ok){
                throw new Error("Failed to fetch scholarship data")
            }
            data = await response.json()
            if(!data.data || !Array.isArray(data.data)){
                 throw new Error("Invalid API response");
            }
          
    }catch (apiError){
         console.warn("API unavailable. Loading local JSON...", apiError);

            const response = await fetch("data/scholarships.json");

            if (!response.ok) {
                throw new Error("Unable to load local scholarship data");
    }
    data = await response.json()
    console.log("Scholarships loaded from local JSON.");
    resultsCount.textContent =
                "Showing locally saved scholarship information.";
    
    }
    universityFilter.innerHTML =
        '<option value="">All Universities</option>'
    prepareScholarships(data)
}catch (error){
    console.log("API and local fallback both failed:", error)

    scholarshipList.textContent=
        "Unable to load scholarships. Please try again.";

    resultsCount.textContent = "Scholarship data unavailable.";  
    }
}

universityFilter.addEventListener("change", applyFilters)
typeFilter.addEventListener("change", applyFilters)
searchInput.addEventListener("input", applyFilters)

searchForm.addEventListener("submit", event=>{
    event.preventDefault()
    applyFilters()
})
loadScholarships()
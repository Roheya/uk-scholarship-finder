const scholarshipList = document.getElementById("scholarship-list")
const resultsCount = document.getElementById("results-count")
const searchInput = document.getElementById("scholarship-search")
const universityFilter = document.getElementById("university-filter")
const typeFilter = document.getElementById("type-filter")
const searchForm = document.getElementById("search-form")
fetch("https://api.worqnow.ai/education/uk/scholarships?country=GM&limit=20")
    .then(response => {
        if(!response.ok){
            throw new Error("Failed to fetch scholarship data")
        }
        return response.json()
    })
    .then(data =>{
        if (!data.data || data.data.length === 0){
            resultsCount.textContent="No scholarship data available."
            return
        }
        
        let allScholarships = []
        function displayScholarships(scholarships){
            scholarshipList.innerHTML = ""
            if(scholarships.length === 0){
                scholarshipList.textContent = "No scholarships found. Try changing your search or filters"
                resultsCount.textContent = "0 scholarships found"
                return
            }
            scholarships.forEach(scholarship=>{
            const card = document.createElement("div")
            card.classList.add("scholarship-card")
            card.innerHTML=`
                <h3>${scholarship.name}</h3>
                <p>University: ${scholarship.university}</p>
                <p>Type: ${scholarship.type}</p>
                <p>Value: ${scholarship.value}</p>
                <p>Eligibility: ${scholarship.eligibility}</p>
                <p>${scholarship.notes}</p>
            `
            scholarshipList.appendChild(card)  
            })

            resultsCount.textContent = `${scholarships.length} scholarships found`
        }
        data.data.forEach(university=>{
            const option = document.createElement("option")
            option.value = university.university_code
            option.textContent = university.university_code

            universityFilter.appendChild(option)
        })
        data.data.forEach(university =>{
        university.scholarships.forEach(scholarship=>{
          
           allScholarships.push({
            ...scholarship,
            university: university.university_code
           })
           
        })
       })
       displayScholarships(allScholarships)
       function applyFilters(){
        const selectedUniversity = universityFilter.value
        const selectedType = typeFilter.value
        const searchTerm = searchInput.value.toLowerCase()
        const filteredScholarships = allScholarships.filter(scholarship=>{
            const matchUniversity = 
                selectedUniversity === "" ||
                scholarship.university === selectedUniversity

            const matchType=
                selectedType === "" ||
                scholarship.type.toLowerCase() === selectedType
            const matchSearch =
                scholarship.name.toLowerCase().includes(searchTerm) ||
                scholarship.university.toLowerCase().includes(searchTerm)
            return matchUniversity && matchType && matchSearch
        })
        displayScholarships(filteredScholarships)
       }
       universityFilter.addEventListener("change", applyFilters)
    
        typeFilter.addEventListener("change", applyFilters)
        searchInput.addEventListener("input", applyFilters)
        searchForm.addEventListener("submit", event=>{
            event.preventDefault()
            applyFilters()
        })
})
    .catch(error =>{
        console.error("Error loading scholarships:", error)
        resultsCount.textContent = "Unable to load scholarships. Please try again."
    });

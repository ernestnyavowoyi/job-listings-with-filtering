
// $(document).ready(main);

document.addEventListener('DOMContentLoaded', () => {
    main();
});

const categories = {
    'role': '',
    'level': '',
    'languages': [],
    'tools': []
};

document.getElementById('clearFiltersBtn').addEventListener('click', event => {
    event.preventDefault();
    categories.role = '';
    categories.level = '';
    categories.languages = [];
    categories.tools = [];
    displayListings(jobListings);
});

// $('#clearFiltersBtn').on('click', event => {
//     event.preventDefault();
//     categories.role = '';
//     categories.level = '';
//     categories.languages = [];
//     categories.tools = [];
//     displayListings(jobListings);
// });

// const filterLiItems = [];

let listingContainer; // store a reference to the container holding all the job listings on the page
let jobListings; // hold the parsed json of job listings

async function main() {
    // listingContainer = $('#listing-container')[0];
    listingContainer = document.getElementById('listing-container');
    // return;
    try {
        jobListings = await readJson();
        // console.log(jobListings);
        console.log('Data loading is completed with result.');
    } catch (error) {
        alert('There was a problem with the json data!');
        return false;
    }

    // show the initial job listings on the page...
    displayListings(jobListings);
}

// read the json data from a file
const readJson = async function () {
    // read the json file
    try {
        const response = await fetch('./data.json');
        if (response.ok) {
            const json = await response.json();
            // console.log(json);
            return json;
        }

    } catch (error) {
        console.log(error);
    }
}


// Displays the formatted array at a DOM location
const displayListings = arr => {

    // console.log(arr);

    let fullJobListings = '';

    arr.forEach(listing => {

        console.log(listing);

        let tools = '';
        let languages = '';

        if (listing.languages.length) {
            listing.languages.forEach(element => {
                languages += `<a href="#" class="language">${element}</a>`;
            });
        }

        if (listing.tools.length) {
            listing.tools.forEach(element => {
                console.log(`working with element ${element}`);
                tools += `<a href="#" class="tool">${element}</a>`;
            });
        }

        const listingEl = `
        <div class="listing-company ${listing.featured ? 'featured-job-listing' : ''}">

            <div class="listing-header">
                <div class="company-logo">
                    <img src="${listing.logo}" alt="${listing.company} logo">
                </div>

                <div class="listing-info">
                    <div class="company-info">
                        <p class="company-name">${listing.company}</p>
                        <div class="extra-info">
                            ${listing.new ? '<p class="new">new!</p>' : ''}
                            ${listing.featured ? '<p class="featured">featured</p>' : ''}
                        </div>
                    </div>

                    <div class="job-title">
                        <a>${listing.position}</a>
                    </div>

                    <div class="listing-meta">
                        <p class="date-posted">${listing.postedAt}</p>
                        <p class="employment-type">${listing.contract}</p>
                        <p class="countries">${listing.location}</p>
                    </div>

                    <div class="hr-sm-only">
                        <hr>
                    </div>
                </div>

            </div>

            <div class="categories">
                <a class="role" href="#">${listing.role}</a>
                <a class="level" href="#">${listing.level}</a>
                ${languages}
                ${tools}
            </div>

    </div>
        `;

        fullJobListings += listingEl;
    });


    // clear the container
    // const filterContentContainer = $('#filter-content ul');
    // const filterContentContainer = document.getElementById('filter-content').getElementsByTagName('ul');
    const filterContentContainer = document.querySelector('#filter-content ul');

    filterContentContainer.innerHTML = '';
    let isFilterActive = false; // a boolean flag to determine whether or not filters has been applied by the user

    for (const property in categories) {
        if (typeof categories[property] === 'object') {
            for (const prop in categories[property]) {
                let dataValues = `data-filter-type="${property}" data-filter-value="${categories[property][prop]}"`;
                if (categories[property][prop].length) {
                    isFilterActive = true;
                    let li = document.createElement('li');
                    li.innerHTML += `<p>${categories[property][prop]}</p> <a class="removeFilterBtn" ${dataValues} href="#"><img src="./images/icon-remove.svg" alt="&times;"></a>`;
                    filterContentContainer.append(li);
                }
            }
        } else if (typeof categories[property] === 'string' && categories[property].length) {
            isFilterActive = true;
            let dataValues = `data-filter-type="${property}" data-filter-value="${categories[property]}"`;
            let li = document.createElement('li');
            li.innerHTML += `<p>${categories[property]}</p> <a class="removeFilterBtn" ${dataValues} href="#"><img src="./images/icon-remove.svg" alt="&times;"></a>`;
            filterContentContainer.append(li);
        }

    }


    let filterContainer = document.getElementById('filter-container');
    // If there are no filters applied, we hide the filterBox (or container)
    if (!isFilterActive) {
        // $('#filter-container').addClass('d-hide');
        filterContainer.classList.add('d-hide');
    } else {
        // $("#filter-container").removeClass('d-hide');
        filterContainer.classList.remove('d-hide');
    }

    // replace the current job listings with this new fullJobListings

    console.log('doing replacement');
    listingContainer.innerHTML = fullJobListings;

    // listingContainer.replaceChildren(fullJobListings);

    console.log('replacement complete!');

    console.log('setting up event handlers');
    setupEventHandlers();
    console.log('done setting up event handlers...');

}




// Set up the event handlers for the project
function setupEventHandlers() {

    // $('a.role').on('click', event => {
    //     event.preventDefault();
    //     // alert('role clicked!');
    //     role = event.target.innerHTML.trim();
    //     console.log(role);
    //     if(categories.role.trim() !== role) {
    //         categories.role = role.trim();
    //     }

    //     displayListings(filterResults());
    //     return;
    // });


    document.querySelectorAll('a.role').forEach(el => {
        el.addEventListener('click', event => {
            event.preventDefault();
            // alert('role clicked!');
            let role = event.target.innerHTML.trim();
            console.log(role);
            if (categories.role.trim() !== role) {
                categories.role = role.trim();
            }

            displayListings(filterResults());
            return;
        });
    });

    // $('a.level').on('click', event => {
    //     event.preventDefault();
    //     // alert('level clicked!');
    //     level = event.target.innerHTML.trim();
    //     if(categories.level.trim() !== level) {
    //         categories.level = level;
    //     }

    //     displayListings(filterResults());

    //     return;
    // });


    document.querySelectorAll('a.level').forEach(el => {
        el.addEventListener('click', event => {
            event.preventDefault();
            // alert('level clicked!');
            let level = event.target.innerHTML.trim();
            if (categories.level.trim() !== level) {
                categories.level = level;
            }

            displayListings(filterResults());
            return;
        });
    });

    // $('a.language').on('click', event => {
    //     event.preventDefault();
    //     // alert('language clicked!');
    //     lang = event.target.innerHTML.trim();
    //     if(categories.languages.includes(lang)) {
    //         categories.languages.splice(categories.languages.indexOf(lang), 1);
    //     } else {
    //         categories.languages.push(lang);
    //     }

    //     displayListings(filterResults());

    //     return;
    // });


    document.querySelectorAll('a.language').forEach(el => {
        el.addEventListener('click', event => {
            event.preventDefault();
            // alert('language clicked!');
            let lang = event.target.innerHTML.trim();
            if (categories.languages.includes(lang)) {
                categories.languages.splice(categories.languages.indexOf(lang), 1);
            } else {
                categories.languages.push(lang);
            }

            displayListings(filterResults());
            return;
        });
    });

    // $('a.tool').on('click', event => {
    //     event.preventDefault();
    //     // alert('tool clicked!');
    //     tool = event.target.innerHTML.trim();
    //     // filters['tools'] = tool;
    //     if(categories.tools.includes(tool)) {
    //         categories.tools.splice(categories.tools.indexOf(tool), 1);
    //     } else {
    //         categories.tools.push(tool);
    //     }

    //     displayListings(filterResults());

    //     return;
    // });


    document.querySelectorAll('a.tool').forEach(el => {
        el.addEventListener('click', event => {
            event.preventDefault();
            // alert('tool clicked!');
            let tool = event.target.innerHTML.trim();
            // filters['tools'] = tool;
            if (categories.tools.includes(tool)) {
                categories.tools.splice(categories.tools.indexOf(tool), 1);
            } else {
                categories.tools.push(tool);
            }

            displayListings(filterResults());
            return;
        });
    });




    // $('a.removeFilterBtn').on('click', event => {

    //     event.preventDefault();
    //     event.target.closest('.removeFilterBtn').previousElementSibling.innerText;
    //     console.log($(event.target.closest('.removeFilterBtn')).attr('data-filter-type'));
    //     const filterType = $(event.target.closest('.removeFilterBtn')).attr('data-filter-type').trim();
    //     const filterValue = $(event.target.closest('.removeFilterBtn')).attr('data-filter-value').trim();

    //     console.log(`Filter type ==> ${filterType}, Filter Value is below`);
    //     console.log(filterValue);

    //     // ensure that filter is part of the categories to filter by
    //     console.log('Before...');
    //     console.log(categories);


    //     if(categories[filterType]) {
    //         if(typeof categories[filterType] === 'string') {
    //             if(categories[filterType].trim().length) {
    //                 // the filter is already set, so remove it
    //                 categories[filterType] = '';
    //             } 
    //         } else if(typeof categories[filterType] === 'object') {

    //             console.log(categories[filterType].includes(filterValue));
    //             if(categories[filterType].includes(filterValue)) {
    //                 // if the filter is already present, remove it from the array
    //                 categories[filterType].splice(categories[filterType].indexOf(filterValue), 1);                    
    //             } 
    //         } else {
    //             // this is not expected becuase it does not match the nature of the categories object which we declared
    //             console.log('hmmmm.... Not expecting that.');
    //         }
    //     }

    //     console.log('After...');
    //     console.log(categories);

    //     console.log('updating the listings...');
    //     displayListings(filterResults());

    // });


    document.querySelectorAll('a.removeFilterBtn').forEach(el => {
        el.addEventListener('click', event => {
            event.preventDefault();
            console.log(event);
            console.log(event.target.closest('.removeFilterBtn').previousElementSibling.innerText);
            // console.log($(event.target.closest('.removeFilterBtn')).attr('data-filter-type'));
            
            // const filterType = $(event.target.closest('.removeFilterBtn')).attr('data-filter-type').trim();
            const filterType = event.target.closest('.removeFilterBtn').getAttribute('data-filter-type').trim();

            // const filterValue = $(event.target.closest('.removeFilterBtn')).attr('data-filter-value').trim();
            const filterValue = event.target.closest('.removeFilterBtn').getAttribute('data-filter-value').trim();

            // console.log(`Filter type ==> ${filterType}, Filter Value is below`);
            // console.log(filterValue);

            // ensure that filter is part of the categories to filter by
            // console.log('Before...');
            // console.log(categories);


            if (categories[filterType]) {
                if (typeof categories[filterType] === 'string') {
                    if (categories[filterType].trim().length) {
                        // the filter is already set, so remove it
                        categories[filterType] = '';
                    }
                } else if (typeof categories[filterType] === 'object') {

                    console.log(categories[filterType].includes(filterValue));
                    if (categories[filterType].includes(filterValue)) {
                        // if the filter is already present, remove it from the array
                        categories[filterType].splice(categories[filterType].indexOf(filterValue), 1);
                    }
                } else {
                    // this else block is not expected to run becuase it does not match the nature of the categories object which we declared. However if it does, (: then it means that something is wrong...
                    console.log('hmmmm.... Not expecting that.');
                }
            }

            // console.log('After...');
            // console.log(categories);

            // console.log('updating the listings...');
            displayListings(filterResults());
            return;
        });
    });

}



// Filter the job listings using the filters
function filterResults() {
    return jobListings.filter(el => {

        let output = [];
        for (const prop in categories) {
            if (el[prop]) {

                // logic for arrays
                if (typeof el[prop] === 'object') {
                    // ensure each element of the prop is found in the 
                    const cats = categories[prop];
                    if (cats.length) {
                        //   console.log('below is the array elements...');

                        let arrLen = cats.length;
                        let itemCount = 0;
                        for (const item in cats) {
                            // console.log(el[prop], cats[item]);
                            if (itemCount < arrLen) {
                                if (!el[prop].includes(cats[item])) {
                                    // return false;
                                    output.push(false);
                                } else {
                                    itemCount++;
                                }
                            }
                        }

                        // return true if we gone through the list of elements successfully.
                        if (arrLen === itemCount) {
                            // console.log('Over here, we are returning true...');
                            output.push(true);
                            // console.log(output);
                            // return true;
                        }
                    }

                } else if (typeof el[prop] === 'string' && categories[prop].length) {
                    // console.log(`${el[prop]} vrs. ${categories[prop]}`);
                    if (el[prop] === categories[prop]) {
                        output.push(true);
                        // return true;
                    } else {
                        output.push(false);
                    }
                }
            }
        }

        // console.log(`Finally!`);

        // console.log(output);
        // console.log(`Output length: ${output.length}`);

        // console.log((output.filter(el => el === true).length === output.length));

        return output.length === 0 || (output.filter(el => el === true).length === output.length);
    })
}
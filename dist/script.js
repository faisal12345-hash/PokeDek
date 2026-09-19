const getPokemonList = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
const getType = "https://pokeapi.co/api/v2/type";

let pokemonList = [];
let pokemonData = '';
let pokemonDataById = [];
let pageSize = 20;
let currentPage = 1;
let totalItems;
let nextUrl = '';
let prevUrl = '';
let colorCodesByType = {
    "normal": "#DDCBD0",
    "fighting": "#FCC1B0",
    "flying": "#B2D2E8",
    "poison": "#CFB7ED",
    "ground": "#F4D1A6",
    "rock": "#C5AEA8",
    "bug": "#C1E0C8",
    "ghost": "#D7C2D7",
    "grass": "#C0D4C8",
    "steel": "#C2D4CE",
    "fire": "#EDC2C4",
    "water": "#CBD5ED",
    "electric": "#E2E2A0",
    "psychic": "#DDC0CF",
    "ice": "#C7D7DF",
    "dragon": "#CADCDF",
    "dark": "#C6C5E3",
    "fairy": "#E4C0CF",
    "unknown": "#C0DFDD",
    "shadow": "#CACACA"
};

// Defining async function
async function getPokemonListing(url) {
    pokemonList = [];
    pokemonData = '';
    await fetch(url).then(response => {
        return response.json();
    }).then((data) => {
        totalItems = data?.count;
        nextUrl = data?.next;
        prevUrl = data?.previous;
        if (!data?.results?.length) {
            document.getElementById('listingData').innerHTML = 'No data found!';
        }
        pokemonList = data?.results;
        pokemonList.map(list => {
            fetch(list.url).then(res => {
                return res.json();
            }).then(data => {
                pokemonDataById.push(data);
                pokemonData += `
        <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 card pokemon-card" data-pokemon-type=${JSON.stringify(data.types)} style="background: ${getGradient(data.types)}" data-actual-id=${data?.id} data-pokemon-img=${data?.sprites?.front_default} data-toggle="modal" data-pokemon-name="${data?.name}" data-pokemon-id="${String(data?.id)?.padStart(3, '0')}" data-target="#exampleModal">
        <img class="card-img-top" src=${data?.sprites?.front_default} alt="No pokemon found">
        <div class="card-body text-center">
            <p class="card-text pokemon-detail-text name-text">${data?.name}</p>
            <p class="card-text pokemon-detail-text id-text">${String(data?.id)?.padStart(3, '0')}</p>
        </div>
        </div>`
                document.getElementById('listingData').innerHTML = pokemonData;
            }).catch(err => {
                document.getElementById('listingData').innerHTML = 'No data found!' || err;
                pokemonList = [];
                pokemonData = '';
            })
        })
    });
}

function getGradient(types) {
    let colorGradient = [];
    types.forEach(data => {
        colorGradient.push(colorCodesByType[data.type.name]);
    });
    return colorGradient.length > 1 ? "linear-gradient(to bottom," + colorGradient.join(",") + ")" :
        colorGradient.toString();
}

$(function () {
    $('[data-toggle="popover"]').popover();
});

$('html').on('click', function (e) {
    if (typeof $(e.target).data('original-title') == 'undefined' &&
        !$(e.target).parents().is('.popover.in')) {
        $('[data-original-title]').popover('hide');
    }
});


async function getPokemonType(url) {
    fetch(url).then(response => {
        return response.json();
    }).then(type => {
        let pokemonType = '';
        pokemonType += `<option hidden=true value=null>Select</option>`
        type?.results?.map(data => {
            pokemonType += `<option value=${data?.name}>${data?.name}</option>`;
            document.getElementById('pokemonType').innerHTML = pokemonType;
        })
    })
}

function filterType(event) {
    let filteredType = '';
    pokemonDataById.filter((type) => {
        let typeName = [];
        type.types.forEach(element => {
            typeName.push(element.type.name)
        });
        document.getElementById('filterInput').value = '';
        typeName.map(data => {
            if (data.includes(event.target.value)) {
                filteredType += `
            <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 card pokemon-card" data-pokemon-type=${JSON.stringify(type.types)} data-actual-id=${type?.id} style="background: ${getGradient(type.types)}" data-pokemon-img=${type?.sprites?.front_default} data-toggle="modal" data-pokemon-name="${type?.name}" data-pokemon-id="${String(type?.id)?.padStart(3, '0')}" data-target="#exampleModal">
                <img class="card-img-top" src=${type?.sprites?.front_default} alt="No pokemon found">
                <div class="card-body text-center">
                    <p class="card-text pokemon-detail-text name-text">${type?.name}</p>
                    <p class="card-text pokemon-detail-text id-text">${String(type?.id)?.padStart(3, '0')}</p>
                </div>
            </div>`
            }
        });
        document.getElementById('listingData').innerHTML = filteredType;
    });
    if (!filteredType) {
        document.getElementById('listingData').innerHTML = 'No data found!';
    }
}

function filterData(event) {
    let filteredData = '';
    setTimeout(() => {
        document.getElementById("pokemonType").value = null;
        pokemonDataById.filter(res => {
            if (res.name.includes(event.target.value) || String(res.id).includes(event.target.value)) {
                filteredData += `
                <div class="col-md-2 col-lg-2 col-xs-12 col-sm-12 card pokemon-card" data-pokemon-type=${JSON.stringify(res.types)} data-actual-id=${res?.id} style="background: ${getGradient(res.types)}" data-pokemon-img=${res?.sprites?.front_default} data-toggle="modal" data-pokemon-name="${res?.name}" data-pokemon-id="${String(res?.id)?.padStart(3, '0')}" data-target="#exampleModal">
                <img class="card-img-top" src=${res?.sprites?.front_default} alt="No pokemon found">
                <div class="card-body text-center">
                    <p class="card-text pokemon-detail-text name-text">${res?.name}</p>
                    <p class="card-text pokemon-detail-text id-text">${String(res?.id)?.padStart(3, '0')}</p>
                </div>
                </div>`
            }
            document.getElementById('listingData').innerHTML = filteredData;
        })
        if (!filteredData) {
            document.getElementById('listingData').innerHTML = 'No data found!';
        }
    }, 500);
}

getPokemonListing(getPokemonList);
getPokemonType(getType);


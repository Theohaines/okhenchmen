function init(){
    checkFTS();
}

function checkFTS(){ //Check for FirstTimeSignon e.g profile not setup (Yippee we do a fetch call EVERY time we need to check this :sob:)
    fetch("/checkfts", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);

        if (res[0] == 307){
            window.location.href = "/myprofile"
        }
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

checkFTS();
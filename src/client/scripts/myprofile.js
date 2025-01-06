function init(){
    getMyProfile()
}

function getMyProfile(){
    fetch("/getprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    }).then(response => {
        return response.json();
    }) .then(data => {
        res = JSON.parse(data);

        if (res[0] != 200){
            alert(res)
        }
    }).catch(error => {
        console.error('Fetch error:', error);
    });
}

function submitMyProfile(){

}

init();
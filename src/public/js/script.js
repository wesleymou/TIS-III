//Variaveis Globais
var serverAddress = "localhost";
var port = 4000;

//Listeners ----------------------------------------------------------------------------
document.addEventListener('wheel', () => { }, {
    passive: true
});
document.addEventListener('mousewheel', () => { }, {
    passive: true
});
document.addEventListener('touchstart', () => { }, {
    passive: true
});
document.addEventListener('touchmove', () => { }, {
    passive: true
});

//Funções -------------------------------------------------------------------------------
function sendRequest(path, method, data, err) {
    var xmlhttp = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
        xmlhttp.onreadystatechange = (e) => {
            if (xmlhttp.readyState !== 4) {
                return;
            }
            if (xmlhttp.status >= 200) {
                return;
            } else {
                err.apply(this);
            }
        };
        xmlhttp.open(method, path, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(data);
    });
}